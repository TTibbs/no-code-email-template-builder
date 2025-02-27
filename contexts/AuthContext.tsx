"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import {
  getCurrentUser,
  setUserIdCookie,
  getUserIdFromCookie,
  deleteCookie,
  USER_ID_COOKIE,
  getMockUserById,
} from "@/lib/cookie-utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  // Load user from cookie on initial render
  useEffect(() => {
    refreshUser();
  }, []);

  // Refresh the current user from cookies
  const refreshUser = () => {
    setIsLoading(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };

  // Login function - sets the user cookie and updates state
  const login = (userId: string) => {
    const userData = getMockUserById(userId);

    if (userData) {
      setUserIdCookie(userId);
      setUser(userData);

      toast({
        title: "Success",
        description: `Logged in as ${userData.name}`,
      });

      // Redirect to the user's profile page
      router.push(`/profile/${userId}`);
    } else {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
    }
  };

  // Logout function - clears the user cookie and state
  const logout = () => {
    deleteCookie(USER_ID_COOKIE);
    setUser(undefined);

    toast({
      title: "Success",
      description: "Logged out successfully",
    });

    // Redirect to home page
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
