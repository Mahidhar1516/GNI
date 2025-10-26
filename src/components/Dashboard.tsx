import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Wallet, 
  PartyPopper, 
  Users,
  Menu,
  Bell,
  Home,
  BookOpen,
  MessageCircle,
  User as UserIcon,
  ChevronRight,
  Cloud,
  RotateCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  email: string;
  student_id: string;
  department: string | null;
  semester: number | null;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  credits: number;
}

interface Assignment {
  id: string;
  title: string;
  due_date: string;
  total_marks: number;
  course: {
    course_name: string;
    course_code: string;
  };
  submission?: Array<{
    status: string;
    marks_obtained: number | null;
  }>;
}

export default function Dashboard() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState({ present: 0, total: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchProfile();
      fetchCourses();
      fetchAssignments();
      fetchAttendance();
    }
  }, [authUser]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser?.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("student_courses")
      .select(`
        courses (
          id,
          course_code,
          course_name,
          instructor,
          credits
        )
      `)
      .eq("student_id", authUser?.id)
      .eq("status", "active");

    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      setCourses(data?.map((sc: any) => sc.courses) || []);
    }
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("assignments")
      .select(`
        id,
        title,
        due_date,
        total_marks,
        course:courses (
          course_name,
          course_code
        ),
        submission:student_assignments (
          status,
          marks_obtained
        )
      `)
      .order("due_date", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error fetching assignments:", error);
    } else {
      setAssignments(data || []);
    }
  };

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("status")
      .eq("student_id", authUser?.id);

    if (error) {
      console.error("Error fetching attendance:", error);
    } else {
      const total = data?.length || 0;
      const present = data?.filter((a) => a.status).length || 0;
      setAttendance({ present, total });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const attendancePercentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100) 
    : 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "submitted": return "bg-info/10 text-info border-info/20";
      case "graded": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="text-2xl font-bold text-destructive">GNI</div>
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold mb-1">
                    Hi {profile?.full_name?.split(' ')[0] || 'Student'},
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {getGreeting()}, {getCurrentDate()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Cloud className="h-5 w-5" />
                    <span className="text-lg">25°C</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Partly Cloudy</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto py-3 px-4 border rounded-lg hover:bg-muted/50"
              >
                <span className="text-base font-medium">View Schedule</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Centre */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-foreground">ACTION CENTRE</h2>
          <Card className="bg-foreground text-card shadow-lg border-0">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {profile?.semester ? `Year ${Math.ceil(profile.semester / 2)}` : 'III Year'} - Sem {profile?.semester || 'I'} Laboratory Online Feedbak
                  </h3>
                  <p className="text-sm text-card/60">04 Feb, 2025 - 19 Apr, 2025</p>
                </div>
                <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Essentials */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-foreground">ESSENTIALS</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Attendance Card */}
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'hsl(var(--attendance-green))' }}>
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: 'hsl(var(--attendance-green-fg))' }}>
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-base mb-3" style={{ color: 'hsl(var(--attendance-green-fg))' }}>
                  Attendance
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold" style={{ color: 'hsl(var(--attendance-green-fg))' }}>
                      {attendancePercentage}%
                    </p>
                    <RotateCw className="h-5 w-5" style={{ color: 'hsl(var(--attendance-green-fg))' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">As on {getCurrentDate()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Fee Payments Card */}
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'hsl(var(--fee-pink))' }}>
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: 'hsl(var(--fee-pink-fg))' }}>
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-base mb-3" style={{ color: 'hsl(var(--fee-pink-fg))' }}>
                  Fee Payments
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dues</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold" style={{ color: 'hsl(var(--fee-pink-fg))' }}>
                      INR 0.00
                    </p>
                    <RotateCw className="h-5 w-5" style={{ color: 'hsl(var(--fee-pink-fg))' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">As on {getCurrentDate()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Campus Events Card */}
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'hsl(var(--events-purple))' }}>
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: 'hsl(var(--events-purple-fg))' }}>
                  <PartyPopper className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-base" style={{ color: 'hsl(var(--events-purple-fg))' }}>
                  Campus Events
                </h3>
              </CardContent>
            </Card>

            {/* Campus Clubs Card */}
            <Card className="shadow-lg border-0" style={{ backgroundColor: 'hsl(var(--clubs-cyan))' }}>
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: 'hsl(var(--clubs-cyan-fg))' }}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-base" style={{ color: 'hsl(var(--clubs-cyan-fg))' }}>
                  Campus Clubs
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tools Section - Placeholder for expandable section */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-foreground">TOOLS</h2>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/")}>
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/notice-board")}>
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
            <UserIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
