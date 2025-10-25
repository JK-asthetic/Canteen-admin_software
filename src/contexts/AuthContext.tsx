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
import { storage } from "@/lib/storage";

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

  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const bootstrapAsync = async (): Promise<void> => {
      let token = null;
      try {
        if (typeof window !== "undefined") {
          token = await storage.getItem("userToken");
          setUserToken(token);

          if (token) {
            try {
              const userData = await authApi.getCurrentUser();
              setUser(userData);

              if (isPublicRoute) {
                router.push("/dashboard");
              }
            } catch (error) {
              console.error("Error getting current user:", error);
              await storage.removeItem("userToken");
              setUserToken(null);
              setUser(null);

              if (!isPublicRoute) {
                router.push("/");
              }
            }
          } else {
            if (!isPublicRoute) {
              router.push("/");
            }
          }
        }
      } catch (e: unknown) {
        console.error("Failed to load token", e);
        setUserToken(null);
        setUser(null);

        if (!isPublicRoute) {
          router.push("/");
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
      const response = await authApi.adminLogin(username, password);
      const { token, user } = response;

      if (typeof window !== "undefined") {
        await storage.setItem("userToken", token);
      }

      setUserToken(token);
      setUser(user);
      setIsSignout(false);

      router.push("/dashboard");
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

      setUserToken(null);
      setUser(null);

      if (typeof window !== "undefined") {
        await storage.removeItem("userToken");
      }

      await authApi.logout();

      router.push("/");
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      router.push("/");
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
        await storage.removeItem("userToken");
      }

      setUserToken(null);
      setUser(null);

      if (!isPublicRoute) {
        router.push("/");
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
