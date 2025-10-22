"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import * as authApi from "../api/auth";
import { User } from "../types/auth.types";

interface AuthContextProps {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

const initialAuthContext: AuthContextProps = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  getCurrentUser: async () => null,
};

export const AuthContext = createContext<AuthContextProps>(initialAuthContext);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Load token from storage on app start
  useEffect(() => {
    const bootstrapAsync = async (): Promise<void> => {
      let token = null;
      try {
        if (typeof window !== "undefined") {
          token = localStorage.getItem("userToken");
          setUserToken(token);

          if (token) {
            try {
              const userData = await authApi.getCurrentUser();
              setUser(userData);

              // If user is on login page and authenticated, redirect to home
              if (isPublicRoute) {
                router.push("/");
              }
            } catch (error) {
              console.error("Error getting current user:", error);
              localStorage.removeItem("userToken");
              setUserToken(null);
              setUser(null);

              // Redirect to login if not on public route
              if (!isPublicRoute) {
                router.push("/login");
              }
            }
          } else {
            // No token, redirect to login if not on public route
            if (!isPublicRoute) {
              router.push("/login");
            }
          }
        }
      } catch (e: unknown) {
        console.error("Failed to load token", e);
        setUserToken(null);
        setUser(null);

        if (!isPublicRoute) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [pathname]);

  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(username, password);
      const { token, user } = response;

      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", token);
      }

      setUserToken(token);
      setUser(user);
      setIsSignout(false);

      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setIsSignout(true);

      // Clear state first
      setUserToken(null);
      setUser(null);

      // Then clear storage and call logout API
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
      }

      await authApi.logout();

      // Redirect to login
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      // Still redirect to login even if API call fails
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error: unknown) {
      console.error("Error getting current user:", error);

      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
      }

      setUserToken(null);
      setUser(null);

      // Redirect to login
      if (!isPublicRoute) {
        router.push("/login");
      }

      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isSignout,
        userToken,
        user,
        signIn,
        signOut,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
