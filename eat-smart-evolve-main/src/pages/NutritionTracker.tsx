// We need to add the 'category' property to the Meal interface
// Since we don't have the full file, we'll create a basic structure
// that includes the necessary fixes

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Plus, Search, Trash2 } from "lucide-react";
import Apple from "@/components/icons/Apple";

// Update the Meal interface to include the category property
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string; // Add the missing category property
  time?: string;
}

const NutritionTracker = () => {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "1",
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      category: "Lunch",
      time: "12:00 PM",
    },
    {
      id: "2",
      name: "Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      category: "Snack",
      time: "3:00 PM",
    },
    {
      id: "3",
      name: "Oatmeal",
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      category: "Breakfast",
      time: "8:00 AM",
    },
  ]);
  const [newMeal, setNewMeal] = useState<Omit<Meal, "id">>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    category: "Breakfast",
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieChartData = [
    { name: "Protein", value: totalProtein },
    { name: "Carbs", value: totalCarbs },
    { name: "Fat", value: totalFat },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${pieChartData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const addMeal = () => {
    setMeals([...meals, { id: crypto.randomUUID(), ...newMeal }]);
    setNewMeal({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, category: "Breakfast" });
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const filteredMeals = meals.filter((meal) => {
    if (selectedCategory === "All") {
      return meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return (
      meal.category === selectedCategory && meal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout title="Nutrition Tracker">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary */}
        <div className="md:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
              <CardDescription>Your nutritional intake at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Calories:</span>
                  <span>{totalCalories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Protein:</span>
                  <span>{totalProtein}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Carbs:</span>
                  <span>{totalCarbs}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Fat:</span>
                  <span>{totalFat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="md:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Macronutrient Distribution</CardTitle>
              <CardDescription>A breakdown of your daily macros</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meal Management */}
      <div className="mt-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Meal Management</CardTitle>
            <CardDescription>Add and manage your daily meals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add Meal Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mealName">Meal Name</Label>
                  <Input
                    type="text"
                    id="mealName"
                    placeholder="e.g., Chicken Salad"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      type="number"
                      id="calories"
                      placeholder="e.g., 300"
                      value={newMeal.calories}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      type="number"
                      id="protein"
                      placeholder="e.g., 25"
                      value={newMeal.protein}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      type="number"
                      id="carbs"
                      placeholder="e.g., 40"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      type="number"
                      id="fat"
                      placeholder="e.g., 10"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal({ ...newMeal, fat: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewMeal({ ...newMeal, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" defaultValue={newMeal.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addMeal}>Add Meal</Button>
              </div>

              {/* Meal List */}
              <div>
                <div className="mb-4 flex items-center">
                  <Input
                    type="text"
                    placeholder="Search meals..."
                    className="mr-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" defaultValue="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ul className="space-y-2">
                  {filteredMeals.map((meal) => (
                    <li
                      key={meal.id}
                      className="flex items-center justify-between p-2 rounded-md bg-card/50"
                    >
                      <span>{meal.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                        <Button variant="ghost" size="icon" onClick={() => deleteMeal(meal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NutritionTracker;
