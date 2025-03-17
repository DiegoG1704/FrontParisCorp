"use client"; // Necesario para usar hooks en App Router

import axios from "axios";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Datos {
  username: string;
  password: string;
}

interface ModuloClase {
  titulo: string;
  descripcion: string;
  duracion: string;
  completado: boolean;
  video: string;
}

interface Modulo {
  titulo: string;
  descripcion: string;
  clases: ModuloClase[];
}

interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  listProductos: Modulo[];
  fetchProductos: () => void;
  datos: Datos;
  setDatos: (datos: Datos) => void;
  handleSelect: (field: "username" | "password", value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  login: () => void;
  errorMessage:string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [listProductos, setListProductos] = useState<Modulo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [datos, setDatos] = useState<Datos>({ username: "", password: "" });

  const router = useRouter();

  const handleSelect = (field: "username" | "password", value: string) => {
    setDatos((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const login = async () => {
     if (datos.username === '' || datos.password === '') {
        setErrorMessage('Por favor ingrese su correo y contraseña.');
        return;
      } 
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LOCALHOST}login`, datos);

      if (!response.data || !response.data.access_token) {
        setErrorMessage("No se recibió un token válido.");
        return;
      }
      const token = response.data.access_token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", datos.username); // Guardamos el usuario
      setUser(datos.username);
      setErrorMessage(null);
      router.push("/Principal");
      setDatos({ username: "", password: "" })
      fetchProductos(); // Cargar productos después de iniciar sesión
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Datos incorrectos, por favor intente de nuevo.");
    }
  };

  const fetchProductos = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No se encontró token de autenticación.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_LOCALHOST}api/Modulos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Cargar usuario y productos si hay un token almacenado
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("username");

    if (token && storedUser) {
      setUser(storedUser); // Restauramos el usuario
      fetchProductos(); // Cargamos los productos
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        listProductos,
        fetchProductos,
        handleChange,
        handleSelect,
        errorMessage,
        datos,
        login,
        setDatos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
};
