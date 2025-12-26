"use client";
import { login, register } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import api, { ApiError } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TAuthContext = {
  register: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export function AuthConetxtProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  const getAccessToken = useCallback(() => {
    return accessToken;
  }, [accessToken]);

  const setAccessTokenCallback = useCallback((token: string) => {
    setAccessToken(token);
  }, []);

  const handleAuthError = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    toast.error("Session expired. Please login again.");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          setIsInitializing(false);
          return;
        }

        // Call refresh endpoint to get new access token
        const response = await api.post<{ accessToken: string }>("refresh", {
          refreshToken,
        });

        if (response.accessToken) {
          setAccessToken(response.accessToken);
        }
      } catch (error) {
        console.error("Silent refresh failed:", error);
        localStorage.removeItem("refreshToken");
      } finally {
        setIsInitializing(false);
      }
    };

    silentRefresh();
  }, []);

  useEffect(() => {
    api.setAuthCallbacks({
      getAccessToken,
      setAccessToken: setAccessTokenCallback,
      onAuthError: handleAuthError,
    });
  }, [getAccessToken, setAccessTokenCallback, handleAuthError]);

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return register(username, password);
    },
    onSuccess(data: { message: string; user: any }) {
      if (data.user) {
        toast.success(data.message || "Registration successful!");
        router.push("/dashboard");
      }
    },
    onError(error: ApiError) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return login(username, password);
    },
    onSuccess(data: {
      accessToken: string;
      refreshToken: string;
      message?: string;
    }) {
      if (data.accessToken && data.refreshToken) {
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        toast.success(data.message || "Login successful!");
        router.push("/dashboard");
      }
    },
    onError(error: ApiError) {
      toast.error(error.message || "Login failed");
    },
  });

  function handleRegister({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    registerMutation.mutate({ username, password });
  }

  function handleLogin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    loginMutation.mutate({ username, password });
  }

  return (
    <AuthContext.Provider
      value={{
        register: handleRegister,
        login: handleLogin,
        isLoading:
          isInitializing ||
          loginMutation.isPending ||
          registerMutation.isPending,
        isAuthenticated: !!accessToken,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthConetxtProvider");
  }
  return context;
}
