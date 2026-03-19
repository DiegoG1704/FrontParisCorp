'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown} from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import DialogPrendas from './Components/DialogPrendas';
import { useAppContext } from '@/app/Provider/AppContext';
import { usePrendaContext } from '@/app/Provider/PrendasContext';
import axiosInstance from '@/app/Herramientas/axiosToken';

interface Servicios {
  code: string;
  nombre: string;
  encargado: string;
  cantidad: string;
}

interface Producto {
  id:string;
  code: string;
  nombre: string;
  talla:string;
  cantidad:string;
  cantidadExt:string;
}

export default function Page() {
  const { prenda, modelo, taller, talla } = useAppContext();
  const {datos,handleDropChange,servicios,setServicios,prendasL,setPrendasL,agregarServicio,crearProduccion,
    products,setProducts,servicio,setServicio,agregarProducto,asignacionesPorTaller,setAsignacionesPorTaller, handleChange}=usePrendaContext();

  const [tallerActivo, setTallerActivo] = useState<string>(''); // para saber a qué taller asignar
  const [prendas, setPrendas] = useState(false);
  const [models, setModels] = useState<any[]>([]);

  const eliminarProducto = (code: string) => {
    setProducts(prev => prev.filter(p => p.code !== code));
  };

  const eliminarServicio = (code: string) => {
    setServicios(prev => prev.filter(p => p.code !== code));
  };

  const Acciones = (rowData: Producto) => (
    <Button
      icon="pi pi-trash"
      className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200"
      tooltip="Eliminar"
      tooltipOptions={{ position: 'top' }}
      onClick={() => eliminarProducto(rowData.code)}
    />
  );

  const AccionesServ = (rowData: Servicios) => (
    <Button
      icon="pi pi-trash"
      className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200"
      tooltip="Eliminar"
      tooltipOptions={{ position: 'top' }}
      onClick={() => eliminarServicio(rowData.code)}
    />
  );

  const abrirDialogoPrendas = (tallerId: string) => {
    setTallerActivo(tallerId);
    setPrendas(true);
  };


  const ProductosServ = (rowData: Servicios) => (
    <Button
      icon="pi pi-objects-column"
      className="bg-indigo-100 border-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
      tooltip="Ver prendas"
      tooltipOptions={{ position: 'top' }}
      onClick={() => abrirDialogoPrendas(rowData.code)}
    />
  );

  const ListaPrendasModelo = async (idModelo: string) => {
    try {
      const response = await axiosInstance.get(
        `/getPrendaModelo/${idModelo}`
      );
      setModels(response.data);
    } catch (error) {
      console.error('Error al obtener prendas del modelo:', error);
    }
  };

  useEffect(() => {
    if (datos.modelo) {
      ListaPrendasModelo(datos.modelo);
      setPrendasL(prev => ({
        ...prev,
        prendaId: '',
        nombre: ''
      }));
    }
  }, [datos.modelo]);

  const calcularCantidadPorTaller = (tallerId: string): number => {
    const prendasAsignadas = asignacionesPorTaller[tallerId] || [];
    return prendasAsignadas.reduce((total, prenda) => {
      const suma = [prenda.cantidad,prenda.cantidadExt].reduce(
        (acc, val) => acc + (parseInt(val) || 0),
        0
      );
      return total + suma;
    }, 0);
  };

  return (
    <div className="flex flex-col px-10 py-8 bg-[#f9f9f9] min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800">Crear Producción</h1>
      <p className="text-lg text-gray-600 mt-2">
        Aquí podrás iniciar una producción seleccionando las prendas y más...
      </p>

      <div className="mt-8 bg-white shadow-md rounded-lg">
        {/* DATOS GENERALES */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[#4F9CD7] mb-4">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-[#4F9CD7] font-medium">Modelo</label>
              <Dropdown
                placeholder="Modelo..."
                optionLabel="nombre"
                options={modelo}
                value={modelo.find((opt: any) => opt.id === datos.modelo)}
                onChange={(e) => handleDropChange(e, 'modelo')}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        {/* PRENDAS */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[#4F9CD7] mb-4">Prendas a Producir</h2>
          <div className="flex flex-wrap gap-4 md:gap-6 items-end">
            <div className="flex flex-col w-full sm:w-[48%] md:w-[250px]">
              <label className="text-[#4F9CD7] font-medium">Prenda</label>
             <Dropdown
                placeholder="Prendas..."
                optionLabel="nombre"
                options={models}
                value={models.find((p: any) => p.id === prendasL.prendaId)}
                onChange={(e) =>
                  setPrendasL(prev => ({
                    ...prev,
                    prendaId: e.value.id,
                    nombre: e.value.nombre
                  }))
                }
                className="w-full mt-1"
                filter
              />
            </div>

            <div className="flex flex-col w-full sm:w-[48%] md:w-[250px]">
              <label className="text-[#4F9CD7] font-medium">Tallas</label>
              <Dropdown
                placeholder="Tallas..."
                optionLabel="nombre"
                options={talla}
                value={talla.find((c: any) => c.nombre === prendasL.talla)}
                onChange={(e) =>
                  setPrendasL(prev => ({
                    ...prev,
                    tallaId: e.value.id, // ✅ este es el cambio clave
                    talla: e.value.nombre
                  }))
                }
                className="w-full mt-1"
                filter
              />

            </div>
            <div>
              <label className="text-[#4F9CD7] font-medium">Cantidad</label>
              <InputText 
              className="w-full mt-1" 
              value={prendasL.cantidad}
              name='cantidad'
              onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-[#4F9CD7] font-medium">Cantidad adicional</label>
              <InputText 
              className="w-full mt-1" 
              tooltip="Cantidad adicional que se sumará a las tallas para cubrir posibles mermas"
              tooltipOptions={{position:'top'}}
              name='cantidadExt'
              value={prendasL.cantidadExt}
              onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <Button
                label="Agregar"
                className="w-full bg-[#BACD00] border-[#BACD00] text-white"
                onClick={agregarProducto}
              />
            </div>
          </div>
          <DataTable value={products} className="mt-6" paginator rows={5}>
            <Column field="code" header="ID" />
            <Column field="nombre" header="Nombre de Prenda" />
            <Column field="talla" header="Talla" />
            <Column field="cantidad" header="Cantidad" />
            <Column field="cantidadExt" header="Cantidad Extra" />
            <Column body={Acciones} header="Acciones" />
          </DataTable>
        </div>

        {/* SERVICIOS */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[#4F9CD7] mb-4">Servicios de Confección</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="text-[#4F9CD7] font-medium">Responsable</label>
              <Dropdown
                placeholder="Responsable..."
                optionLabel="nombre_taller"
                options={taller}
                value={taller.find((opt: any) => opt.id === servicio.nombre)}
                onChange={(e) => setServicio({ nombre: e.value.id })}
                className="w-full mt-1"
              />
            </div>
            <div className="col-span-1">
              <Button
                label="Agregar"
                className="w-full h-[42px] bg-[#BACD00] border-[#BACD00] text-white"
                onClick={agregarServicio}
              />
            </div>
          </div>

          <DataTable value={servicios} className="mt-6" paginator rows={5}>
            <Column field="code" header="ID" />
            <Column field="nombre" header="Nombre" />
            <Column field="encargado" header="Encargado" />
            <Column
              header="Cantidad prevista"
              body={(rowData: Servicios) => calcularCantidadPorTaller(rowData.code)}
            />
            <Column body={ProductosServ} header="Prendas asignadas" />
            <Column body={AccionesServ} header="Acciones" />
          </DataTable>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          label="Crear Producción"
          className="w-[250px] bg-[#BACD00] border-[#BACD00] text-white"
          onClick={crearProduccion}
        />
      </div>

      <DialogPrendas
        Open={prendas}
        Close={() => setPrendas(false)}
        TallerId={tallerActivo}
        onAsignar={(id, nuevasPrendas) => {
          setAsignacionesPorTaller(prev => ({
            ...prev,
            [id]: nuevasPrendas,
          }));
        }}
      />
    </div>
  );
}