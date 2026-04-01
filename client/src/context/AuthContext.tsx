import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import toast from "react-hot-toast";
import axios from "axios";

function authPayloadToUser(data: {
  user?: IUser & { _id?: string };
  _id?: string;
  name?: string;
  email?: string;
}): IUser | null {
  if (data.user) return data.user as IUser;
  if (data._id != null && data.name != null && data.email != null) {
    return { name: data.name, email: data.email, _id: data._id } as IUser;
  }
  return null;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      fallback
    );
  }
  return fallback;
}

interface AuthContextProps{
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user:IUser | null;
    setUser: (user: IUser | null) => void;
    login: (user:{email: string; password: string})=> Promise<void>;
    signUp: (user:{name: string; email: string; password: string})=> Promise<void>;
    logout: ()=> Promise<void>;

}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    login: async () => {},
    signUp: async () => {},
    logout: async () => {},

})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const signUp = async({ name, email, password }: { name: string; email: string; password: string }) => {
        try {
            const {data} = await api.post('/api/auth/register', { name, email, password });
            const nextUser = authPayloadToUser(data);
            if (nextUser) {
                setUser(nextUser);
                setIsLoggedIn(true);
            }
            toast.success(data.message || "Registration successful");
        } catch (error) {
            toast.error(getErrorMessage(error, "Registration failed"));
        }
    }

    const login = async({ email, password }: { email: string; password: string }) => {
        try {
            const {data} = await api.post('/api/auth/login', { email, password });
            const nextUser = authPayloadToUser(data);
            if (nextUser) {
                setUser(nextUser);
                setIsLoggedIn(true);
            }
            toast.success(data.message || "Login successful");
        } catch (error) {
            toast.error(getErrorMessage(error, "Login failed"));
        }
    }
    const logout = async()=>{
        try {
            const {data} = await api.post('/api/auth/logout');
            setUser(null);
            setIsLoggedIn(false);
            toast.success(data.message || "Logout successful");
        } catch (error) {
            toast.error(getErrorMessage(error, "Logout failed"));
        }
    }
    const fetchUser = async()=>{
        try {
            const {data} = await api.get('/api/auth/verify');
            if(data?.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
        } catch {
            /* not logged in or session expired — expected on first visit */
        }

    }

    useEffect(() => {
        (async () => {
            await fetchUser();
        })();
    },[])


    const value ={
            user,
            setUser,
            isLoggedIn,
            setIsLoggedIn,
            signUp,
            login,
            logout,
            fetchUser

    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);