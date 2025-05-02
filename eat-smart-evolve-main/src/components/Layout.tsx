
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Home, User, Dumbbell, Utensils, Target, 
  BarChart, LogOut, Moon, Sun
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: Utensils, label: "Nutrition", path: "/nutrition" },
    { icon: Target, label: "Goals", path: "/goals" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-[80px] bg-card z-30 flex flex-col items-center py-6 border-r">
        <div className="mb-8">
          <div className="text-3xl font-bold text-gradient">ES</div>
        </div>

        <nav className="flex-1 flex flex-col items-center gap-4">
          {menuItems.map((item) => (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    size="icon"
                    onClick={() => navigate(item.path)}
                    className={location.pathname === item.path 
                      ? "relative overflow-hidden bg-primary text-primary-foreground animate-pulse-glow"
                      : ""}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className="mt-4"
                >
                  <Avatar className="h-9 w-9">
                    {user?.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={user.name} />
                    ) : (
                      <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-[80px] flex-1 flex flex-col overflow-auto">
        {title && (
          <header className="sticky top-0 z-20 px-6 py-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold">{title}</h1>
          </header>
        )}
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
