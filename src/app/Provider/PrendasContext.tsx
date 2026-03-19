"use client"; // Necesario para usar hooks en App Router

import { createContext, useState, useContext, ReactNode } from "react";
import { DropdownChangeEvent } from "primereact/dropdown";
import { useAppContext } from "./AppContext";
import axiosInstance from "../Herramientas/axiosToken";
import { useRouter } from "next/navigation";

interface Datos {
  modelo: string;
  idProduccion: string;
  fecha: string;
}

interface Prenda {
  prendaId:string| null;
  tallaId:string| null;
  nombre: string;
  talla:string;
  cantidad:string;
  cantidadExt:string;
}

interface Servicio {
  nombre: string;
}

// interface Tallas {
//   S: string;
//   M: string;
//   L: string;
//   XL: string;
// }

interface Producto {
  id:string| null;
  code: string;
  nombre: string;
  talla:string;
  cantidad:string;
  cantidadExt:string;
  tallaId:string| null;
}

interface Servicios {
  code: string;
  nombre: string;
  encargado: string;
  cantidad: string;
}

interface Taller {
  id: string;
  nombre_taller: string;
  nombre_encargado: string;
}

interface AppContextType {
  mensaje: string;
  setMensaje: (msg: string) => void;
  datos: Datos;
  setDatos: React.Dispatch<React.SetStateAction<Datos>>;
  cantida:string | null;
  setCantida:(cantida:string | null)=>void;
  handleDropChange: (e: DropdownChangeEvent, field: keyof Datos) => void;
  prendasL:Prenda;
  setPrendasL: React.Dispatch<React.SetStateAction<Prenda>>;
  products: Producto[];
  setProducts: React.Dispatch<React.SetStateAction<Producto[]>>;
  servicio:Servicio;
  setServicio:React.Dispatch<React.SetStateAction<Servicio>>;
  agregarProducto:()=>void;
  agregarServicio:()=>void;
  asignacionesPorTaller: Record<string, Producto[]>;
  setAsignacionesPorTaller: React.Dispatch<React.SetStateAction<Record<string, Producto[]>>>;
  servicios:Servicios[];
  setServicios:React.Dispatch<React.SetStateAction<Servicios[]>>;
  calcularCantidadTotal: (producto: Producto) => number;
  crearProduccion:()=>void;
  handleChange:(e: React.FormEvent<HTMLInputElement>)=>void
}

const PrendasContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const PrendasProvider = ({ children }: AppProviderProps) => {
  const {taller,ListaProduccion} = useAppContext();
  const [mensaje, setMensaje] = useState('Hola desde NuevoProvider');
  const [products, setProducts] = useState<Producto[]>([]);
  const [servicio, setServicio] = useState<Servicio>({ nombre: '' });
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [asignacionesPorTaller, setAsignacionesPorTaller] = useState<Record<string, Producto[]>>({});
  const router = useRouter();
  const [cantida,setCantida]=useState<string | null>(null)
  const [datos, setDatos] = useState<Datos>({
    modelo: '',
    idProduccion: '',
    fecha: '',
  });

  const [prendasL, setPrendasL] = useState<Prenda>({ 
    prendaId: '',
    tallaId: '',
    nombre: '',
    talla:'',
    cantidad:'',
    cantidadExt:'',
  });

  const handleDropChange = (e: DropdownChangeEvent, field: keyof Datos) => {
    setDatos(prev => ({ ...prev, [field]: e.value.id }));
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setPrendasL({
      ...prendasL,
      [name]: value,
    });
  };

  const agregarServicio = () => {
      const tallerSeleccionado = taller.find((t: Taller) => t.id === servicio.nombre);
      if (!tallerSeleccionado) return;
  
      const nuevoServicio: Servicios = {
        code: (servicios.length + 1).toString(),
        nombre: tallerSeleccionado.nombre_taller,
        encargado: tallerSeleccionado.nombre_encargado,
        cantidad: '0', // Inicial o puedes cambiarlo si tienes un valor previsto
      };
  
      setServicios(prev => [...prev, nuevoServicio]);
      setServicio({ nombre: '' });
    };

    // const cantidadNum = Number(cantida) || 0;

  const agregarProducto = () => {
    if (!prendasL.nombre) return;

    const nuevoProducto: Producto = {
      code: (products.length + 1).toString(),
      id: prendasL.prendaId, // <-- Este debe contener el ID de la prenda seleccionada
      nombre: prendasL.nombre,
      talla:prendasL.talla,
      cantidad:prendasL.cantidad,
      cantidadExt:prendasL.cantidadExt,
      tallaId:prendasL.tallaId
    };
    console.log(prendasL);
    

    setProducts(prev => [...prev, nuevoProducto]);
    setPrendasL({ 
      prendaId:'',
      tallaId:'',
      nombre: '',
      talla:'',
      cantidad:'',
      cantidadExt:'',
      },
    );
  };

  const calcularCantidadTotal = (producto: Producto): number => {
    const cantidades = [producto.cantidad,producto.cantidadExt];
    return cantidades.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  };

  const crearProduccion = async () => {

  const produccion = {
    idModelo: datos.modelo,
    talleres: servicios.map((serv) => ({
      idResponsable: serv.code,
      prendas: (asignacionesPorTaller[serv.code] || []).map((p) => ({
        id: p.id,
        talla: p.talla,
        tallaId:p.tallaId,
        cantidad:p.cantidad,
        cantidadExt:p.cantidadExt,
        cantidadTotal: calcularCantidadTotal(p)
      })),
    })),
  };
  console.log('Producción enviada:', produccion);
  try {
    await axiosInstance.post('PostProduccion', produccion);
    console.log('Producción enviada:', produccion);

    //Limpiar estados
    setDatos({ modelo: '', idProduccion: '', fecha: '' });
    setProducts([]);
    setAsignacionesPorTaller({});
    setServicios([]);
    setPrendasL({
      prendaId: '',
      tallaId: '',
      nombre: '',
      talla:'',
      cantidad:'',
      cantidadExt:'',
    });
    ListaProduccion();
    // Redirigir
    router.push('/Principal');
  } catch (error) {
    console.error('Error al crear producción:', error);
  }
};

  return (
    <PrendasContext.Provider
      value={{
        mensaje,
        setMensaje,
        datos,
        setDatos,
        handleDropChange,
        prendasL,
        setPrendasL,
        products,
        setProducts,
        servicio,
        setServicio,
        agregarProducto,
        agregarServicio,
        asignacionesPorTaller,
        setAsignacionesPorTaller,
        servicios,
        setServicios,
        calcularCantidadTotal,
        crearProduccion,
        cantida,
        setCantida,
        handleChange
      }}
    >
      {children}
    </PrendasContext.Provider>
  );
};

export const usePrendaContext = () => {
  const context = useContext(PrendasContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
};
