import { Button } from "@/components/ui/button";
import { Menu, Home, BookOpen, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-col items-center justify-center h-[70vh]">
        <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No chats yet</p>
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
          <Button variant="ghost" size="icon" className="flex-col h-auto py-2 text-primary" onClick={() => navigate("/chats")}>
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
