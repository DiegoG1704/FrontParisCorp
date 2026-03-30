'use client'

import { Dialog } from 'primereact/dialog'
import Image from 'next/image'
import React from 'react'
import { Divider } from 'primereact/divider'
import productoImg from '../../../../Imagen/producto.jpg'
import { useAppContext } from '@/app/Provider/AppContext'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogProductos({ Close, Open }: Props) {
  const {modeloPred}=useAppContext()
  
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Productos del modelo
      </p>
    </div>
  )

  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[60rem]">
      {modeloPred && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {modeloPred.map((producto: any) => (
            <div
              key={producto.id}
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
                  <p className="text-lg font-bold text-[#4F9CD7]">
                    {producto.nombre}
                  </p>
                </div>
              </div>

              <Divider className="my-2" />

              <div className="text-gray-700 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Color:</span>
                  <strong>{producto.color}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Género:</span>
                  <strong>{producto.genero}</strong>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium mb-2">Tallas:</span>
                  <div className="flex flex-col gap-2">
                    {producto.tallas.map((talla: any) => (
                      <div
                        key={talla.id}
                        className="flex justify-between items-center border border-gray-200 rounded-md"
                      >
                        <span className="text-[#12C447] bg-[#e6fbe9] border border-[#12C447] px-3 py-1 text-sm rounded-full">
                          {talla.nombre}
                        </span>
                        <strong className="text-sm text-gray-700">{talla.cantidad}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  )
}
