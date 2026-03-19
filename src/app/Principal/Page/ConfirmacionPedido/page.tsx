'use client'

import Image from 'next/image';
import { Divider } from 'primereact/divider';
import React, { useState } from 'react'
import productoImg from '../../../Imagen/guia-de-tallas.png'
import { Button } from 'primereact/button';
import DialogConfirmacion from './Components/DialogConfirmacion';
import { useAppContext } from '@/app/Provider/AppContext';

export default function page() {
  const[visible,setVisible]=useState(false)
  const {produccion,setSelectInforme}=useAppContext();

  const estadoArea: Record<number, { nombre: string; color: string; icon: string }> = {
    1: { nombre: 'Sin Iniciar', color: 'bg-gray-400', icon: 'pi pi-clock' },
    2: { nombre: 'Corte', color: 'bg-purple-500', icon: 'pi pi-scissors' },
    3: { nombre: 'Confección', color: 'bg-orange-500', icon: 'pi pi-pencil' },
    4: { nombre: 'Acabados', color: 'bg-blue-400', icon: 'pi pi-palette' },
    5: { nombre: 'Finalizado', color: 'bg-green-600', icon: 'pi pi-check-circle' },
  }

  return (
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <h1 className="text-[40px] text-[#4F9CD7] font-bold">Informes de Productos</h1>
      <p className="text-[18px] text-gray-700 mt-2">
        En este módulo se gestionan los informes y recolecciones de productos en las distintas sedes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {produccion.map((producto: any) => (
          <div
            key={producto.idProduccion}
            className="bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg p-5 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={productoImg}
                alt="Prenda"
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div>
                <p className="text-[1.3rem] font-bold text-[#4F9CD7]">
                  Nombre de Modelo:
                  {producto.nombreModelo}
                </p>
                <strong className='text-black'>{producto.codigoProduccion}</strong>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="text-gray-700 text-10 space-y-1">
              <div className="flex justify-between my-2">
                <span className="font-medium">Area Actual:</span>
                <strong
                    className={`text-white px-3 py-1 text-sm rounded-full ${estadoArea[Number(producto.area)]?.color || 'bg-gray-200'}`}
                  >
                    {estadoArea[Number(producto.area)]?.nombre || 'Desconocido'}
                  </strong>

              </div>
              <div className="flex justify-between my-2">
                <span className="font-medium">Inicio de produccion:</span>
                <strong>{producto.fecha}</strong>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="flex justify-end gap-2">
              <Button 
                label='Confirmar Recojo' 
                icon='pi pi-send'
                className="bg-purple-200 border-purple-200 text-purple-700 rounded-md hover:bg-purple-400"
                disabled={Number(producto.area) === 1 || Number(producto.area) === 5}
                onClick={() => {
                  setVisible(true);
                  setSelectInforme(producto);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <DialogConfirmacion Close={()=>setVisible(false)} Open={visible}/>
    </div>
  )
}
