import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "class" | "others";
  status: "attended" | "missed" | "upcoming";
}

export default function Schedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 25)); // Oct 25, 2025
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const days = [
    { day: "Thu", date: 23 },
    { day: "Fri", date: 24 },
    { day: "Sat", date: 25 },
    { day: "Sun", date: 26 },
    { day: "Mon", date: 27 },
  ];

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your schedule",
          variant: "destructive",
        });
        return;
      }

      // Get day of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = selectedDate.getDay();

      const { data, error } = await supabase
        .from("class_schedule")
        .select("*")
        .eq("student_id", user.id)
        .eq("day_of_week", dayOfWeek)
        .order("start_time");

      if (error) throw error;

      // Convert database format to display format
      const formattedItems: ScheduleItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        startTime: formatTime(item.start_time),
        endTime: formatTime(item.end_time),
        type: item.type as "class" | "others",
        status: "upcoming" as const, // Default to upcoming; can be enhanced with attendance data
      }));

      setScheduleItems(formattedItems);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error loading schedule",
        description: "Failed to load your schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    // Convert 24-hour time to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusIcon = (status: string) => {
    if (status === "attended") {
      return <Check className="h-5 w-5 text-success" />;
    }
    if (status === "missed") {
      return <X className="h-5 w-5 text-destructive" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <CalendarIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between gap-2">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(new Date(2025, 9, day.date))}
              className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all ${
                selectedDate.getDate() === day.date
                  ? "bg-card text-foreground"
                  : "text-primary-foreground/70"
              }`}
            >
              <span className="text-sm mb-1">{day.day}</span>
              <span className="text-lg font-semibold">{day.date}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Schedule List */}
      <main className="px-4 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading schedule...
          </div>
        ) : scheduleItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No classes scheduled for this day
          </div>
        ) : (
          scheduleItems.map((item) => (
          <Card key={item.id} className="shadow-md border-0 overflow-hidden">
            <CardContent className="p-0 flex">
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.startTime} - {item.endTime}
                </p>
              </div>
              
              <div className="flex items-center gap-2 pr-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                  {getStatusIcon(item.status)}
                </div>
                
                <div
                  className={`w-16 h-full flex items-center justify-center rounded-r-lg ${
                    item.type === "class"
                      ? "bg-info text-info-foreground"
                      : "bg-warning text-warning-foreground"
                  }`}
                >
                  <span
                    className="font-semibold text-sm"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                    }}
                  >
                    {item.type === "class" ? "Class" : "Others"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </main>
    </div>
  );
}
