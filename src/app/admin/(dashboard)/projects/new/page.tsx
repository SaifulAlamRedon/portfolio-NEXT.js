import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <AdminPageHeader title="New Project" description="Add a new project to your portfolio." />
      <ProjectForm />
    </div>
  );
}
