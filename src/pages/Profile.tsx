import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Home, BookOpen, MessageCircle, User, ChevronRight, Calendar, GraduationCap, Wallet, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  student_id: string;
}

export default function Profile() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendance, setAttendance] = useState({ present: 0, total: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAttendance();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, student_id")
      .eq("id", user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchAttendance = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("status")
      .eq("student_id", user?.id);

    if (data) {
      const total = data.length || 0;
      const present = data.filter((a) => a.status).length || 0;
      setAttendance({ present, total });
    }
  };

  const attendancePercentage = attendance.total > 0 
    ? (attendance.present / attendance.total * 100).toFixed(2)
    : "0.00";

  const getInitial = (name: string) => {
    return name ? name[0].toUpperCase() : "S";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Account</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 space-y-4">
        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
                  {profile && getInitial(profile.full_name)}
                </div>
                <div>
                  <h2 className="font-bold text-lg mb-1">
                    {profile?.full_name || "Student"}
                  </h2>
                  <p className="text-sm text-white/80">
                    ID: {profile?.student_id || "N/A"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>
              <h3 className="font-semibold text-base mb-1">Attendance</h3>
              <p className="text-sm text-muted-foreground">Overall %: {attendancePercentage}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-orange-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>
              <h3 className="font-semibold text-base mb-1">Exams</h3>
              <p className="text-sm text-muted-foreground">CGPA: NA</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>
              <h3 className="font-semibold text-base mb-1">Fee Payments</h3>
              <p className="text-sm text-muted-foreground">Due: INR 0.00</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-pink-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>
              <h3 className="font-semibold text-base mb-1">Transactions</h3>
              <p className="text-sm text-muted-foreground">View</p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out Button */}
        <Button 
          onClick={handleSignOut}
          variant="destructive"
          className="w-full"
        >
          Sign Out
        </Button>
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
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/profile")}>
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
