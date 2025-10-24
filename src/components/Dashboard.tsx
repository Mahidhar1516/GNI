import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  LogOut,
  Menu,
  X,
  FileText,
  TrendingUp
} from "lucide-react";
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState({ present: 0, total: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      fetchCourses();
      fetchAssignments();
      fetchAttendance();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
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
      .eq("student_id", user?.id)
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
      .eq("student_id", user?.id);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CampX
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Welcome,</span>
              <span className="font-semibold text-foreground">{profile?.full_name}</span>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                {profile?.full_name ? getInitials(profile.full_name) : "ST"}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{courses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active this semester</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {assignments.filter(a => !a.submission || a.submission[0]?.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Due this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{attendancePercentage}%</div>
              <Progress value={attendancePercentage} className="mt-2 h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {attendance.present} of {attendance.total} classes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Student ID</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{profile?.student_id}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {profile?.department || "Not set"} • Sem {profile?.semester || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Currently enrolled courses for this semester</CardDescription>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No courses enrolled yet</p>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {course.course_code}
                            </Badge>
                            <h3 className="font-semibold">{course.course_name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Instructor: {course.instructor}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {course.credits} Credits
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Upcoming and recent assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No assignments found</p>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const submission = assignment.submission?.[0];
                      const status = submission?.status || 'pending';
                      const dueDate = new Date(assignment.due_date);
                      const isOverdue = dueDate < new Date() && status === 'pending';

                      return (
                        <div
                          key={assignment.id}
                          className="flex items-start justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-md transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{assignment.title}</h3>
                              <Badge className={getStatusColor(status)} variant="outline">
                                {status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {assignment.course.course_name} ({assignment.course.course_code})
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className={isOverdue ? "text-destructive font-medium" : ""}>
                                  Due: {dueDate.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                Total Marks: {assignment.total_marks}
                              </div>
                              {submission?.marks_obtained !== null && (
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  Score: {submission.marks_obtained}/{assignment.total_marks}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your student profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl">
                      {profile?.full_name ? getInitials(profile.full_name) : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                    <p className="text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Student ID</div>
                    <div className="text-sm font-semibold">{profile?.student_id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Department</div>
                    <div className="text-sm">{profile?.department || "Not set"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Semester</div>
                    <div className="text-sm">{profile?.semester || "Not set"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Attendance Rate</div>
                    <div className="text-sm font-semibold text-success">{attendancePercentage}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
