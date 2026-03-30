'use client'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import axiosInstance from '../Herramientas/axiosToken'
import { useAppContext } from '../Provider/AppContext'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

interface Props {
  Open: boolean
  Close: () => void
}

export default function DialogCliente({ Close, Open }: Props) {
  const { ListaClientes } = useAppContext()
  const toast = useRef<Toast>(null)

  const opciones = [
    { id: 1, nombre: 'DNI' },
    { id: 2, nombre: 'RUC' }
  ]

  const [datos, setDatos] = useState<any>({
    tipodocumento: null,
    documento: '',
    nombre: '',
    direccion: '',
    telefono: ''
  })

  const handleSelect = (field: 'tipodocumento', value: any) => {
    setDatos({ ...datos, [field]: value })
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setDatos({
      ...datos,
      [name]: value
    })
  }

  const validarCampos = () => {
    if (!datos.tipodocumento) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Seleccione el tipo de documento',
        life: 3000
      })
      return false
    }

    if (!datos.documento.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Ingrese el documento',
        life: 3000
      })
      return false
    }

    if (datos.tipodocumento.id === 1 && datos.documento.length !== 8) {
      toast.current?.show({
        severity: 'warn',
        summary: 'DNI inválido',
        detail: 'El DNI debe tener 8 dígitos',
        life: 3000
      })
      return false
    }

    if (datos.tipodocumento.id === 2 && datos.documento.length !== 11) {
      toast.current?.show({
        severity: 'warn',
        summary: 'RUC inválido',
        detail: 'El RUC debe tener 11 dígitos',
        life: 3000
      })
      return false
    }

    if (!datos.nombre.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Ingrese el nombre',
        life: 3000
      })
      return false
    }

    if (!datos.telefono.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Ingrese el teléfono',
        life: 3000
      })
      return false
    }

    if (datos.telefono.length < 9) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Teléfono inválido',
        detail: 'El teléfono debe tener al menos 9 dígitos',
        life: 3000
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {

    if (!validarCampos()) return

    const nuevoCliente = {
      tipodocumento: datos.tipodocumento.id,
      documento: datos.documento,
      nombre: datos.nombre,
      direccion: datos.direccion,
      telefono: datos.telefono
    }

    try {

      await axiosInstance.post('PostCliente', nuevoCliente)

      toast.current?.show({
        severity: 'success',
        summary: 'Cliente agregado',
        detail: 'El cliente fue registrado correctamente',
        life: 3000
      })

      setDatos({
        tipodocumento: null,
        documento: '',
        nombre: '',
        direccion: '',
        telefono: ''
      })

      ListaClientes()
      Close()

    } catch (error: any) {

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Error al registrar cliente',
        life: 4000
      })

      console.log('Error', error)
    }
  }

  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        Agregar Cliente
      </p>
    </div>
  )

  return (
    <>
      <Toast ref={toast} />

      <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[25rem]">

        <div className='flex flex-col mt-4'>
          <label className="text-[#4F9CD7] font-medium">Tipo de Documento</label>
          <Dropdown
            placeholder='Seleccione tipo de documento...'
            options={opciones}
            optionLabel='nombre'
            value={datos.tipodocumento}
            onChange={(e) => handleSelect('tipodocumento', e.value)}
          />
        </div>

        <div className='flex flex-col mt-4'>
          <label className="text-[#4F9CD7] font-medium">Documento</label>
          <InputText
            name="documento"
            placeholder="Ingrese documento..."
            className="w-full mt-1"
            value={datos.documento}
            onChange={handleChange}
          />
        </div>

        <div className='flex flex-col mt-4'>
          <label className="text-[#4F9CD7] font-medium">Nombre Completo</label>
          <InputText
            name="nombre"
            placeholder="Ingrese nombre..."
            className="w-full mt-1"
            value={datos.nombre}
            onChange={handleChange}
          />
        </div>

        <div className='flex flex-col mt-4'>
          <label className="text-[#4F9CD7] font-medium">Direccion</label>
          <InputText
            name="direccion"
            placeholder="Ingrese direccion..."
            className="w-full mt-1"
            value={datos.direccion}
            onChange={handleChange}
          />
        </div>

        <div className='flex flex-col mt-4'>
          <label className="text-[#4F9CD7] font-medium">Telefono</label>
          <InputText
            name="telefono"
            placeholder="Ingrese telefono..."
            className="w-full mt-1"
            value={datos.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={Close} label="Cancelar" className="p-button-text" />
          <Button onClick={handleSubmit} label="Eliminar" severity="danger" />
        </div>

      </Dialog>
    </>
  )
}