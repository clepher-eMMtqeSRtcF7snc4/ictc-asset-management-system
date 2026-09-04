import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PermissionManagementSection } from "@/components/administration/roles-permissions/permission-management/permission-management-section";
import { PageHeader } from "@/components/layout/page-header";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ roleId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { roleId } = await params;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/administration">Administration</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/administration/roles-permissions">
                Roles &amp; Permissions
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/administration/roles-permissions">Roles</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Permissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <PageHeader
          title="Manage Permissions"
          description="Configure what this role can access and perform in the system."
          action={
            <Link
              className="flex gap-1.5 text-primary text-sm font-semibold"
              href="/administration/roles-permissions"
            >
              <ArrowLeft width="20" height="20" /> Back to Roles
            </Link>
          }
        ></PageHeader>
      </div>

      <PermissionManagementSection roleId={roleId} />
    </div>
  );
}
