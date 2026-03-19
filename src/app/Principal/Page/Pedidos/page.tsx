'use client'

import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useAppContext } from '@/app/Provider/AppContext'
import DialogCliente from '@/app/Components/DialogCliente'
import axiosInstance from '@/app/Herramientas/axiosToken'

interface Option {
  name: string
  id: number
}

interface ProductoSeleccionado {
  idProduccion: number
  idDetalle: number
  idTalla: number
  idPrenda: number
  nombre: string
  nombreCompleto: string
  talla: string
  cantidad: number
  precioU: number
}

interface TallaSeleccionada {
  id: number
  nombre: string
}

interface ProductoAgregado {
  index: number
  idPrenda: number
  idProduccion: number
  idTalla: number
  talla: string
  Producto: string
  Cantidad: number
  Precio: number
  Subtotal: number
}

export default function Page() {
  const [pago, setPago] = useState<Option>(null)
  const {clientes,usuario,preVenta,ListaPedidos,ListaPrenda}=useAppContext()
  const user = usuario?.datosUsuario;
  const tipoPago: Option[] = [
      { name: 'Efectivo', id: 1 },
      { name: 'Tarjeta', id: 2 },
      { name: 'Aplicativo', id: 3 },
    ]
  const [visible,setVisible]=useState(false)
  const [productosAgregados, setProductosAgregados] = useState<ProductoAgregado[]>([])
  const [datos, setDatos] = useState<{
    Cantidad: string
    Producto: ProductoSeleccionado | null
    Talla: TallaSeleccionada | null
  }>({
    Cantidad: '',
    Producto: null,
    Talla: null,
  })

  

  const [cliente, setCliente] = useState({ nombre: '', direccion: '', telefono: '' })
  const [envio, setEnvio] = useState<number>(0)

  const handleSelect = (field: 'Producto' | 'Talla', value: any) => {
    setDatos({ ...datos, [field]: value })
  }

  const handleSelectCliente = (field: 'nombre', value: any) => {
    setCliente({ ...cliente, [field]: value })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  const handleAgregarPedido = async() =>{
    const clientePedido = {
      idCliente: cliente.nombre.id,
      idUsuario: user.id,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      tipoPago: pago.id,
      tipoVenta: 3,
      total: total,
      productos: productosAgregados.map((p) => ({
        idPrenda: p.idPrenda,
        talla: p.talla,
        cantidad: p.Cantidad,
        idTalla: p.idTalla,
        idProduccion:p.idProduccion
      }))
    }

    try {
      await axiosInstance.post('/postVenta',clientePedido)
      console.log('exito al crear venta');
      console.log('productos agregados:',productosAgregados);
      
      console.log('productos',clientePedido);
      ListaPrenda()
      ListaPedidos()
      setProductosAgregados([])
      setCliente({ nombre: null, direccion: '', telefono: '' })
      setPago(null)
      setEnvio(0)
    } catch (error) {
      console.log('Error al crear venta',error);
    }
  }

  const handleAgregarProducto = () => {
    if (!datos.Producto || !datos.Cantidad) return

    const nuevoProducto: ProductoAgregado = {
      index: productosAgregados.length + 1,
      idPrenda: datos.Producto.idPrenda,
      idTalla: datos.Producto.idTalla,
      idProduccion: datos.Producto.idProduccion,
      talla: datos.Producto.talla,
      Producto: datos.Producto.nombreCompleto,
      Cantidad: Number(datos.Cantidad),
      Precio: datos.Producto.precioU ?? 0,
      Subtotal: Number(datos.Cantidad) * (datos.Producto.precioU ?? 0),
    }

    console.log('nuevo',nuevoProducto);
    setProductosAgregados([...productosAgregados, nuevoProducto])

    setDatos({
      Cantidad: '',
      Producto: null,
      Talla: null,
    })
  }

  const eliminarProducto = (idProducto: number) => {
    setProductosAgregados(productosAgregados.filter((p) => p.index !== idProducto))
  }

  const handleModificarCantidad = (idProducto: number, cantidad: number) => {
    const productosActualizados = productosAgregados.map((producto) => {
      if (producto.index=== idProducto) {
        return { ...producto, Cantidad: cantidad, Subtotal: cantidad * producto.Precio }
      }
      return producto
    })
    setProductosAgregados(productosActualizados)
  }

  const cantidadEditor = (row: any) => (
    <InputText
      type="number"
      value={row.Cantidad}
      onChange={(e) => handleModificarCantidad(row.index, Number(e.target.value))}
      className="w-full"
    />
  )

  const subtotal = productosAgregados.reduce(
    (sum, p) => sum + p.Subtotal,
    0
  )
  const igv = subtotal * 0.18
  const total = subtotal + igv
  const cambio = envio - total

  return (
    <div className="flex flex-col p-10 bg-gray-50 min-h-screen">
      <strong className="text-[40px] text-[#4F9CD7]">Preventas</strong>
      <span className="text-[20px] text-black pt-2">
        En este módulo se registran los pedidos con entrega y costo de envíos
      </span>
      <div className="bg-white rounded-lg shadow-md mt-6">
        {/* TIPO DE VENTA */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#4F9CD7] mb-4">Informacion de Venta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <InputText
              name="nombre"
              value={user?.nombres}
              className="w-full"
              disabled
            />
          </div>
        </div>

        {/* DATOS DEL CLIENTE */}
        <div className="p-6 pt-0">
          <h2 className="text-xl font-bold text-[#4F9CD7] mb-4">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <Dropdown
                placeholder="Seleccione cliente..."
                value={cliente.nombre}
                options={clientes}
                optionLabel="nombre"
                onChange={(e) => handleSelectCliente('nombre', e.value)}
                className="w-full"
                filter
              />
              <Button 
                icon="pi pi-plus" 
                className='mt-1 ml-[-50] h-[46px] bg-[#BACD00] border-[#BACD00] text-white'
                onClick={()=>setVisible(true)}
              />
            </div>
            
            <InputText placeholder="Dirección de entrega" value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} />
            <InputText placeholder="Teléfono" value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="p-6 pt-0">
          <h2 className="text-xl font-bold text-[#4F9CD7] mb-4">Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-4">
            <Dropdown
              placeholder="Seleccione producto..."
              value={datos.Producto}
              options={preVenta}
              optionLabel="nombreCompleto"
              onChange={(e) => handleSelect('Producto', e.value)}
              className="w-full"
              filter
            />
            <InputText
              type="number"
              name="Cantidad"
              value={datos.Cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              className="w-full"
            />
            <Button
              label="Agregar"
              icon="pi pi-plus"
              onClick={handleAgregarProducto}
              className="w-full h-[42px] bg-[#BACD00] border-[#BACD00] text-white"
            />
          </div>

          <DataTable
            value={productosAgregados}
            editMode="cell"
            paginator rows={5}
            emptyMessage="No hay productos agregados."
          >
            <Column header='#' field='index'/>
            <Column field="Producto" header="Producto" />
            <Column header="Cantidad" body={(row) => cantidadEditor(row)} style={{ width: '150px' }} />
            <Column field="Precio" header="Precio Unit." body={(row) => `S/${row.Precio.toFixed(2)}`} />
            <Column field="Subtotal" header="Subtotal" body={(row) => `S/${row.Subtotal.toFixed(2)}`} />
            <Column
              header="Acciones"
              body={(row) => (
                <Button
                  icon="pi pi-trash"
                  className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
                  onClick={() => eliminarProducto(row.index)}
                />
              )}
            />
          </DataTable>
        </div>

        {/* DETALLES DE PAGO Y ENVÍO */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#4F9CD7] mb-4">Pagos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <Dropdown
                placeholder="Tipo de pago"
                value={pago}
                onChange={(e) => setPago(e.value)}
                options={tipoPago}
                optionLabel="name"
                className="w-full"
            />
            {pago?.id === 1 && (
              <InputText
                  type="number"
                  value={envio.toString()}
                  onChange={(e) => setEnvio(Number(e.target.value))}
                  placeholder="Costo de envío"
                  className="w-full"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-lg font-medium">
            <div className="text-black">SubTotal: <span className="text-gray-800">S/{subtotal.toFixed(2)}</span></div>
            <div className="text-black">IGV (18%): <span className="text-gray-800">S/{igv.toFixed(2)}</span></div>
            <div className="text-black">Total: <span className="text-[#12C447] font-bold">S/{total.toFixed(2)}</span></div>
            {/* <div className="text-black">Monto: <span className="text-gray-800">S/{envio.toFixed(2)}</span></div> */}
            {pago?.id === 1 && (
              <div className="text-black">Cambio: <span className="text-gray-800">S/{cambio.toFixed(2)}</span></div>
            )}
          </div>

          <div className="mt-6">
            <Button
              label="Registrar Pedido"
              icon="pi pi-check"
              className="w-full bg-[#4F9CD7] border-[#4F9CD7] text-white"
              disabled={productosAgregados.length === 0}
              onClick={handleAgregarPedido}
            />
          </div>
        </div>
      </div>
      <DialogCliente Open={visible} Close={()=>setVisible(false)}/>
    </div>
  )
}
