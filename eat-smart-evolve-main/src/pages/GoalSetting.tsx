
import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import BMICalculator from "@/components/BMICalculator";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Scale, 
  Heart, 
  Dumbbell,
  CheckCircle
} from "lucide-react";

// Mock fitness goals data
const fitnessGoalsData = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    icon: TrendingDown,
    description: "Burn fat and reduce overall body weight",
    popular: true,
    recommended: true,
    details: {
      nutrition: "Calorie deficit of 500 calories/day",
      exercise: "Cardio 3-5 times per week, strength training 2-3 times per week",
      tips: "Focus on high protein intake, control portion sizes"
    }
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    icon: Dumbbell,
    description: "Build muscle mass and strength",
    popular: true,
    recommended: false,
    details: {
      nutrition: "Calorie surplus of 300-500 calories/day, high protein intake",
      exercise: "Heavy strength training 4-5 times per week, limited cardio",
      tips: "Progressive overload, adequate rest between workouts"
    }
  },
  {
    id: "maintain-weight",
    title: "Maintain Weight",
    icon: Scale,
    description: "Maintain current weight while improving fitness",
    popular: false,
    recommended: false,
    details: {
      nutrition: "Balanced diet with maintenance calories",
      exercise: "Mix of cardio and strength training 3-4 times per week",
      tips: "Focus on nutrient-dense foods, regular exercise routine"
    }
  },
  {
    id: "improve-fitness",
    title: "Improve Fitness",
    icon: Heart,
    description: "Enhance overall fitness and endurance",
    popular: false,
    recommended: false,
    details: {
      nutrition: "Balanced diet with adequate carbohydrates for energy",
      exercise: "Mix of HIIT, cardio, and functional training 4-5 times per week",
      tips: "Gradually increase intensity and duration of workouts"
    }
  },
  {
    id: "custom-goal",
    title: "Custom Goal",
    icon: Target,
    description: "Create your own personalized fitness goal",
    popular: false,
    recommended: false,
    details: {
      nutrition: "Tailored to your specific needs",
      exercise: "Customized workout plan based on your goals",
      tips: "Work with a fitness professional to create a personalized plan"
    }
  }
];

// Mock current goals
const initialUserGoals = [
  {
    id: "weight-loss",
    target: "Lose 5 kg",
    progress: 40,
    timeline: "3 months",
    startDate: "2025-01-15",
  }
];

