
import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, MapPin, User, Shield, Mail, Phone, CalendarDays } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age?.toString() || "",
    height: user?.height?.toString() || "",
    weight: user?.weight?.toString() || "",
    address: user?.address || "",
    phone: user?.phone || "",
    medicalConditions: user?.medicalConditions || [],
    profileImage: user?.profileImage || "/placeholder.svg",
  });

  // Handle medical conditions checkbox change
  const handleCheckboxChange = (value: string) => {
    setProfileData((prev) => {
      const medicalConditions = prev.medicalConditions.includes(value)
        ? prev.medicalConditions.filter((condition) => condition !== value)
        : [...prev.medicalConditions, value];
      return { ...prev, medicalConditions };
    });
  };

  // Handle general form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Mock function to handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, we would upload this to a server
    // For now, let's just create a local URL for the image
    const imageUrl = URL.createObjectURL(file);
    setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert string values to numbers where appropriate
      const updatedData = {
        ...profileData,
        age: profileData.age ? parseInt(profileData.age) : undefined,
        height: profileData.height ? parseFloat(profileData.height) : undefined,
        weight: profileData.weight ? parseFloat(profileData.weight) : undefined,
      };

      await updateProfile(updatedData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (profileData.height && profileData.weight) {
      const heightInMeters = parseFloat(profileData.height) / 100;
      const bmi = parseFloat(profileData.weight) / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

  return (
    <Layout title="Profile">
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <div className="glass-card rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profileData.name)}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="profile-image" 
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
              
              <div className="text-center md:text-left space-y-1 flex-1">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <div className="flex flex-col md:flex-row gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 md:self-start">
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-3d">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-esgreen-400" />
                    Age
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.age || "Not set"}</div>
                  <p className="text-xs text-muted-foreground">years</p>
                </CardContent>
              </Card>
              
              <Card className="card-3d">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-esteal-400" />
                    Height
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.height || "Not set"}</div>
                  <p className="text-xs text-muted-foreground">centimeters</p>
                </CardContent>
              </Card>
              
              <Card className="card-3d">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-espurple-400" />
                    Weight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profileData.weight || "Not set"}</div>
                  <p className="text-xs text-muted-foreground">kilograms</p>
                </CardContent>
              </Card>
            </div>
            
            {/* BMI Card */}
            {bmi && (
              <Card className="card-3d">
                <CardHeader>
                  <CardTitle>Body Mass Index (BMI)</CardTitle>
                  <CardDescription>Your current BMI based on height and weight</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-4">
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
                      <span className="text-xs text-muted-foreground">Your BMI</span>
                    </div>
                  </div>

                  <div className="ml-8">
                    <h4 className="font-medium text-lg">BMI Categories:</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span>Below 18.5: Underweight</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span>18.5 - 24.9: Normal weight</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>25 - 29.9: Overweight</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>30 and above: Obese</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit}>
              <Card className="card-3d">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={profileData.age}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        value={profileData.height}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        value={profileData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                      {["Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Arthritis", "None"].map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={profileData.medicalConditions.includes(condition)}
                            onCheckedChange={() => handleCheckboxChange(condition)}
                          />
                          <Label htmlFor={condition} className="text-sm font-normal">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" />
                      <Label htmlFor="email-notifications">Receive email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="activity-sharing" />
                      <Label htmlFor="activity-sharing">Share my activity data anonymously to improve services</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Devices</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage devices that have access to your account.
                  </p>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm">No devices connected yet</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
