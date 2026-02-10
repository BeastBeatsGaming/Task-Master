import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>; // To load user from token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Function to set axios default auth header
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Run when token changes or on initial load if token exists

  const loadUser = async () => {
    setIsLoading(true);
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      setUser(null); // ensure user is null if no token
      return;
    }
    try {
      const res = await axios.get<User>("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post<{
        _id: string;
        name: string;
        email: string;
        token: string;
      }>("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser(); // Reload user data
    } catch (err: any) {
      console.error("Login failed", err.response?.data?.message || err.message);
      logout(); // Clear any partial state
      throw err; // Re-throw to be caught by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post<{
        _id: string;
        name: string;
        email: string;
        token: string;
      }>("/api/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser(); // Reload user data
    } catch (err: any) {
      console.error(
        "Registration failed",
        err.response?.data?.message || err.message
      );
      logout();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAuthToken(null);
    // Optionally, redirect to login page here or in the component calling logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
