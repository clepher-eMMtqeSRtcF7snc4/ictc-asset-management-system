"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FiscalYear, FiscalYearAction } from "@repo/trpc/schemas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface FiscalYearContentPageProps {
  data: FiscalYear[];
  onCreateFiscalYear: () => void;
  onAction: (action: FiscalYearAction, year: number) => void;
}

export default function MatrixContentSection() {
  return (
    <div className="">
      <Tabs defaultValue="account">
        <TabsList className="mb-2">
          <TabsTrigger value="account">Activity Classifications</TabsTrigger>
          <TabsTrigger value="password">Responsible Units</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="">
          <div className="">
            <Card className="shadow-md">
              <CardContent className="w-full">
                Activity Classifications
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <Card className="shadow">
            <CardContent className="w-full">
              Responsible Units
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  );
}