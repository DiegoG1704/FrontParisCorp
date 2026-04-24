"use client"; // Necesario para usar hooks en App Router

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../Herramientas/axiosToken";
import axios from "axios";

interface Datos {
  usuario: string;
  contraseña: string;
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

interface Modelo {
  id:Number;
  nombre:string;
}

interface DetallePrenda{
  idProduccion:Number,
  nombreModelo:String
}

interface InformeProduc{
  idProduccion:Number,
  nombreModelo:String,
  area:String
}
interface PrendaDetalle{
  idPrenda:Number,
  idProduccion:Number,
  idDetallePrenda:Number,
  nombrePrenda:String
}

export interface InfomPrenda {
  id: number
  nombrePrenda: string
  nombreTaller: string
  direccion: string
  codigo: string
  idProduccion: number
  fechaInicio: string
  area: string
  estado: string
  idPrenda: number
  cantidad: number
  cantidadExt: number
  talla: string
  idDetalle: number
  cantidadTotal: number
  estadoinforme: string
  cantInfor: number | null
  cantMerma: number | null
}


interface AppContextType {
  user: any;
  setPrendasConf: React.Dispatch<React.SetStateAction<InfomPrenda[]>>;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  listProductos: Modulo[];
  datos: Datos;
  setDatos: (datos: Datos) => void;
  handleSelect: (field: "usuario" | "contraseña", value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  login: () => void;
  errorMessage:string | null;
  color:any;
  talla:any;
  prenda:any;
  modelo:any;
  material:any;
  rutas:any;
  roles:any;
  clientes:any;
  personal:any;
  produccion:any;
  prendaDetalle:any;
  visible: boolean;
  taller:any;
  detalleInforme:any;
  usuario:string | null;
  detallePrenda:any;
  prendasConf:any;
  notif:any;
  pedidos:any;
  dashAsist:any;
  preVenta:any;
  config:any;
  asistencia:any;
  asistenciaPers:any;
  setVisible: (v: boolean) => void;
  selectProd: Modelo | null;
  selectPrenda:DetallePrenda| null;
  setSelectProd: (p: Modelo | null) => void;
  setSelectPrenda:(p:DetallePrenda| null)=>void;
  setSelectDetallePrenda:(p:PrendaDetalle| null)=>void;
  ListaPrendasConfirmacion: () => Promise<void>;
  modeloPred:any
  ListaModelo: () => Promise<void>;
  ListaRoles: () => Promise<void>;
  ListaPersonal : ()=>Promise<void>;
  ListaTaller: ()=>Promise<void>;
  ListaProduccion:()=>Promise<void>;
  ListaDetallesInforme:()=>Promise<void>;
  ListaPrenda:()=>Promise<void>;
  Listacolor:()=>Promise<void>;
  Listamaterial:()=>Promise<void>;
  ListaClientes:()=>Promise<void>;
  ListaPedidos:()=>Promise<void>;
  ListaAsistencia:()=>Promise<void>;
  ListaAsistenciaId:()=>Promise<void>;
  ListaAsistenciaDash:()=>Promise<void>;
  ListaConfiguraciones:()=>Promise<void>;
  ListaNotificiaciones:()=>Promise<void>;
  me:()=>Promise<void>;
  selectInforme:InformeProduc| null;
  setSelectInforme:(p:InformeProduc| null)=>void;
  setConfig:()=>void;
  setSelectPedidos:()=>void;
  informePedidos:any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [listProductos] = useState<Modulo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [datos, setDatos] = useState<Datos>({ usuario: "", contraseña: "" });
  const [color,setColor]=useState([])
  const [talla,setTalla]=useState([])
  const [prenda,setPrenda]=useState([])
  const [modelo,setModelo]=useState([])
  const [rutas,setRutas]=useState([])
  const [roles,setRoles]=useState([])
  const [asistencia,setAsistencia]=useState([])
  const [asistenciaPers,setAsistenciaPers]=useState([])
  const [config,setConfig]=useState([])
  const [notif,setnotif]=useState([])
  const [personal,setPersonal]=useState([])
  const [material,setMaterial]=useState([])
  const [produccion,setProduccion]=useState([])
  const [modeloPred,setModeloPred]=useState([])
  const [prendasConf, setPrendasConf] = useState<InfomPrenda[]>([])
  const [prendaDetalle,setPrendaDetalle]=useState([])
  const [detalleInforme,setDetalleInforme]=useState([])
  const [clientes,setClientes]=useState([])
  const [taller,setTaller]=useState([])
  const [usuario, setUsuario] = useState<string| null>(null); // Puedes tiparlo mejor si sabes su estructura
  const [detallePrenda,setDetallePrenda]=useState([])
  const [dashAsist,setDashAsist]=useState([])
  const [visible,setVisible]=useState(false)
  const [selectProd, setSelectProd] = useState<Modelo | null>(null);
  const [selectPrenda, setSelectPrenda] = useState<DetallePrenda| null>(null);
  const [selectDetallePrenda, setSelectDetallePrenda] = useState<PrendaDetalle| null>(null);
  const [selectInforme,setSelectInforme]=useState<InformeProduc| null>(null);
  const [selectPedidos,setSelectPedidos]=useState(null);
  const [informePedidos,setInformePedidos]=useState(null);
  const [pedidos,setPedidos]=useState<InformeProduc| null>(null);
  const [preVenta, setPreventa] = useState([])

  const user = usuario?.datosUsuario;

  const router = useRouter();

  const handleSelect = (field: "usuario" | "contraseña", value: string) => {
    setDatos((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const Listacolor = async()=>{
    try {
      const response=await axiosInstance.get('getColor')
      setColor(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const Listamaterial = async()=>{
    try {
      const response=await axiosInstance.get('getMaterial')
      setMaterial(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaClientes = async()=>{
    try {
      const response=await axiosInstance.get('getClientes')
      setClientes(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPrendaDetalle = async () => {
    try {
      const response = await axiosInstance.get(`getPrendasProduccion/${selectPrenda?.idProduccion}`);
      // Verifica que la respuesta sea un arreglo de objetos que cumplen con la interfaz 'Prenda'
      setPrendaDetalle(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles de la prenda', error);
    }
  };

  const ListaDetallesInforme = async () => {
    try {
      const response = await axiosInstance.get(`getDetallesInforme/${selectDetallePrenda?.idDetallePrenda}`);
      // Verifica que la respuesta sea un arreglo de objetos que cumplen con la interfaz 'Prenda'
      setDetalleInforme(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles de la prenda', error);
    }
  };

  const ListaDetallePrenda = async () => {
    try {
      const response = await axiosInstance.get(`getDetallePrenda/${selectDetallePrenda?.idDetallePrenda}`);
      // Verifica que la respuesta sea un arreglo de objetos que cumplen con la interfaz 'Prenda'
      setDetallePrenda(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los detalles de la prenda', error);
    }
  };

  const ListaTaller = async()=>{
    try {
      const response=await axiosInstance.get('getTaller')
      setTaller(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPrendasConfirmacion = async () => {
    if (!selectInforme || !selectInforme.idProduccion) {
      console.warn("selectInforme o idProduccion no está definido.");
      return;
    }

    try {
      const response = await axiosInstance.get(`getInforme/${selectInforme.idProduccion}/${selectInforme.area}`);
      setPrendasConf(response.data);
    } catch (error) {
      console.error('Error al obtener el informe:', error);
    }
  };

  const ListaPrendasModelo = async () => {
    if (!selectInforme || !selectInforme.idProduccion) {
      console.warn("selectInforme o idProduccion no está definido.");
      return;
    }

    try {
      const response = await axiosInstance.get(`getInforme/${selectInforme.idProduccion}/${selectInforme.area}`);
      setPrendasConf(response.data);
    } catch (error) {
      console.error('Error al obtener el informe:', error);
    }
  };

  const ListaTallas = async()=>{
    try {
      const response=await axiosInstance.get('getTallas')
      setTalla(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPrenda = async()=>{
    try {
      const response=await axiosInstance.get('getPrenda')
      setPrenda(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaModelo = async()=>{
    try {
      const response=await axiosInstance.get('getModelo')
      setModelo(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const me = async () => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    try {
      const response = await axiosInstance.get(`me/${storedIdUsuario}`);
      setUsuario(response.data);
    } catch (error) {
      console.error('Error en me():', error);
    }
  };


  const ListaRutas = async()=>{
    try {
      const response=await axiosInstance.get('getRutas')
      setRutas(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaRoles = async()=>{
    try {
      const response=await axiosInstance.get('getRoles')
      setRoles(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPedidos = async()=>{
    try {
      const response=await axiosInstance.get('getPedidos')
      setPedidos(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPedidosId = async()=>{
    try {
      const response=await axiosInstance.get(`getPedidos/${selectPedidos.id}`)
      setInformePedidos(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPersonal = async()=>{
    try {
      const response=await axiosInstance.get('getPersonal')
      setPersonal(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaProduccion = async()=>{
    try {
      const response=await axiosInstance.get('getDetalleProduccion')
      setProduccion(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaPreventa = async()=>{
    try {
      const response=await axiosInstance.get('getSobreventa')
      setPreventa(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaAsistencia = async()=>{
    try {
      const response=await axiosInstance.get('getAsistencia')
      setAsistencia(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaAsistenciaId = async()=>{
    try {
      const response=await axiosInstance.get(`getAsistencia/general/${usuario?.datosUsuario?.id}`)
      setAsistenciaPers(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaConfiguraciones = async()=>{
    try {
      const response=await axiosInstance.get(`getConfiguraciones/${usuario?.datosUsuario?.id}`)
      setConfig(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaNotificiaciones = async()=>{
    try {
      const response=await axiosInstance.get(`getNotificaciones/${usuario?.datosUsuario?.id}`)
      setnotif(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaAsistenciaDash = async()=>{
    try {
      const response=await axiosInstance.get(`getAsistencia/dashboard/${usuario?.datosUsuario?.id}`)
      setDashAsist(response.data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const ListaModeloPrendas = async () => {
  if (selectProd && selectProd.id) {  // Verificamos si selectProd no es null y tiene un id
      try {
        const response = await axiosInstance.get(`getPrenda/${selectProd.id}`);
        setModeloPred(response.data);
      } catch (error) {
        console.error("Error al obtener las prendas del modelo:", error);
      }
    } else {
      console.log("selectProd es null o no tiene un id válido.");
    }
  };

  const [token, setToken] = useState<string | null>(null)
  
  useEffect(() => {
    if (token && selectPrenda) {
      ListaPrendaDetalle();
    }
  }, [token, selectPrenda]);

  
  useEffect(() => {
    if (token && selectInforme?.idProduccion) {
      ListaPrendasConfirmacion();
    }
  }, [token, selectInforme]);

  useEffect(() => {
    if (token && selectDetallePrenda) {
      ListaDetallePrenda();
      ListaDetallesInforme();
    }
  }, [token, selectDetallePrenda]);

  useEffect(() => {
    if (token && selectPedidos) {
      ListaPedidosId();
    }
  }, [token, selectPedidos]);

  useEffect(() => {
    if (token && selectProd) {
      ListaModeloPrendas();
    }
  }, [token, selectProd]);

  useEffect(() => {
    if (token) {
      Listacolor();
      ListaTallas();
      ListaPrenda();
      ListaModelo();
      ListaTaller();
      Listamaterial();
      ListaRutas();
      ListaRoles();
      ListaPersonal();
      ListaProduccion();
      ListaPedidos();
      ListaClientes();
      ListaPreventa();
      ListaAsistenciaDash();
      ListaAsistencia();
      me();
    }
  }, [token]);

  useEffect(() => {
    if (usuario?.datosUsuario?.id) {
      ListaAsistenciaId();
      ListaAsistenciaDash();
      ListaConfiguraciones();
      ListaNotificiaciones();
    }
  }, [usuario]);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async () => {
     if (datos.usuario === '' || datos.contraseña === '') {
        setErrorMessage('Por favor ingrese su correo y contraseña.');
        return;
      } 
    try {
      const response = await axios.post('http://localhost:4000/login', datos);
      if (!response.data || !response.data.access_token) {
        setErrorMessage("No se recibió un token válido.");
        return;
      }
      setToken(response.data.access_token);
      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token)
      localStorage.setItem('idUsuario', response.data?.id)
      setErrorMessage(null);
      router.push("/Principal");
      setDatos({ usuario: "", contraseña: "" })
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Datos incorrectos, por favor intente de nuevo.");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        usuario,
        theme,
        setTheme,
        listProductos,
        handleChange,
        handleSelect,
        errorMessage,
        datos,
        login,
        setDatos,
        color,
        talla,
        prenda,
        modelo,
        produccion,
        visible,
        setVisible,
        selectProd,
        setSelectProd,
        selectPrenda,
        modeloPred,
        material,
        ListaModelo,
        rutas,
        ListaRoles,
        roles,
        personal,
        ListaPersonal,
        taller,
        ListaTaller,
        setSelectPrenda,
        ListaProduccion,
        prendaDetalle,
        detallePrenda,
        prendasConf,
        setSelectDetallePrenda,
        setSelectInforme,
        selectInforme,
        setPrendasConf,
        ListaPrendasConfirmacion,
        ListaDetallesInforme,
        detalleInforme,
        ListaPrenda,
        Listacolor,
        Listamaterial,
        ListaClientes,
        clientes,
        pedidos,
        setSelectPedidos,
        informePedidos,
        ListaPedidos,
        preVenta,
        asistencia,
        asistenciaPers,
        ListaAsistencia,
        ListaAsistenciaId,
        dashAsist,
        ListaAsistenciaDash,
        ListaConfiguraciones,
        ListaNotificiaciones,
        config,
        notif,
        me
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
