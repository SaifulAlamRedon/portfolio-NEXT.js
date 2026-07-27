"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Loader2, Briefcase } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { experienceService } from "@/services/experience.service";
import type { Experience, ExperienceWriteDto } from "@/types";

interface ExpFormValues {
  company: string;
  position: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  technologies: string;
  description: string;
}

function ExperienceForm({ exp, onDone }: { exp?: Experience; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue } = useForm<ExpFormValues>({
    defaultValues: {
      company: exp?.company ?? "",
      position: exp?.position ?? "",
      employmentType: exp?.employmentType ?? "Full-time",
      startDate: exp?.startDate?.slice(0, 10) ?? "",
      endDate: exp?.endDate?.slice(0, 10) ?? "",
      currentlyWorking: exp?.currentlyWorking ?? false,
      technologies: exp?.technologies?.map((t) => t.name).join(", ") ?? "",
      description: exp?.description ?? "",
    },
  });
  const currentlyWorking = watch("currentlyWorking");

  const mutation = useMutation({
    mutationFn: (data: ExperienceWriteDto) =>
      exp ? experienceService.update(exp.id, data) : experienceService.create(data),
    onSuccess: () => {
      toast.success(exp ? "Experience updated" : "Experience added");
      queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
      onDone();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit = (data: ExpFormValues) => {
    mutation.mutate({
      company: data.company,
      position: data.position,
      employmentType: data.employmentType || undefined,
      startDate: data.startDate,
      endDate: data.currentlyWorking ? undefined : data.endDate || undefined,
      currentlyWorking: data.currentlyWorking,
      technologies: data.technologies.split(",").map((s) => s.trim()).filter(Boolean),
      description: data.description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
      <div className="space-y-1">
        <Label>Company</Label>
        <Input {...register("company", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Position</Label>
        <Input {...register("position", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Employment type</Label>
        <Input {...register("employmentType")} placeholder="Full-time" />
      </div>
      <div className="space-y-1">
        <Label>Technologies (comma-separated)</Label>
        <Input {...register("technologies")} placeholder="React, Node.js" />
      </div>
      <div className="space-y-1">
        <Label>Start date</Label>
        <Input type="date" {...register("startDate", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>End date</Label>
        <Input type="date" disabled={currentlyWorking} {...register("endDate")} />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          type="checkbox"
          id="currentlyWorking"
          className="h-4 w-4 rounded border-border"
          checked={currentlyWorking}
          onChange={(e) => setValue("currentlyWorking", e.target.checked)}
        />
        <Label htmlFor="currentlyWorking" className="cursor-pointer">Currently working here</Label>
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label>Description</Label>
        <Textarea rows={3} {...register("description")} />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" variant="gradient" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminExperiencePage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["admin", "experiences"],
    queryFn: experienceService.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => experienceService.remove(id),
    onSuccess: () => {
      toast.success("Experience deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "experiences"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Manage your work history."
        action={
          <Button variant="gradient" onClick={() => setShowNew((v) => !v)}>
            <Plus className="h-4 w-4" /> New Experience
          </Button>
        }
      />

      {showNew && (
        <div className="mb-4">
          <ExperienceForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : !experiences?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No experience added yet.</div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) =>
            editingId === exp.id ? (
              <ExperienceForm key={exp.id} exp={exp} onDone={() => setEditingId(null)} />
            ) : (
              <div key={exp.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-sm text-primary">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate?.slice(0, 10)} — {exp.currentlyWorking ? "Present" : exp.endDate?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(exp.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete experience at "${exp.company}"?`)) removeMutation.mutate(exp.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
