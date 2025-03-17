"use client"; // Necesario para usar hooks en App Router
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
const AppContext = createContext(undefined);
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("light");
    const [listProductos, setListProductos] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [datos, setDatos] = useState({ username: "", password: "" });
    const router = useRouter();
    const handleSelect = (field, value) => {
        setDatos((prev) => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
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
            setDatos({ username: "", password: "" });
            fetchProductos(); // Cargar productos después de iniciar sesión
        }
        catch (error) {
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
        }
        catch (error) {
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
    return (<AppContext.Provider value={{
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
        }}>
      {children}
    </AppContext.Provider>);
};
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext debe usarse dentro de un AppProvider");
    }
    return context;
};
