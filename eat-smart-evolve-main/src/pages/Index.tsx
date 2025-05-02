
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell, Heart, Activity, Search, Brain } from "lucide-react";
import Utensils from "@/components/icons/Utensils";
import Target from "@/components/icons/Target";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/dashboard" : "/register");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-background/90 backdrop-blur-md shadow-md" : ""}`}>
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-gradient">EAT SMART</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/register")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-esgreen-400 filter blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-esteal-400 filter blur-[100px]" />
          <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-espurple-400 filter blur-[80px]" />
        </div>

        <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Transform Your Body,
              <span className="text-gradient"> Transform Your Life</span>
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Personalized workouts, nutrition tracking, and goal setting in one powerful platform.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="animate-pulse-glow">
              Get Started
            </Button>
          </div>
          
          <div className="flex-1 glass-card p-8 rounded-2xl card-3d">
            <div className="aspect-video bg-gradient-to-br from-esgreen-400 to-esteal-400 rounded-lg flex items-center justify-center">
              <div className="text-white text-6xl">
                <Dumbbell className="h-20 w-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            One Platform, <span className="text-gradient">Complete Solution</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Dumbbell,
                title: "Workout Library",
                description: "Access hundreds of exercises and workout routines tailored to your goals"
              },
              {
                icon: Utensils,
                title: "Nutrition Tracking",
                description: "Log meals, track calories, and get personalized diet recommendations"
              },
              {
                icon: Target,
                title: "Goal Setting",
                description: "Set and track fitness goals with detailed progress metrics"
              },
              {
                icon: Activity,
                title: "Health Analytics",
                description: "Visualize your progress with detailed health and fitness analytics"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-xl card-3d">
                <div className="mb-4 bg-gradient-to-br from-esgreen-400 to-esteal-400 w-12 h-12 rounded-full flex items-center justify-center text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your fitness journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who've achieved their fitness goals with EAT SMART.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-gradient mb-4 md:mb-0">EAT SMART</div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EAT SMART. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
