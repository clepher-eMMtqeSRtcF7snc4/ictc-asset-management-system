import { MaintenanceDetailPage } from "@/components/maintenance/maintenance-pages"
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <MaintenanceDetailPage ticketId={id} /> }
