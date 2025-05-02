
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  age?: number;
  height?: number;
  weight?: number;
  medicalConditions?: string[];
  address?: string;
  phone?: string;
  goals?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // For demonstration purposes, we'll simulate authentication using localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("eat-smart-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call here
      // For now, we'll simulate a successful login if the user exists in localStorage
      const users = JSON.parse(localStorage.getItem("eat-smart-users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("eat-smart-user", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        navigate("/dashboard");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call here
      // For now, we'll simulate user registration using localStorage
      const users = JSON.parse(localStorage.getItem("eat-smart-users") || "[]");
      
      // Check if email is already in use
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        name: userData.name || "User",
        email: userData.email,
        password: userData.password,
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
        medicalConditions: userData.medicalConditions || [],
        address: userData.address,
        phone: userData.phone,
        goals: userData.goals || [],
        profileImage: userData.profileImage || "/placeholder.svg",
      };
      
      users.push(newUser);
      localStorage.setItem("eat-smart-users", JSON.stringify(users));
      
      // Log in the user after registration
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("eat-smart-user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration successful",
        description: `Welcome to EAT SMART, ${newUser.name}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eat-smart-user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      
      // Update user in localStorage
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("eat-smart-user", JSON.stringify(updatedUser));
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem("eat-smart-users") || "[]");
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem("eat-smart-users", JSON.stringify(updatedUsers));
      
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
