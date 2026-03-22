"use client";

import * as React from "react";
import { PencilSimple, Check, X } from "@phosphor-icons/react";
import { CircleFlag } from "react-circle-flags";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";

export function WmSettingsProfile() {
  const { user } = useUser();
  const [firstName, setFirstName] = React.useState(user?.firstName ?? "");
  const [lastName, setLastName] = React.useState(user?.lastName ?? "");
  const [country, setCountry] = React.useState(
    (user?.publicMetadata?.country as string) ?? "NG"
  );

  // Keep in sync if clerk user loads after initial render
  React.useEffect(() => {
    if (user) {
      setFirstName((prev) => prev || user.firstName || "");
      setLastName((prev) => prev || user.lastName || "");
    }
  }, [user]);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editFirstName, setEditFirstName] = React.useState(firstName);
  const [editLastName, setEditLastName] = React.useState(lastName);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "WM";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const handleSaveName = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await user?.update({
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
      });
      setFirstName(editFirstName.trim());
      setLastName(editLastName.trim());
      setIsEditingName(false);
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setIsEditingName(false);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    toast.success("Country updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Profile</CardTitle>
        <CardDescription>
          Your personal information and account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and name */}
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {isEditingName ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-first-name">First name</Label>
                    <Input
                      id="edit-first-name"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-last-name">Last name</Label>
                    <Input
                      id="edit-last-name"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveName}>
                    <Check className="size-3.5" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="size-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {firstName} {lastName}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsEditingName(true)}
                    aria-label="Edit name"
                  >
                    <PencilSimple className="size-3.5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Country selector */}
        <div className="space-y-2">
          <Label htmlFor="country-select">Country</Label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger id="country-select" className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="inline-flex size-5 shrink-0 overflow-hidden rounded-full"><CircleFlag countryCode={c.code.toLowerCase()} height={20} width={20} /></span>
                    <span>{c.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This helps us tailor financial content to your region
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
