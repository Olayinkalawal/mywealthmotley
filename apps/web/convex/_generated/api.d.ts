/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiSholz from "../aiSholz.js";
import type * as allMyMoney from "../allMyMoney.js";
import type * as blackTax from "../blackTax.js";
import type * as budgets from "../budgets.js";
import type * as crons from "../crons.js";
import type * as dataRetention from "../dataRetention.js";
import type * as exchangeRates from "../exchangeRates.js";
import type * as financialNews from "../financialNews.js";
import type * as http from "../http.js";
import type * as japa from "../japa.js";
import type * as mono from "../mono.js";
import type * as notifications from "../notifications.js";
import type * as savingsGoals from "../savingsGoals.js";
import type * as screenshotImport from "../screenshotImport.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiSholz: typeof aiSholz;
  allMyMoney: typeof allMyMoney;
  blackTax: typeof blackTax;
  budgets: typeof budgets;
  crons: typeof crons;
  dataRetention: typeof dataRetention;
  exchangeRates: typeof exchangeRates;
  financialNews: typeof financialNews;
  http: typeof http;
  japa: typeof japa;
  mono: typeof mono;
  notifications: typeof notifications;
  savingsGoals: typeof savingsGoals;
  screenshotImport: typeof screenshotImport;
  transactions: typeof transactions;
  users: typeof users;
  waitlist: typeof waitlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
