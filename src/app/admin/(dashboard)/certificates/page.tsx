"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Loader2, Award } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { certificateService } from "@/services/certificate.service";
import type { Certificate, CertificateWriteDto } from "@/types";

function CertificateForm({ cert, onDone }: { cert?: Certificate; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<CertificateWriteDto>({
    defaultValues: {
      title: cert?.title ?? "",
      issuer: cert?.issuer ?? "",
      issueDate: cert?.issueDate?.slice(0, 10) ?? "",
      credentialUrl: cert?.credentialUrl ?? "",
      image: cert?.image ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CertificateWriteDto) =>
      cert ? certificateService.update(cert.id, data) : certificateService.create(data),
    onSuccess: () => {
      toast.success(cert ? "Certificate updated" : "Certificate added");
      queryClient.invalidateQueries({ queryKey: ["admin", "certificates"] });
      onDone();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
    >
      <div className="space-y-1">
        <Label>Title</Label>
        <Input {...register("title", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Issuer</Label>
        <Input {...register("issuer", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Issue date</Label>
        <Input type="date" {...register("issueDate", { required: true })} />
      </div>
      <div className="space-y-1">
        <Label>Credential URL</Label>
        <Input {...register("credentialUrl")} placeholder="https://…" />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label>Image URL</Label>
        <Input {...register("image")} placeholder="https://…" />
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

export default function AdminCertificatesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: certificateService.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => certificateService.remove(id),
    onSuccess: () => {
      toast.success("Certificate deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "certificates"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader
        title="Certificates"
        description="Manage your certifications."
        action={
          <Button variant="gradient" onClick={() => setShowNew((v) => !v)}>
            <Plus className="h-4 w-4" /> New Certificate
          </Button>
        }
      />

      {showNew && (
        <div className="mb-4">
          <CertificateForm onDone={() => setShowNew(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : !certificates?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No certificates yet.</div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) =>
            editingId === cert.id ? (
              <CertificateForm key={cert.id} cert={cert} onDone={() => setEditingId(null)} />
            ) : (
              <div key={cert.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer} · {cert.issueDate?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(cert.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete "${cert.title}"?`)) removeMutation.mutate(cert.id);
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
