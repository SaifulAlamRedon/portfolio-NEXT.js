"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { testimonialService } from "@/services/testimonial.service";

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();

  const pending = useQuery({
    queryKey: ["admin", "testimonials", "pending"],
    queryFn: testimonialService.getPending,
  });
  const approved = useQuery({
    queryKey: ["admin", "testimonials", "approved"],
    queryFn: testimonialService.getApproved,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => testimonialService.approve(id),
    onSuccess: () => { toast.success("Testimonial approved"); invalidate(); },
    onError: () => toast.error("Failed to approve"),
  });
  const rejectMutation = useMutation({
    mutationFn: (id: string) => testimonialService.reject(id),
    onSuccess: () => { toast.success("Testimonial rejected"); invalidate(); },
    onError: () => toast.error("Failed to reject"),
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => testimonialService.remove(id),
    onSuccess: () => { toast.success("Testimonial deleted"); invalidate(); },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader title="Testimonials" description="Review and manage visitor testimonials." />

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">
          Pending Review {pending.data?.length ? `(${pending.data.length})` : ""}
        </h2>
        {pending.isLoading ? (
          <Skeleton className="h-24 rounded-2xl" />
        ) : !pending.data?.length ? (
          <p className="text-sm text-muted-foreground">No testimonials waiting for review.</p>
        ) : (
          <div className="space-y-3">
            {pending.data.map((t) => (
              <div key={t.id} className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{t.name}</p>
                      {t.company && <span className="text-xs text-muted-foreground">· {t.company}</span>}
                    </div>
                    {t.designation && <p className="text-xs text-muted-foreground">{t.designation}</p>}
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.message}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="gradient" size="sm" onClick={() => approveMutation.mutate(t.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => rejectMutation.mutate(t.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Approved & Live</h2>
        {approved.isLoading ? (
          <Skeleton className="h-24 rounded-2xl" />
        ) : !approved.data?.length ? (
          <p className="text-sm text-muted-foreground">No approved testimonials yet.</p>
        ) : (
          <div className="space-y-3">
            {approved.data.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{t.name}</p>
                  {t.designation && <p className="text-xs text-muted-foreground">{t.designation}{t.company ? ` @ ${t.company}` : ""}</p>}
                  <p className="mt-2 text-sm text-muted-foreground">{t.message}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Delete testimonial from "${t.name}"?`)) removeMutation.mutate(t.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
