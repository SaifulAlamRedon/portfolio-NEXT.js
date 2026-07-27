"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { skillService } from "@/services/skill.service";
import type { Skill, SkillWriteDto } from "@/types";

function SkillForm({
  skill,
  onDone,
}: {
  skill?: Skill;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<SkillWriteDto>({
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      percentage: skill?.percentage ?? 50,
      icon: skill?.icon ?? "",
      displayOrder: skill?.displayOrder ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SkillWriteDto) =>
      skill ? skillService.update(skill.id, data) : skillService.create(data),
    onSuccess: () => {
      toast.success(skill ? "Skill updated" : "Skill added");
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
      onDone();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutation.mutate({ ...data, percentage: Number(data.percentage), displayOrder: Number(data.displayOrder) })
      )}
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-5"
    >
      <div className="space-y-1 sm:col-span-2">
        <Label>Name</Label>
        <Input {...register("name", { required: true })} placeholder="React" />
      </div>
      <div className="space-y-1">
        <Label>Category</Label>
        <Input {...register("category")} placeholder="Frontend" />
      </div>
      <div className="space-y-1">
        <Label>Percentage</Label>
        <Input type="number" min={0} max={100} {...register("percentage")} />
      </div>
      <div className="space-y-1">
        <Label>Icon URL</Label>
        <Input {...register("icon")} placeholder="https://…" />
      </div>
      <div className="flex items-end gap-2 sm:col-span-5">
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

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: skillService.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => skillService.remove(id),
    onSuccess: () => {
      toast.success("Skill deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Manage your skill list and proficiency levels."
        action={
          <Button variant="gradient" onClick={() => setShowNew((v) => !v)}>
            <Plus className="h-4 w-4" /> New Skill
          </Button>
        }
      />

      {showNew && (
        <div className="mb-4">
          <SkillForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : !skills?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No skills yet.
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) =>
            editingId === skill.id ? (
              <SkillForm key={skill.id} skill={skill} onDone={() => setEditingId(null)} />
            ) : (
              <div
                key={skill.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span className="text-xs text-muted-foreground">{skill.category}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{skill.percentage}%</span>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(skill.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete "${skill.name}"?`)) removeMutation.mutate(skill.id);
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
