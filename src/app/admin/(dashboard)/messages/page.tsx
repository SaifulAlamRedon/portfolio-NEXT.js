"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { contactService } from "@/services/contact.service";
import { formatDate } from "@/utils";

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: contactService.getMessages,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => contactService.markRead(id),
    onSuccess: invalidate,
  });
  const markUnreadMutation = useMutation({
    mutationFn: (id: string) => contactService.markUnread(id),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => contactService.remove(id),
    onSuccess: () => { toast.success("Message deleted"); invalidate(); },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <AdminPageHeader title="Messages" description="Contact form submissions from visitors." />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : !messages?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isOpen = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  msg.isRead ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div
                  className="flex cursor-pointer items-start justify-between gap-4"
                  onClick={() => {
                    setExpandedId(isOpen ? null : msg.id);
                    if (!msg.isRead) markReadMutation.mutate(msg.id);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      <p className="font-semibold">{msg.name}</p>
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {msg.subject ?? msg.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(msg.createdAt, { month: "short", day: "numeric" })}
                  </span>
                </div>

                {isOpen && (
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{msg.message}</p>
                    <div className="mt-3 flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={`mailto:${msg.email}`}>Reply via Email</a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (msg.isRead) {
                            markUnreadMutation.mutate(msg.id);
                          } else {
                            markReadMutation.mutate(msg.id);
                          }
                        }}
                      >
                        {msg.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        Mark as {msg.isRead ? "unread" : "read"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this message?")) removeMutation.mutate(msg.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
