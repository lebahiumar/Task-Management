
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Clock, Users } from "lucide-react";

const Calendar = () => {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;
      // Try to fetch events for today from Supabase
      const { data, error } = await import("@/lib/supabaseClient").then(m =>
        m.supabase
          .from("events")
          .select("*")
          .gte("event_date", todayStr)
          .lte("event_date", todayStr)
          .order("event_date", { ascending: true })
      );
      setEvents(data || []);
      setLoadingEvents(false);
    };
    fetchEvents();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
                  <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                  <p className="text-gray-600">{formatDate(currentDate)}</p>
                </div>
              </div>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>December 2024</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6;
                        const isCurrentMonth = day > 0 && day <= 31;
                        const isToday = day === 12;
                        
                        return (
                          <div
                            key={i}
                            className={`
                              h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer
                              ${isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-400'}
                              ${isToday ? 'bg-primary text-white hover:bg-primary/90' : ''}
                            `}
                          >
                            {isCurrentMonth ? day : ''}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Events */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Events</CardTitle>
                    <CardDescription>
                      {loadingEvents
                        ? "Loading events..."
                        : `${events.length} event${events.length === 1 ? "" : "s"} scheduled`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingEvents ? (
                      <div>Loading events...</div>
                    ) : events.length === 0 ? (
                      <div>No events scheduled for today.</div>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className="border-l-4 border-primary pl-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {event.type || "event"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {event.time ||
                                  (event.start_time
                                    ? new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    : "")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{event.attendees || event.attendees_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

export default Calendar;
