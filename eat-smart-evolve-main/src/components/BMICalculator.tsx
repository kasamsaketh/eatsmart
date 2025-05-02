
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BMICalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const { toast } = useToast();

  const calculateBMI = () => {
    if (!height || !weight) {
      toast({
        title: "Missing information",
        description: "Please enter both height and weight",
        variant: "destructive",
      });
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (isNaN(heightInMeters) || isNaN(weightInKg)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid height and weight values",
        variant: "destructive",
      });
      return;
    }

    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI);
  };

  useEffect(() => {
    if (bmi === null) return;

    if (bmi < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmi < 24.9) {
      setBmiCategory("Normal weight");
    } else if (bmi < 29.9) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obese");
    }
  }, [bmi]);

  return (
    <Card className="card-3d">
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>
          Calculate your Body Mass Index
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              placeholder="170"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              placeholder="70"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {bmi !== null && (
          <div className="mt-6 p-4 bg-card rounded-lg border text-center">
            <h3 className="text-2xl font-bold">{bmi.toFixed(1)}</h3>
            <p className={`text-${
              bmiCategory === "Normal weight" 
                ? "green" 
                : bmiCategory === "Underweight" 
                  ? "blue" 
                  : bmiCategory === "Overweight" 
                    ? "yellow" 
                    : "red"
            }-400 font-medium`}>
              {bmiCategory}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={calculateBMI}>
          Calculate BMI
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BMICalculator;
