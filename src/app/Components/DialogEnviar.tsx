'use client'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useRef, useState } from 'react'
import axiosInstance from '../Herramientas/axiosToken'
import { useAppContext } from '../Provider/AppContext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogEnviar({ Close, Open}: Props) {
  const { personal, usuario } = useAppContext()
  const [respuesta, setRespuesta] = useState('')
  const [remitente, setRemitente] = useState<any>(null)
  const [titulo, setTitulo] = useState('')

  const toast = useRef<Toast>(null)

  const user = usuario?.datosUsuario

  const handleSubmit = async () => {
    if (!remitente || !respuesta.trim() || !titulo.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Completa todos los campos',
        life: 3000
      })
      return
    }

    try {
      await axiosInstance.post(`PostNotificaciones/${remitente.id}`, {
        mensaje: respuesta,
        titulo: titulo,
        userId: user?.id
      })

      toast.current?.show({
        severity: 'success',
        summary: 'Enviado',
        detail: 'Mensaje enviado correctamente',
        life: 3000
      })

      setRemitente(null)
      setRespuesta('')
      setTitulo('')
      Close()

    } catch (error) {
      console.log('Error', error)

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo enviar el mensaje',
        life: 3000
      })
    }
  }

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Enviar Mensaje
      </p>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />

      <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[25rem]">
        <div className="flex flex-col gap-3">

          <span>Compañeros de trabajo</span>
          <Dropdown
            options={personal}
            optionLabel="nombre_rol"
            placeholder="Selecciona..."
            value={remitente}
            onChange={(e) => setRemitente(e.value)}
          />

          <span>Titulo o Asunto</span>
          <InputText
            placeholder="Ingrese ..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <span className="text-lg">Respuesta</span>
          <InputTextarea
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            rows={3}
            placeholder="Escribe una respuesta..."
          />

          <div className="flex justify-end mt-5">
            <Button
              className="m-2"
              label="Cancelar"
              icon="pi pi-times"
              onClick={Close}
            />
            <Button
              className="m-2"
              label="Enviar"
              icon="pi pi-send"
              onClick={handleSubmit}
            />
          </div>

        </div>
      </Dialog>
    </>
  )
}