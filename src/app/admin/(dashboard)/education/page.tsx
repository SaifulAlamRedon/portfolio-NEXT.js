"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Loader2, GraduationCap } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { educationService } from "@/services/education.service";
import type { Education, EducationWriteDto } from "@/types";

function EducationForm({ edu, onDone }: { edu?: Education; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<EducationWriteDto>({
    defaultValues: {
      institution: edu?.institution ?? "",
      degree: edu?.degree ?? "",
      fieldOfStudy: edu?.fieldOfStudy ?? "",
      startYear: edu?.startYear ?? new Date().getFullYear(),
      endYear: edu?.endYear,
      description: edu?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EducationWriteDto) =>
      edu ? educationService.update(edu.id, data) : educationService.create(data),
    onSuccess: () => {
      toast.success(edu ? "Education updated" : "Education added");
      queryClient.invalidateQueries({ queryKey: ["admin", "education"] });
      onDone();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutation.mutate({
          ...data,
          startYear: Number(data.startYear),
          endYear: data.endYear ? Number(data.endYear) : undefined,
        })
      )}
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
    >
      <div className="space-y-1">
        <Label>Institution</Label>
        <Input {...register("institution", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Degree</Label>
        <Input {...register("degree", { required: true })} placeholder="B.Sc." />
      </div>
      <div className="space-y-1">
        <Label>Field of study</Label>
        <Input {...register("fieldOfStudy")} placeholder="Computer Science" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Start year</Label>
          <Input type="number" {...register("startYear", { required: true })} />
        </div>
        <div className="space-y-1">
          <Label>End year</Label>
          <Input type="number" {...register("endYear")} placeholder="Leave blank if ongoing" />
        </div>
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

export default function AdminEducationPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { data: education, isLoading } = useQuery({
    queryKey: ["admin", "education"],
    queryFn: educationService.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => educationService.remove(id),
    onSuccess: () => {
      toast.success("Education deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "education"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader
        title="Education"
        description="Manage your academic background."
        action={
          <Button variant="gradient" onClick={() => setShowNew((v) => !v)}>
            <Plus className="h-4 w-4" /> New Education
          </Button>
        }
      />

      {showNew && (
        <div className="mb-4">
          <EducationForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : !education?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No education added yet.</div>
      ) : (
        <div className="space-y-3">
          {education.map((edu) =>
            editingId === edu.id ? (
              <EducationForm key={edu.id} edu={edu} onDone={() => setEditingId(null)} />
            ) : (
              <div key={edu.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-primary">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startYear} — {edu.endYear ?? "Present"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(edu.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete "${edu.degree}"?`)) removeMutation.mutate(edu.id);
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
