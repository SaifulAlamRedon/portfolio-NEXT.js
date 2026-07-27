"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { isAxiosError } from "axios";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsService } from "@/services/settings.service";
import type { SettingsWriteDto } from "@/types";

const EDITABLE_SETTINGS_FIELDS: Array<keyof SettingsWriteDto> = [
  "siteName",
  "logo",
  "favicon",
  "resumeUrl",
  "aboutMe",
  "contactEmail",
  "phone",
  "address",
  "github",
  "linkedIn",
  "facebook",
  "twitter",
  "themeColor",
];

function cleanSettingsPayload(data: SettingsWriteDto): Partial<SettingsWriteDto> {
  return EDITABLE_SETTINGS_FIELDS.reduce<Partial<SettingsWriteDto>>((payload, field) => {
    const value = data[field];
    const cleaned = typeof value === "string" ? value.trim() : value;

    if (cleaned !== "" && cleaned !== null && cleaned !== undefined) {
      payload[field] = cleaned;
    }

    return payload;
  }, {});
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.get,
  });

  const { register, reset, handleSubmit } = useForm<SettingsWriteDto>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: (data: SettingsWriteDto) => settingsService.update(cleanSettingsPayload(data)),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? error.message
        : "Failed to save settings";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  return (
    <div>
      <AdminPageHeader title="Settings" description="Site-wide info shown across your public pages." />

      {!isLoading && !settings && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">No settings found yet</p>
            <p className="mt-1 text-muted-foreground">
              This usually means the record hasn&apos;t been created on the backend yet, or{" "}
              <code className="rounded bg-muted px-1">GET /settings</code> returned an error.
              Fill in the form below and save to create it.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="max-w-2xl space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="siteName">Site name</Label>
              <Input id="siteName" {...register("siteName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" type="email" {...register("contactEmail")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address / location</Label>
              <Input id="address" {...register("address")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="aboutMe">About me</Label>
              <Textarea id="aboutMe" rows={5} {...register("aboutMe")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logo">Logo / photo URL</Label>
              <Input id="logo" {...register("logo")} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input id="favicon" {...register("favicon")} placeholder="https://…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input id="resumeUrl" {...register("resumeUrl")} placeholder="https://…/resume.pdf" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" {...register("github")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedIn">LinkedIn URL</Label>
              <Input id="linkedIn" {...register("linkedIn")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="twitter">Twitter / X URL</Label>
              <Input id="twitter" {...register("twitter")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" {...register("facebook")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="themeColor">Theme color</Label>
              <Input id="themeColor" {...register("themeColor")} placeholder="#8b5cf6" />
            </div>
          </div>

          <Button type="submit" variant="gradient" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
          {error && (
            <p className="text-xs text-muted-foreground">
              Note: loading settings failed once — check that your backend&apos;s{" "}
              <code className="rounded bg-muted px-1">GET /settings</code> route is reachable and,
              since you&apos;re logged in as admin here, that your token hasn&apos;t expired.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
