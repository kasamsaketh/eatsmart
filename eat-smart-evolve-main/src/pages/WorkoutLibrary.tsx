
import { useState } from "react";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Timer, 
  FlameIcon, 
  Sparkles, 
  Heart, 
  Play, 
  Plus
} from "lucide-react";

// Mock workout data
const workoutData = [
  {
    id: 1,
    title: "Full Body Strength",
    level: "Intermediate",
    duration: "45 min",
    calories: 320,
    category: "strength",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "Build strength with this complete full body workout that targets all major muscle groups.",
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    level: "Advanced",
    duration: "30 min",
    calories: 400,
    category: "cardio",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "High intensity interval training to maximize calorie burn and boost your metabolism.",
  },
  {
    id: 3,
    title: "Yoga Flow",
    level: "Beginner",
    duration: "60 min",
    calories: 180,
    category: "yoga",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "Gentle flow sequence focusing on flexibility, balance and mindfulness.",
  },
  {
    id: 4,
    title: "Core Crusher",
    level: "Intermediate",
    duration: "20 min",
    calories: 200,
    category: "strength",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "Focus on building a strong, stable core with this targeted ab workout.",
  },
  {
    id: 5,
    title: "Lower Body Burn",
    level: "Intermediate",
    duration: "40 min",
    calories: 300,
    category: "strength",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "Target your legs and glutes with this challenging lower body workout.",
  },
  {
    id: 6,
    title: "Mobility & Recovery",
    level: "Beginner",
    duration: "30 min",
    calories: 120,
    category: "recovery",
    image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a7ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
    description: "Improve flexibility and aid recovery with gentle stretching and mobility work.",
  },
];

const WorkoutLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter workouts based on search query and active category
  const filteredWorkouts = workoutData.filter((workout) => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || workout.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to render colored badge based on difficulty level
  const renderLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner":
        return <Badge className="bg-green-500">Beginner</Badge>;
      case "Intermediate":
        return <Badge className="bg-blue-500">Intermediate</Badge>;
      case "Advanced":
        return <Badge className="bg-red-500">Advanced</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  return (
    <Layout title="Workout Library">
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workouts..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workout
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Workout cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden card-3d">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={workout.image} 
                    alt={workout.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-xl">{workout.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                        <Timer className="h-3 w-3" />
                        <span>{workout.duration}</span>
                        <span>•</span>
                        <FlameIcon className="h-3 w-3" />
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    {renderLevelBadge(workout.level)}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{workout.description}</p>
                </CardContent>
                <CardFooter className="border-t p-4 pt-3">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No workouts found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Featured workout */}
        {filteredWorkouts.length > 0 && (
          <Card className="bg-gradient-to-r from-esgreen-400/10 to-esteal-400/10 border-esteal-400/20 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80" 
                  alt="Featured Workout" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-espurple-400 text-white mr-2">Featured</Badge>
                  <Badge className="bg-esteal-400 text-white">New</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-2">30-Day Transformation Challenge</h2>
                <p className="text-muted-foreground mb-4">
                  Take your fitness to the next level with our complete 30-day program. Includes daily workouts, 
                  nutrition guidance, and progress tracking.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>30 days</span>
                  </div>
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>All levels</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>5,000+ joined</span>
                  </div>
                </div>
                <Button>
                  Join Challenge
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default WorkoutLibrary;