const GoalSetting = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [userGoals, setUserGoals] = useState(initialUserGoals);
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDuration, setTargetDuration] = useState(12); // weeks

  // Calculate weight loss rate
  const calculateWeightLossRate = () => {
    if (!user?.weight || !targetWeight) return null;
    
    const currentWeight = user.weight;
    const target = parseFloat(targetWeight);
    const weightDifference = Math.abs(currentWeight - target);
    const weeklyRate = weightDifference / targetDuration;
    
    return weeklyRate.toFixed(1);
  };

  const weeklyRate = calculateWeightLossRate();

  // Handle adding a new goal
  const handleAddGoal = () => {
    if (!selectedGoal) {
      toast({
        title: "Please select a goal",
        description: "Choose a fitness goal from the list to continue",
        variant: "destructive",
      });
      return;
    }

    // For weight loss/gain goals, require target weight
    if ((selectedGoal === "weight-loss" || selectedGoal === "muscle-gain") && !targetWeight) {
      toast({
        title: "Target weight needed",
        description: "Please enter your target weight",
        variant: "destructive",
      });
      return;
    }

    const selectedGoalData = fitnessGoalsData.find(goal => goal.id === selectedGoal);
    if (!selectedGoalData) return;

    // Create a new goal object
    const newGoal = {
      id: selectedGoal,
      target: selectedGoal === "weight-loss" ? `Lose ${(user?.weight || 0) - parseFloat(targetWeight)} kg` : 
             selectedGoal === "muscle-gain" ? `Gain ${parseFloat(targetWeight) - (user?.weight || 0)} kg` :
             "Improve overall fitness",
      progress: 0,
      timeline: `${targetDuration} weeks`,
      startDate: new Date().toISOString().split('T')[0],
    };

    setUserGoals(prev => [...prev, newGoal]);
    
    toast({
      title: "Goal added",
      description: `${selectedGoalData.title} has been added to your goals`,
    });

    setSelectedGoal(null);
    setTargetWeight("");
    setTargetDuration(12);
  };

  // Handle removing a goal
  const handleRemoveGoal = (goalId: string) => {
    setUserGoals(prev => prev.filter(goal => goal.id !== goalId));
    
    toast({
      title: "Goal removed",
      description: "The goal has been removed from your list",
    });
  };

  return (
    <Layout title="Goal Setting">
      <div className="space-y-8">
        {/* Intro section */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Set Your Fitness Goals</h2>
              <p className="text-muted-foreground">
                Define clear fitness goals to track your progress and stay motivated. Choose from our recommended goals or create your own.
              </p>
            </div>
          </div>
        </section>

        {/* Goal Creation and Current Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left side - Current goals */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Current Goals</CardTitle>
                <CardDescription>Your active fitness goals</CardDescription>
              </CardHeader>
              <CardContent>
                {userGoals.length > 0 ? (
                  <div className="space-y-4">
                    {userGoals.map((goal) => {
                      const goalData = fitnessGoalsData.find(g => g.id === goal.id);
                      const Icon = goalData?.icon || Target;
                      
                      return (
                        <div key={goal.id + goal.startDate} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-3">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{goalData?.title}</h4>
                                <p className="text-sm text-muted-foreground">{goal.target}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleRemoveGoal(goal.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Started: {goal.startDate}</span>
                              <span>Timeline: {goal.timeline}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                      <Target className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No goals set yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start by selecting a fitness goal from the options on the right
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BMI Calculator */}
            <BMICalculator />
          </div>

          {/* Right side - Goal selection */}
          <div className="lg:col-span-3">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
                <CardDescription>Select a fitness goal to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {fitnessGoalsData.map((goal) => (
                    <div 
                      key={goal.id}
                      className={`rounded-lg border p-4 cursor-pointer transition-colors hover:border-primary ${
                        selectedGoal === goal.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 p-3 rounded-full mb-3">
                          <goal.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        {goal.popular && (
                          <span className="mt-2 px-2 py-0.5 rounded text-xs bg-esgreen-400/10 text-esgreen-400">
                            Popular
                          </span>
                        )}
                        {goal.recommended && (
                          <span className="mt-2 px-2 py-0.5 rounded text-xs bg-espurple-400/10 text-espurple-400">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedGoal && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Goal Details</h3>
                      
                      {(selectedGoal === "weight-loss" || selectedGoal === "muscle-gain") && (
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-weight">Current Weight (kg)</Label>
                              <Input
                                id="current-weight"
                                value={user?.weight || ""}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="target-weight">Target Weight (kg)</Label>
                              <Input
                                id="target-weight"
                                placeholder="e.g. 65"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Timeline (weeks)</Label>
                              <span>{targetDuration} weeks</span>
                            </div>
                            <Slider
                              value={[targetDuration]}
                              min={4}
                              max={52}
                              step={1}
                              onValueChange={(values) => setTargetDuration(values[0])}
                            />
                          </div>
                          
                          {weeklyRate && (
                            <div className="p-3 rounded-md bg-muted">
                              <p className="text-sm">
                                <span className="font-medium">Rate: </span>
                                {weeklyRate} kg per week ({selectedGoal === "weight-loss" ? "loss" : "gain"})
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {parseFloat(weeklyRate) > 1 ? 
                                  "A more gradual rate (0.5-1 kg/week) may be more sustainable." : 
                                  "This is a healthy, sustainable rate."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Tabs defaultValue="nutrition">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                          <TabsTrigger value="exercise">Exercise</TabsTrigger>
                          <TabsTrigger value="tips">Tips</TabsTrigger>
                        </TabsList>
                        
                        {(() => {
                          const goalData = fitnessGoalsData.find(goal => goal.id === selectedGoal);
                          if (!goalData) return null;
                          
                          return (
                            <>
                              <TabsContent value="nutrition" className="py-4">
                                <p className="text-sm">{goalData.details.nutrition}</p>
                              </TabsContent>
                              <TabsContent value="exercise" className="py-4">
                                <p className="text-sm">{goalData.details.exercise}</p>
                              </TabsContent>
                              <TabsContent value="tips" className="py-4">
                                <p className="text-sm">{goalData.details.tips}</p>
                              </TabsContent>
                            </>
                          );
                        })()}
                      </Tabs>
                    </div>
                    
                    <Button onClick={handleAddGoal}>Add Goal</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GoalSetting;
