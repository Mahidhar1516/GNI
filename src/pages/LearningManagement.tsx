import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  credits: number;
}

interface Profile {
  semester: number | null;
}

const courseColors = [
  "bg-red-100 text-red-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-600",
  "bg-teal-100 text-teal-600",
  "bg-pink-100 text-pink-600",
];

export default function LearningManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"courses" | "growth">("courses");
  const navigate = useNavigate();

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
      fetchCourses();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("semester")
      .eq("id", user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchCourses = async () => {
    const { data } = await supabase
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
      .eq("student_id", user?.id)
      .eq("status", "active");

    if (data) {
      setCourses(data?.map((sc: any) => sc.courses) || []);
    }
  };

  const getCourseInitials = (code: string) => {
    return code.toUpperCase().split(" ").map(w => w[0]).join("").slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Learning Management</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
              activeTab === "courses"
                ? "border-destructive text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("growth")}
            className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
              activeTab === "growth"
                ? "border-destructive text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Growth
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-6">
        {activeTab === "courses" ? (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground mb-4">
              {profile?.semester ? `SEMESTER ${profile.semester}` : "VI SEMESTER"}
            </h2>
            
            {courses.map((course, index) => (
              <Card key={course.id} className="shadow-sm border-0 bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold ${courseColors[index % courseColors.length]}`}>
                      {getCourseInitials(course.course_code)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{course.course_name}</h3>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Growth metrics coming soon</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/notice-board")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Notice Board</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/learning")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Learning</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/chats")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Chats</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2" onClick={() => navigate("/profile")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
