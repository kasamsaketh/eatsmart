
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Dumbbell, Apple, Flame, Footprints, Award, TrendingUp, BarChartIcon } from "lucide-react";

// Mock data for demonstration
const mockActivityData = [
  { day: "Mon", calories: 450 },
  { day: "Tue", calories: 580 },
  { day: "Wed", calories: 620 },
  { day: "Thu", calories: 750 },
  { day: "Fri", calories: 550 },
  { day: "Sat", calories: 800 },
  { day: "Sun", calories: 480 },
];

const mockNutritionData = {
  consumed: 1850,
  goal: 2200,
  protein: 120,
  carbs: 200,
  fat: 65,
};

const mockWorkoutData = {
  completed: 4,
  goal: 5,
  minutes: 180,
};

const mockStepsData = {
  count: 8240,
  goal: 10000,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [today] = useState(new Date());
  
  useEffect(() => {
    const hour = today.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [today]);

  // Calculate BMI if user has height and weight
  const calculateBMI = () => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  // Get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-400" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome section */}
        <section className="glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{greeting}, {user?.name.split(' ')[0]}</h2>
              <p className="text-muted-foreground">
                {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button onClick={() => window.location.href = '/goals'}>
                <Activity className="h-4 w-4 mr-2" />
                View Goals
              </Button>
            </div>
          </div>
        </section>

        {/* Stats overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-3d">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Flame className="h-4 w-4 text-esgreen-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockActivityData.reduce((acc, day) => acc + day.calories, 0)} kcal</div>
              <p className="text-xs text-muted-foreground">This week</p>
              <Progress value={75} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-esteal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWorkoutData.completed}/{mockWorkoutData.goal}</div>
              <p className="text-xs text-muted-foreground">Weekly goal</p>
              <Progress value={(mockWorkoutData.completed / mockWorkoutData.goal) * 100} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Footprints className="h-4 w-4 text-espurple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStepsData.count.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Daily goal: {mockStepsData.goal.toLocaleString()}</p>
              <Progress value={(mockStepsData.count / mockStepsData.goal) * 100} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Nutrition</CardTitle>
              <Apple className="h-4 w-4 text-esgreen-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNutritionData.consumed}/{mockNutritionData.goal}</div>
              <p className="text-xs text-muted-foreground">Calories consumed</p>
              <Progress value={(mockNutritionData.consumed / mockNutritionData.goal) * 100} className="h-2 mt-3" />
            </CardContent>
          </Card>
        </section>

        {/* Charts and BMI */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 card-3d">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Calories burned this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }} 
                    />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardHeader>
              <CardTitle>BMI Calculator</CardTitle>
              <CardDescription>Body Mass Index</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              {bmi ? (
                <>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth="10" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="10" 
                        strokeDasharray={`${Math.min(parseFloat(bmi) * 6, 283)} 283`} 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{bmi}</span>
                      <span className="text-xs text-muted-foreground">BMI</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Your BMI indicates:</p>
                    <p className={`font-medium ${bmiCategory?.color}`}>{bmiCategory?.category}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Update your height and weight in your profile to calculate BMI</p>
                  <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/profile'}>
                    Update Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section>
          <Card className="card-3d">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest fitness milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "First Workout", description: "Completed your first workout session", icon: Dumbbell, date: "2 days ago" },
                  { title: "Step Master", description: "Reached 10,000 steps in a day", icon: Footprints, date: "5 days ago" },
                  { title: "Nutrition Tracker", description: "Logged meals for 7 consecutive days", icon: Apple, date: "1 week ago" },
                ].map((achievement, i) => (
                  <Card key={i} className="bg-card/50 border-primary/10">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <achievement.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
