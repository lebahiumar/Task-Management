import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingStats(true);
      // Fetch all tasks
      const { data: allTasksData } = await import("@/lib/supabaseClient").then(m => m.supabase.from("tasks").select("*"));
      setAllTasks(allTasksData || []);
      // Fetch recent tasks
      setLoadingTasks(true);
      const { data: recentTasks } = await import("@/lib/supabaseClient").then(m => m.supabase.from("tasks").select("*").order("created_at", { ascending: false }).limit(5));
      setTasks(recentTasks || []);
      setLoadingTasks(false);
      setLoadingStats(false);
    };
    fetchDashboardData();
  }, []);

  // Dynamic stats
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t: any) => t.status === "Completed").length;
  const inProgressTasks = allTasks.filter((t: any) => t.status === "In Progress").length;

  const stats = [
    { label: "Total Tasks", value: totalTasks, color: "text-blue-600" },
    { label: "Completed", value: completedTasks, color: "text-green-600" },
    { label: "In Progress", value: inProgressTasks, color: "text-orange-600" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Review": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {loadingStats ? (
                <div className="col-span-3 text-center">Loading stats...</div>
              ) : (
                stats.map((stat, index) => (
                  <Card key={index} className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <div>
                <Card className="animate-slide-up">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Tasks</CardTitle>
                        <CardDescription>Your latest tasks</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingTasks ? (
                      <div>Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                      <div>No recent tasks found.</div>
                    ) : (
                      tasks.map((task, index) => (
                        <div 
                          key={task.id} 
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <div className="flex space-x-2">
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)} variant="secondary">
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assignee_avatar || ""} />
                                <AvatarFallback className="bg-primary text-white text-xs">
                                  {task.assignee_name
                                    ? task.assignee_name.split(' ').map((n: string) => n[0]).join('')
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-700">{task.assignee_name || "Unassigned"}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{task.due_date || "No Due Date"}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks you might want to do</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/tasks")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Task
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/calendar")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/tasks")}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Review Tasks
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
