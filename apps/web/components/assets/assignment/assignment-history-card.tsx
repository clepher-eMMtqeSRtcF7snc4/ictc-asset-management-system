import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AssignmentHistoryCard({ assigned }: { assigned: boolean }) {
  return <Card><CardContent className="p-4"><p className="mb-3 text-xs font-semibold">Assignment History</p>{assigned ? <div className="flex gap-3 text-sm"><CalendarClock className="size-5 text-primary" /><p><strong>Assignment created</strong><br /><span className="text-xs text-muted-foreground">Just now · Static UI workflow</span></p></div> : <div className="py-4 text-center"><CalendarClock className="mx-auto mb-2 size-7 text-muted-foreground" /><p className="text-sm font-medium">No assignment history</p><p className="text-xs text-muted-foreground">This asset has not been assigned yet.</p></div>}</CardContent></Card>;
}
