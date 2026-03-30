'use client'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/app/Provider/AppContext'
import axiosInstance from '@/app/Herramientas/axiosToken'
import { Tag } from 'primereact/tag'

interface Props {
  Open: boolean
  Close: () => void
}

interface Prenda {
  idUsuario: number
  idDetallePrenda: number
  cantidad: number
  cantMerma: number
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
  idInforme:number | null
}

export default function DialogConfirmacion({ Close, Open }: Props) {
  const { usuario,prendasConf,ListaPrendasConfirmacion,selectInforme,ListaProduccion,ListaPrenda} = useAppContext()
  const user = usuario?.datosUsuario;
  // Estado para capturar las cantidades ingresadas por prenda y talla
  const [cantidades, setCantidades] = useState<Record<number, string>>({})
  const [cantMerma, setCantMerma] = useState<Record<number, string>>({})

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Informe de pedido
      </p>
    </div>
  )

  useEffect(() => {
    const nuevasCantidades: Record<number, string> = {}
    const nuevasMermas: Record<number, string> = {}

    prendasConf.forEach((p: any) => {
      nuevasCantidades[p.idDetalle] =
        p.cantInfor !== null && p.cantInfor !== undefined
          ? String(p.cantInfor)
          : '0'

      nuevasMermas[p.idDetalle] =
        p.cantMerma !== null && p.cantMerma !== undefined
          ? String(p.cantMerma)
          : '0'
    })

    setCantidades(nuevasCantidades)
    setCantMerma(nuevasMermas)
  }, [prendasConf])

  const handleGuardarPrenda = async (producto: InfomPrenda) => {
    const informe: Prenda = {
      idUsuario: Number(user.id),
      idDetallePrenda: Number(producto.id),
      cantidad: Number(cantidades[producto.idDetalle] ?? 0),
      cantMerma: Number(cantMerma[producto.idDetalle] ?? 0)
    }

    try {
      await axiosInstance.put(`EditarInforme/${producto.idInforme}`, informe)
      ListaPrendasConfirmacion()
      console.log('Informe subido correctamente')
    } catch (error) {
      console.error(error)
    }
  }

  const isInformeCompleto = prendasConf.every((p:any) =>
    p.cantInfor !== null &&
    p.cantMerma !== null
  )

  const estadoArea: Record<number, { nombre: string }> = {
  1: { nombre: 'Sin Iniciar' },
  2: { nombre: 'Corte' },
  3: { nombre: 'Confección' },
  4: { nombre: 'Acabados' },
  5: { nombre: 'Finalizado' }
}


  const getNextArea = (areaActual: string | number): number => {
    const areaNum = Number(areaActual)

    const maxArea = Math.max(...Object.keys(estadoArea).map(Number))

    if (areaNum >= maxArea) {
      return areaNum // ya está en la última área
    }

    return areaNum + 1
  }

  const handleSubirInforme = async () => {
    if (!selectInforme) return

    const prendas ={
      prendasInfo: prendasConf.map((p:any)=>({
        id:Number(p.id),
        cantidadTotal:Number(p.cantInfor),
        merma:Number(p.cantMerma),
        idTalla: p.tallaId,
        idPrenda:p.idPrenda
      }))
    }
    console.log('Informe(s) Subido(s)',prendas.prendasInfo)

    const nextArea = getNextArea(Number(selectInforme.area))
    console.log('next', nextArea);
    

    try {
      await axiosInstance.post(
        `PostInformePrenda/${selectInforme.idProduccion}/${nextArea}`,prendas
      )

      console.log('Informe(s) Subido(s)',prendas)
      ListaProduccion()
      ListaPrenda()
      Close()
    } catch (error) {
      console.error('Error al subir el informe:', error)
    }
  }


  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[40rem]">
      <div className="space-y-6">

        {/* Personal */}
        <div className="flex flex-col gap-2">
          <label htmlFor="personal" className="font-semibold text-sm text-gray-700">
            Nombre del Personal Responsable
          </label>
          <InputText
            id="personal"
            value={user?.nombres || 'Usuario'}
            placeholder="Ej. Juan Pérez"
            disabled
          />
        </div>

        {/* Lista de productos */}
        <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto pr-1">
          {prendasConf.map((producto: InfomPrenda) => (
            <div key={producto.id} className="border rounded-md p-4 bg-white shadow-sm space-y-3">
              {/* Cabecera */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{producto.nombrePrenda}</p>
                  <p className="text-sm text-gray-600">{producto.nombreTaller}</p>
                  <p className="text-xs text-gray-400">{producto.direccion}</p>
                </div>
                <Tag
                  value={producto.estadoinforme === '1' ? "Pendiente" : "Confirmado"}
                  severity={producto.estadoinforme === '1' ? "warning" : "success"}
                />
              </div> 

              {/* Cantidades por talla */}
              <div className="grid text-sm">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="flex justify-between p-2">
                      <label className="text-lg text-gray-500 mb-1">
                        Cantidad recibida de Talla {producto.talla}
                      </label>
                      <div className="flex items-center">
                        <InputText
                          className="w-16 text-center"
                          placeholder="0"
                          value={cantidades[producto.idDetalle] || ''}
                          onChange={(e) =>
                            setCantidades({
                              ...cantidades,
                              [producto.idDetalle]: e.target.value
                            })
                          }
                        />
                        <span className="text-gray-400 text-lg ml-2">
                          / {producto.cantidadTotal}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between p-2">
                      <label className="text-lg  text-gray-500 mb-1">
                        Cantidad de Merma
                      </label>
                      <div className="flex items-center">
                        <InputText
                          className="w-16 text-center"
                          placeholder="0"
                          value={cantMerma[producto.idDetalle] || ''}
                          onChange={(e) =>
                            setCantMerma({
                              ...cantMerma,
                              [producto.idDetalle]: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                    label="Guardar"
                    icon="pi pi-save"
                    className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                    onClick={() => handleGuardarPrenda(producto)}
                  />
                  </div>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de subir */}
        <div className="flex justify-end">
          <Button
            label="Subir Informe"
            icon="pi pi-upload"
            disabled={!isInformeCompleto}
            className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
            onClick={handleSubirInforme}
          />

        </div>
      </div>
    </Dialog>
  )
}
