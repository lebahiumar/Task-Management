import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

export default function Teams() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
                  <p className="text-gray-600">Manage your teams and collaborate effectively</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <h1 className="text-2xl font-bold">Teams feature has been removed.</h1>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
