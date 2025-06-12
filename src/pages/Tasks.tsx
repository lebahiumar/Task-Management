import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee_name: string;
  assignee_avatar: string;
  due_date: string;
  created_at: string;
};

const Tasks = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    dueDate: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const { data, error } = await supabase.from("tasks").select("*").eq("user_id", userId);
      if (error) {
        toast({
          title: "Error loading tasks",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setTasks(data || []);
    };
    fetchTasks();
  }, []);

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
      case "To Do": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status.toLowerCase().replace(" ", "-") === filter;
  });

  const handleCreateTask = async () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const { error } = await supabase.from("tasks").insert([
      {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "To Do",
        assignee_name: newTask.assignee,
        assignee_avatar: "",
        due_date: newTask.dueDate,
        created_at: new Date().toISOString().split('T')[0],
        user_id: userId,
      },
    ]);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Task created!",
      description: `${newTask.title} has been created successfully.`,
    });
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      assignee: "",
      dueDate: ""
    });
    setIsDialogOpen(false);
    // Refresh tasks
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data || []);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Task updated!",
      description: "Task status has been updated successfully.",
    });
    // Refresh tasks
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data || []);
  };

  const handleExportTasks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tasks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportTasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedTasks = JSON.parse(event.target?.result as string);
        // Optionally validate structure here
        for (const task of importedTasks) {
          await supabase.from("tasks").insert([{ ...task, id: undefined }]);
        }
        toast({ title: "Import successful", description: "Tasks imported successfully." });
        // Refresh tasks
        const { data } = await supabase.from("tasks").select("*");
        setTasks(data || []);
      } catch (err) {
        toast({ title: "Import failed", description: "Invalid JSON file." });
      }
    };
    reader.readAsText(file);
  };

  const statusCounts = {
    all: tasks.length,
    "to-do": tasks.filter(t => t.status === "To Do").length,
    "in-progress": tasks.filter(t => t.status === "In Progress").length,
    review: tasks.filter(t => t.status === "Review").length,
    completed: tasks.filter(t => t.status === "Completed").length,
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
                  <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                  <p className="text-gray-600">Manage and track all your tasks</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleExportTasks}>Export Tasks</Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Import Tasks</Button>
                <input type="file" ref={fileInputRef} accept="application/json" style={{ display: 'none' }} onChange={handleImportTasks} />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task and assign it to team members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task-title">Task Title</Label>
                        <Input 
                          id="task-title" 
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="Enter task title" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-description">Description</Label>
                        <Textarea 
                          id="task-description" 
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Enter task description" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task-priority">Priority</Label>
                          <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task-assignee">Assignee</Label>
                          <Input 
                            id="task-assignee" 
                            value={newTask.assignee}
                            onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                            placeholder="Enter assignee name" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-due-date">Due Date</Label>
                          <Input 
                            id="task-due-date" 
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleCreateTask} className="w-full">
                        Create Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 mb-6 bg-white p-1 rounded-lg border w-fit">
              {[
                { key: "all", label: "All Tasks", count: statusCounts.all },
                { key: "to-do", label: "To Do", count: statusCounts["to-do"] },
                { key: "in-progress", label: "In Progress", count: statusCounts["in-progress"] },
                { key: "review", label: "Review", count: statusCounts.review },
                { key: "completed", label: "Completed", count: statusCounts.completed },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filter === tab.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(tab.key)}
                  className="relative"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {tab.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task, index) => (
                <Card key={task.id} className="animate-fade-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{task.title}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">{task.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={task.assignee_avatar} />
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {task.assignee_name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">{task.assignee_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {task.due_date}</span>
                      </div>
                      <span>Created: {task.created_at}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Tasks;
