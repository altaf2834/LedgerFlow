import { createContext, useContext, useReducer, useEffect } from "react";
import * as authApi from "../api/auth.api";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // true until we've checked localStorage on first load
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "FINISH_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On first mount: check if a token + user already exist from a previous session
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: JSON.parse(storedUser) },
      });
    } else {
      dispatch({ type: "FINISH_LOADING" });
    }
  }, []);

  const login = async (credentials) => {
    const data = await authApi.loginUser(credentials);
    // Adjust these keys to match your actual backend response shape
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN_SUCCESS", payload: { user: data.user } });
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.registerUser(userData);
    return data; // typically you'd redirect to login after this, not auto-login
  };

  const logout = async () => {
    try {
      await authApi.logoutUser();
    } finally {
      // Clear client state regardless of whether the backend call succeeded —
      // user should never feel "stuck logged in" due to a network error.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components do `useAuth()` instead of importing
// useContext + AuthContext everywhere — cleaner and hides the plumbing
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}