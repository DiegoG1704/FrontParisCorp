'use client'

import DialogColor from '@/app/Components/DialogColor'
import DialogMaterial from '@/app/Components/DialogMaterial'
import axiosInstance from '@/app/Herramientas/axiosToken'
import { useAppContext } from '@/app/Provider/AppContext'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'

interface DatosFormularioPrenda {
  color: string
  genero: string
}

interface DatosFormulario {
  nombre: string
  idMaterial: string
  precioU: string
  precioM: string
  productos: Producto[]
}

interface Producto {
  code: string
  nombre: string
  color: string
  genero: string
  imagen?: File
  preview?: string
}

export default function Page() {
  const { color, material, ListaModelo,ListaPrenda } = useAppContext()
  const router = useRouter();
  const [openColor,setOpenColor]=useState(false)
  const [openMaterial,setOpenMaterial]=useState(false)
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [products, setProducts] = useState<Producto[]>([])
  const [datos, setDatos] = useState<DatosFormulario>({
    nombre: '',
    idMaterial: '',
    precioU: '',
    precioM: '',
    productos: []
  })

  const [prenda, setPrenda] = useState<DatosFormularioPrenda>({
    color: '',
    genero: '',
  })

  const generos = [
    { nombre: 'Varón', id: 'V' },
    { nombre: 'Mujer', id: 'M' },
  ]

  useEffect(() => {
    setDatos(prev => ({ ...prev, productos: products }))
  }, [products])

  const handleDropChange = (e: DropdownChangeEvent, field: keyof DatosFormulario) => {
    setDatos(prev => ({ ...prev, [field]: e.value.id }))
  }

  const handleDropChangeP = (e: DropdownChangeEvent, field: keyof DatosFormularioPrenda) => {
    setPrenda(prev => ({ ...prev, [field]: e.value.nombre }))
  }

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }


  const handleSudmit = async() => {
    const datosFinales = {
      nombre: datos.nombre,
      idMaterial: Number(datos.idMaterial),
      precioU: Number(datos.precioU),
      precioM: Number(datos.precioM),
      productos: products.map(prod => ({
        code: prod.code,
        nombre: prod.nombre,
        color: prod.color,
        genero: prod.genero,
        imagen:prod.imagen,
      }))
    };
    try {
      await axiosInstance.post('/postPrenda',datosFinales)
      router.push('/Principal/Page/Productos')
      ListaModelo()
      ListaPrenda()
      setDatos({
        nombre: '',
        idMaterial: '',
        precioU: '',
        precioM: '',
        productos: []
      })
      setProducts([])
    } catch (error) {
      console.log(error);
    }
  };



  const agregarProducto = () => {
    if (!datos.nombre || !datos.idMaterial || !prenda.color || !prenda.genero || !imagen) {
      alert('Completa todos los campos e imagen')
      return
    }

    const nuevoProducto: Producto = {
      code: (products.length + 1).toString(),
      nombre: `${datos.nombre}-${prenda.color}-${prenda.genero}`,
      color: prenda.color,
      genero: prenda.genero,
      imagen,
      preview: preview || ''
    }

    setProducts(prev => [...prev, nuevoProducto])
    setPrenda({ color: '', genero: '' })
    setImagen(null)
    setPreview(null)
  }


  const eliminarProducto = (code: string) => {
    setProducts(prev => prev.filter(p => p.code !== code))
  }

  const Acciones = (rowData: Producto) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
        tooltip="Eliminar"
        onClick={() => eliminarProducto(rowData.code)}
      />
    </div>
  )

  const subirImagen = (rowData: Producto) => (
    <div className="flex justify-center">
      {rowData.preview && (
        <img
          src={rowData.preview}
          alt="producto"
          className="w-16 h-16 object-cover rounded-md shadow"
        />
      )}
    </div>
  )


  return (
    <div className="flex flex-col p-10">
      <strong className='text-[40px] text-black'>Crear Productos</strong>
      <span className='text-[20px] text-black pt-4'>En este módulo podrás crear los productos y más...</span>

      <div className='mt-8 bg-white shadow-md rounded-lg'>
        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-6 p-6">
          <div className='flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Nombre de Modelo</label>
            <InputText
              name="modelo"
              placeholder="Nombre..."
              value={datos.nombre}
              onChange={(e) => setDatos(prev => ({ ...prev, nombre: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div className='flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Precio Unitario Min</label>
            <InputText
              name="precioU"
              placeholder="Precio mínimo"
              value={datos.precioU}
              onChange={(e) => setDatos(prev => ({ ...prev, precioU: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div className='flex flex-col'>
            <label className="text-[#4F9CD7] font-medium">Precio Mayor Max</label>
            <InputText
              name="precioM"
              placeholder="Precio máximo"
              value={datos.precioM}
              onChange={(e) => setDatos(prev => ({ ...prev, precioM: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-[#4F9CD7] font-medium">Material</label>
            <div>
              <Dropdown
                placeholder="Selecciona un material..."
                optionLabel="nombre"
                options={material}
                value={material.find((opt: { id: string; nombre: string }) => opt.id === datos.idMaterial)}
                onChange={(e) => handleDropChange(e, 'idMaterial')}
                className="w-full mt-1"
              />
              <Button 
                icon="pi pi-plus" 
                className='mt-1 ml-[-50] h-[46px] bg-[#BACD00] border-[#BACD00] text-white'
                onClick={()=>setOpenMaterial(true)}
              />
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-6 p-6">
          <div>
            <label className="text-[#4F9CD7] font-medium">Color</label>
            <div className='flex'>
              <Dropdown
                placeholder="Selecciona un color..."
                optionLabel="nombre"
                options={color}
                value={color.find((c: { id: string; nombre: string }) => c.nombre === prenda.color)}
                onChange={(e) => handleDropChangeP(e, 'color')}
                className="w-full mt-1"
              />
              <Button 
                icon="pi pi-plus" 
                className='mt-1 ml-[-50] h-[46px] bg-[#BACD00] border-[#BACD00] text-white'
                onClick={()=>setOpenColor(true)}
              />
            </div>
          </div>
          <div>
            <label className="text-[#4F9CD7] font-medium">Género</label>
            <Dropdown
              placeholder="Selecciona un género..."
              optionLabel="nombre"
              options={generos}
              value={generos.find(opt => opt.nombre === prenda.genero)}
              onChange={(e) => handleDropChangeP(e, 'genero')}
              className="w-full mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[#4F9CD7] font-medium">Imagen</label>
            <InputText
              type="file"
              accept="image/*"
              className="w-full mt-1"
              onChange={handleImagenChange}

            />
          </div>
          <div className="col-span-1">
            <Button
              label="Agregar"
              className="w-full h-[45px] bg-[#BACD00] border-[#BACD00] text-white"
              onClick={agregarProducto}
            />
          </div>
        </div>

        <div className='flex flex-col p-6'>
          <DataTable
            value={products}
            className="mt-6"
            paginator rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column field="code" header="ID" />
            <Column field="nombre" header="Prenda" />
            <Column field="color" header="Color" />
            <Column field="genero" header="Género" />
            <Column body={subirImagen} header="Foto" />
            <Column body={Acciones} header="Acciones" />
          </DataTable>
        </div>
        <div className='flex p-6 justify-end'>
          <Button
            label='Agregar Producto'
            icon="pi pi-plus"
            className="bg-[#BACD00] text-white border-[#BACD00]"
            onClick={handleSudmit}
          />
        </div>
      </div>
      <DialogColor Open={openColor} Close={()=>setOpenColor(false)}/>
      <DialogMaterial Open={openMaterial} Close={()=>setOpenMaterial(false)}/>
    </div>
  )
}
