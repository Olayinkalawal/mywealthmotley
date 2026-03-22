import { v } from "convex/values";
import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

// ── Helper: resolve the current user from auth ──────────────────────
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();

  return user;
}

// ── Generate an upload URL for client-side file uploads ─────────────
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Please sign in first");
    return await ctx.storage.generateUploadUrl();
  },
});

// ── Create a screenshot import record (status: pending) ─────────────
export const createImportRecord = mutation({
  args: {
    imageStorageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    return await ctx.db.insert("screenshotImports", {
      userId: user._id,
      imageStorageId: args.imageStorageId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ── Internal mutation: update import status (called from action) ────
export const _updateImportStatus = internalMutation({
  args: {
    importId: v.id("screenshotImports"),
    status: v.string(),
    extractedData: v.optional(v.string()),
    platform: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    imagePurged: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, any> = {
      status: args.status,
    };
    if (args.extractedData !== undefined) updates.extractedData = args.extractedData;
    if (args.platform !== undefined) updates.platform = args.platform;
    if (args.errorMessage !== undefined) updates.errorMessage = args.errorMessage;
    if (args.imagePurged) {
      updates.imagePurged = true;
      updates.imageStorageId = undefined; // Clear the storage reference
    }
    if (args.status === "completed" || args.status === "failed") {
      updates.processedAt = Date.now();
    }
    await ctx.db.patch(args.importId, updates);
  },
});

// ── Internal query: count recent imports for rate limiting ───────────
export const countRecentImports = internalQuery({
  args: { userId: v.id("users"), sinceTimestamp: v.number() },
  handler: async (ctx, args) => {
    const imports = await ctx.db
      .query("screenshotImports")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    return imports.filter((i) => i.createdAt >= args.sinceTimestamp).length;
  },
});

// ── Save extracted holdings as manual assets ─────────────────────────
export const saveExtractedHoldings = mutation({
  args: {
    importId: v.id("screenshotImports"),
    platform: v.string(),
    holdings: v.array(
      v.object({
        name: v.string(),
        ticker: v.optional(v.string()),
        quantity: v.optional(v.number()),
        value: v.number(),
        currency: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    // Calculate total value for the group
    const totalValue = args.holdings.reduce((sum, h) => sum + h.value, 0);
    // Determine the most common currency
    const currencyCount: Record<string, number> = {};
    for (const h of args.holdings) {
      currencyCount[h.currency] = (currencyCount[h.currency] || 0) + 1;
    }
    const primaryCurrency = Object.entries(currencyCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "USD";

    // Create a single manualAsset with holdings array
    const assetId = await ctx.db.insert("manualAssets", {
      userId: user._id,
      name: `${args.platform} Portfolio`,
      type: "investment",
      platform: args.platform,
      value: totalValue,
      currency: primaryCurrency,
      lastUpdated: Date.now(),
      screenshotImportId: args.importId,
      holdings: args.holdings.map((h) => ({
        ticker: h.ticker || undefined,
        name: h.name,
        quantity: h.quantity || undefined,
        value: h.value,
        currency: h.currency,
      })),
    });

    // Mark import as completed
    await ctx.db.patch(args.importId, {
      status: "completed",
      platform: args.platform,
      processedAt: Date.now(),
    });

    return assetId;
  },
});

// ── The AI action: analyze screenshot with GPT-4o Vision ────────────
// Maximum allowed file size: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const analyzeScreenshot = action({
  args: {
    imageStorageId: v.string(),
    importId: v.id("screenshotImports"),
  },
  handler: async (ctx, args) => {
    // Resolve the authenticated user for audit logging and rate limiting
    const identity = await ctx.auth.getUserIdentity();
    let auditUserId: any = null;
    if (identity) {
      const user = await ctx.runQuery(internal.aiSholz.getUserByClerkId, {
        clerkId: identity.subject,
      });
      auditUserId = user?._id ?? null;
    }

    // ── Rate limiting ─────────────────────────────────────────────────
    if (auditUserId) {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      const [importsLastHour, importsLastDay] = await Promise.all([
        ctx.runQuery(internal.screenshotImport.countRecentImports, {
          userId: auditUserId,
          sinceTimestamp: oneHourAgo,
        }),
        ctx.runQuery(internal.screenshotImport.countRecentImports, {
          userId: auditUserId,
          sinceTimestamp: oneDayAgo,
        }),
      ]);

      if (importsLastHour >= 10) {
        throw new Error(
          "You've reached the upload limit. Please try again later."
        );
      }
      if (importsLastDay >= 30) {
        throw new Error(
          "You've reached the daily upload limit. Please try again tomorrow."
        );
      }
    }

    // Update status to processing
    await ctx.runMutation(internal.screenshotImport._updateImportStatus, {
      importId: args.importId,
      status: "processing",
    });

    try {
      // Server-side file size validation via storage metadata
      const metadata = await ctx.storage.getMetadata(args.imageStorageId);
      if (!metadata) {
        throw new Error("Could not retrieve file metadata from storage");
      }
      if (metadata.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `File too large (${(metadata.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 10MB.`
        );
      }

      // Get the image URL from Convex file storage
      const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
      if (!imageUrl) {
        throw new Error("Could not retrieve image from storage");
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this investment app screenshot. Extract ALL visible holdings/investments.
For each holding, provide:
- name (string): The full name of the stock, ETF, fund, or investment
- ticker (string or null): The ticker symbol if visible (e.g. AAPL, VUSA, VOO)
- quantity (number or null): Number of shares/units if visible
- value (number): The current value shown (use the number without currency symbols)
- currency (string): The currency code like "GBP", "USD", "NGN", "EUR"
- confidence (number 0-100): How confident you are in the extraction accuracy for this holding. 100 = clearly visible and unambiguous, 50 = partially visible or unclear, 0 = guessing.

Also identify the platform/app name if visible (e.g. "Trading 212", "Cowrywise", "Bamboo", "eToro", "Risevest").

Return ONLY valid JSON in exactly this format, with no markdown or extra text:
{"platform":"DetectedPlatformName","holdings":[{"name":"Stock Name","ticker":"TICK","quantity":5,"value":1234.56,"currency":"USD","confidence":95}]}

If you cannot identify specific holdings, still return the JSON structure with whatever you can extract. If the image is not an investment screenshot, return: {"platform":"Unknown","holdings":[]}`,
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const aiContent = response.choices[0]?.message?.content ?? "";

      // Parse the AI response - try to extract JSON
      let parsed: { platform: string; holdings: any[] };
      try {
        // Strip markdown code fences if present
        const jsonStr = aiContent
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        // Try to find JSON in the response
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("AI response was not valid JSON");
        }
      }

      // Validate the structure
      if (!parsed.holdings || !Array.isArray(parsed.holdings)) {
        parsed = { platform: parsed.platform || "Unknown", holdings: [] };
      }

      // Normalize holdings
      const normalizedHoldings = parsed.holdings.map((h: any) => ({
        name: String(h.name || "Unknown"),
        ticker: h.ticker ? String(h.ticker) : null,
        quantity: typeof h.quantity === "number" ? h.quantity : null,
        value: typeof h.value === "number" ? h.value : 0,
        currency: String(h.currency || "USD"),
        confidence: typeof h.confidence === "number" ? Math.min(100, Math.max(0, Math.round(h.confidence))) : 75,
      }));

      const result = {
        platform: parsed.platform || "Unknown",
        holdings: normalizedHoldings,
      };

      // Audit log: record successful AI extraction
      if (auditUserId) {
        await ctx.runMutation(internal.users.logAuditEvent, {
          userId: auditUserId,
          action: "screenshot_import",
          details: `AI extracted ${normalizedHoldings.length} holdings from screenshot`,
        });
      }

      // ── Process & Purge: delete the screenshot from storage ──────────
      // Compliance: original images are never stored long-term.
      // Delete BEFORE updating status so the image is gone even if the
      // status update fails.
      await ctx.storage.delete(args.imageStorageId);

      // Update the import record with extracted data and mark image as purged
      await ctx.runMutation(internal.screenshotImport._updateImportStatus, {
        importId: args.importId,
        status: "review",
        extractedData: JSON.stringify(result),
        platform: result.platform,
        imagePurged: true,
      });

      // Audit log: record screenshot purge
      if (auditUserId) {
        await ctx.runMutation(internal.users.logAuditEvent, {
          userId: auditUserId,
          action: "screenshot_purge",
          details: "Screenshot image deleted after extraction",
        });
      }

      return result;
    } catch (error: any) {
      // ── Purge on failure too: never retain user screenshots ──────────
      try {
        await ctx.storage.delete(args.imageStorageId);
      } catch {
        // Storage deletion failed — image may already be gone; log but don't mask the original error
        console.error("Failed to purge screenshot on error path:", args.imageStorageId);
      }

      // Mark as failed and flag the image as purged
      await ctx.runMutation(internal.screenshotImport._updateImportStatus, {
        importId: args.importId,
        status: "failed",
        errorMessage: error.message || "Unknown error during analysis",
        imagePurged: true,
      });
      throw error;
    }
  },
});

// ── Query: get import record by ID ──────────────────────────────────
export const getImportRecord = query({
  args: {
    importId: v.id("screenshotImports"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.importId);
  },
});

// ── Query: get user's import history ────────────────────────────────
export const getUserImports = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("screenshotImports")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
