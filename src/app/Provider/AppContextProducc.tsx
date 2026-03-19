// ProduccionProvider.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';
import axiosInstance from '../Herramientas/axiosToken';
import { useAppContext } from './AppContext';

// Tipado del contexto
interface AuthContextType {
  mensaje: string;
  setMensaje: (msg: string) => void;
  Produccion: (area: number, estado: number) => Promise<void>;
}

// Crear el contexto
const ProduccionContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const ProduccionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectPrenda,ListaProduccion } = useAppContext();
  const [mensaje, setMensaje] = useState('Hola desde NuevoProvider');


  const Produccion = async (area: number, estado: number) => {
    if (!selectPrenda?.idProduccion) {
        console.warn('No hay ID de producción seleccionado');
        return;
    }

    try {
        await axiosInstance.put(`EditarProduccion/${selectPrenda.idProduccion}`, {area, estado});
        ListaProduccion();
        console.log('Éxito al cambiar estado');
    } catch (error) {
        console.error('Error al cambiar estado', error);
    }
  };


  return (
    <ProduccionContext.Provider
      value={{
        mensaje,
        setMensaje,
        Produccion
      }}
    >
      {children}
    </ProduccionContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useProduccionContext = () => {
  const context = useContext(ProduccionContext);
  if (!context) {
    throw new Error('useProduccionContext debe usarse dentro de un ProduccionProvider');
  }
  return context;
};
