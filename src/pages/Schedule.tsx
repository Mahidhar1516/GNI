import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 25)); // Oct 25, 2025

  const days = [
    { day: "Thu", date: 23 },
    { day: "Fri", date: 24 },
    { day: "Sat", date: 25 },
    { day: "Sun", date: 26 },
    { day: "Mon", date: 27 },
  ];

  const scheduleItems: ScheduleItem[] = [
    {
      id: "1",
      title: "Automata Theory and Compiler Design",
      startTime: "9:10 AM",
      endTime: "10:10 AM",
      type: "class",
      status: "attended",
    },
    {
      id: "2",
      title: "Renewal Energy Sources",
      startTime: "10:10 AM",
      endTime: "11:10 AM",
      type: "class",
      status: "attended",
    },
    {
      id: "3",
      title: "Embedded Systems Lab (EC208)",
      startTime: "11:10 AM",
      endTime: "1:10 PM",
      type: "others",
      status: "attended",
    },
    {
      id: "4",
      title: "Industrial Oriented Mini Project",
      startTime: "11:10 AM",
      endTime: "1:10 PM",
      type: "others",
      status: "missed",
    },
    {
      id: "5",
      title: "data mining",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      type: "class",
      status: "attended",
    },
    {
      id: "6",
      title: "Embedded Systems",
      startTime: "3:00 PM",
      endTime: "4:00 PM",
      type: "class",
      status: "missed",
    },
  ];

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
        {scheduleItems.map((item) => (
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
        ))}
      </main>
    </div>
  );
}
