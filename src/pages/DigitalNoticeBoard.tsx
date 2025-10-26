import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, BookOpen, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DigitalNoticeBoard() {
  const [activeTab, setActiveTab] = useState<"feed" | "announcements">("feed");
  const [activeFilter, setActiveFilter] = useState("General");
  const navigate = useNavigate();

  const filters = ["General", "Academics", "Opportunities", "Events"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Digital Notice Board</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
              activeTab === "feed"
                ? "border-destructive text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
              activeTab === "announcements"
                ? "border-destructive text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Announcements
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <Badge
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap px-4 py-2"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Content */}
      <main className="px-4 pb-6">
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                K
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  Katta Deepika | ASSISTANT PROFESSOR
                </h3>
                <p className="text-xs text-muted-foreground">Oct 25, 2025 5:57 PM</p>
              </div>
            </div>

            <h2 className="font-bold text-base mb-3">
              Role of Thermodynamics in Power plants
            </h2>

            <p className="text-sm text-foreground mb-4 leading-relaxed">
              Greetings of the Day!! 🎉🎉 The Department of Mechanical Engineering at Guru Nanak Institute of Technology is organizing a Guest Lecture on 'Role of Thermodynamics in Power Plants and Refrigeration Systems' on October 27, 2025. Dr. Chidanandappa J, Scientist/Engineer 'SF' from the National ...
            </p>

            <div className="bg-muted rounded-lg p-2 mb-3">
              <div className="bg-card rounded p-3 text-center">
                <p className="text-lg font-bold text-destructive mb-1">Guest Lecture</p>
                <p className="text-sm">Role of Thermodynamics in Power Plants and Refrigeration Systems</p>
                <p className="text-xs text-muted-foreground mt-2">
                  27th October, 2025 | Time: 10 AM to 4 PM | Venue: B-204
                </p>
              </div>
            </div>

            <Badge variant="outline" className="rounded-full">
              Guest lecture
            </Badge>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/")}>
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/notice-board")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Notice Board</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/learning")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Learning</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/chats")}>
            <MessageCircle className="h-6 w-6 mb-1" />
            <span className="text-xs">Chats</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/profile")}>
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
