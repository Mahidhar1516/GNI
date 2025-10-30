import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Menu,
  Home,
  BookOpen,
  Briefcase,
  User as UserIcon,
  MapPin,
  IndianRupee,
  Users,
  Clock,
  Filter,
  Flame
} from "lucide-react";

interface Job {
  id: string;
  company: string;
  logo: string;
  position: string;
  location: string;
  salary: string;
  openings: number;
  applyBy: string;
  type: "job" | "internship";
  status: "open" | "applied";
}

const jobsData: Job[] = [
  {
    id: "1",
    company: "MindTap Solutions",
    logo: "🧠",
    position: "Frontend Developer",
    location: "Work From Home",
    salary: "₹3L - ₹5L",
    openings: 5,
    applyBy: "30 Oct 25, 10:00 AM",
    type: "job",
    status: "open"
  },
  {
    id: "2",
    company: "App Knit",
    logo: "🔺",
    position: "Intern Node Js Developer",
    location: "Work From Home",
    salary: "₹3L - ₹3.5L",
    openings: 2,
    applyBy: "30 Oct 25, 11:30 AM",
    type: "internship",
    status: "open"
  },
  {
    id: "3",
    company: "i-Vista Web Solutions",
    logo: "🟥",
    position: "Full Stack Developer",
    location: "Bengaluru",
    salary: "₹3L - ₹3.5L",
    openings: 3,
    applyBy: "30 Oct 25, 02:00 PM",
    type: "job",
    status: "open"
  },
  {
    id: "4",
    company: "Faster7 Technology Private Limited",
    logo: "⚡",
    position: "Backend Developer",
    location: "Gurugram",
    salary: "₹3.6L",
    openings: 2,
    applyBy: "30 Oct 25, 04:00 PM",
    type: "job",
    status: "open"
  },
  {
    id: "5",
    company: "Faster7 Technology Private Limited",
    logo: "⚡",
    position: "Frontend Developer",
    location: "Gurugram",
    salary: "₹3.6L",
    openings: 2,
    applyBy: "30 Oct 25, 04:15 PM",
    type: "job",
    status: "open"
  },
  {
    id: "6",
    company: "ArtStack",
    logo: "🎨",
    position: "Front End Developer",
    location: "Bengaluru",
    salary: "₹6L",
    openings: 10,
    applyBy: "30 Oct 25, 06:00 PM",
    type: "internship",
    status: "open"
  }
];

export default function Placements() {
  const navigate = useNavigate();
  const [typeTab, setTypeTab] = useState<"jobs" | "internships">("jobs");
  const [statusTab, setStatusTab] = useState<"open" | "applied">("open");

  const filteredJobs = jobsData.filter(
    job => job.type === (typeTab === "jobs" ? "job" : "internship") && job.status === statusTab
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(220,40%,15%)] text-white px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Jobs Board</h1>
        </div>
        
        

        <Tabs value={typeTab} onValueChange={(value) => setTypeTab(value as "jobs" | "internships")} className="mb-4">
          <TabsList className="bg-white/10 w-full justify-start">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-white data-[state=active]:text-foreground">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="internships" className="data-[state=active]:bg-white data-[state=active]:text-foreground">
              Internships
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <Button 
            size="sm" 
            variant={statusTab === "open" ? "default" : "outline"}
            onClick={() => setStatusTab("open")}
            className={statusTab === "open" ? "" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}
          >
            Open To Apply
          </Button>
          <Button 
            size="sm" 
            variant={statusTab === "applied" ? "default" : "outline"}
            onClick={() => setStatusTab("applied")}
            className={statusTab === "applied" ? "" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}
          >
            Applied
          </Button>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="flex items-center justify-end mb-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <span className="text-sm">Filters</span>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{job.company}</p>
                    <h3 className="font-semibold text-base mb-2">{job.position}</h3>
                  </div>
                  <div className="text-3xl">{job.logo}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">LOCATION</p>
                      <p className="text-sm font-medium">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">CTC</p>
                      <p className="text-sm font-medium">{job.salary}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">OPENING</p>
                      <p className="text-sm font-medium">{job.openings} Opening{job.openings > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">APPLY BY</p>
                      <p className="text-sm font-medium">{job.applyBy}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto hover:underline text-sm"
                >
                  Check Eligibility →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/")}>
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/notice-board")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">My Journey</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/learning")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">Question Bank</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/placements")}>
            <Briefcase className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">Jobs Board</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/profile")}>
            <UserIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
