'use client'

import React, { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useAppContext } from '@/app/Provider/AppContext'
import axiosInstance from '@/app/Herramientas/axiosToken'
import DialogCliente from '@/app/Components/DialogCliente'
import { Toast } from 'primereact/toast'

interface Option {
  name: string
  id: number
}

interface Producto {
  value: number   // ID
  label: string   // Nombre
  precio: number  // Precio unitario
}

interface Option {
  name: string
  id: number
}
export default function Page() {
  const {usuario,clientes,prenda,talla,ListaPrenda,ListaPedidos} = useAppContext()
  const user = usuario?.datosUsuario;
  const isDark = user?.estadoModo !== "1";
  const [ventaTipo, setVentaTipo] = useState<Option | null>(null)
  const [visible,setVisible]=useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)
  const toast = useRef<Toast>(null)
  const tipoVenta: Option[] = [
      { name: 'Venta Pedido', id: 1 },
      { name: 'Venta Local', id: 2 },
    ]
  const [cliente, setCliente] = useState({ nombre: '', direccion: '', telefono: '' })

  const tipoPago: Option[] = [
    { name: 'Efectivo', id: 1 },
    { name: 'Tarjeta', id: 2 },
    { name: 'Transferencia', id: 3 },
  ]

  const tipoDocumento: Option[] = [
    { name: 'Boleta', id: 1},
    { name: 'Factura', id: 2 },
  ]

  const [productosAgregados, setProductosAgregados] = useState<any[]>([])
  const [datos, setDatos] = useState({
    Cantidad: '',
    Producto: null,
    Talla: null,
  })

  const [pago, setPago] = useState<Option | null>(null)
  const [documento, setDocumento] = useState<Option | null>(null)

  const handleSelect = (field: string, value: string) => {
    setDatos({ ...datos, [field]: value })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  const handleAgregarProducto = () => {
    if (!datos.Producto || !datos.Talla || !datos.Cantidad) {

      toast.current?.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Debe seleccionar producto, talla y cantidad',
        life: 3000
      })
      return
    }

    // if (datos.Producto.stock < Number(datos.Cantidad)) {
    //   toast.current?.show({
    //     severity: 'error',
    //     summary: 'Stock insuficiente',
    //     detail: `Solo hay ${datos.Producto.stock} unidades disponibles`,
    //     life: 3000
    //   })
    //   return
    // }

    const nuevoProducto = {
      index: productosAgregados.length + 1,
      idProducto: datos.Producto.id,
      Producto: datos.Producto.nombre,
      Cantidad: Number(datos.Cantidad),
      talla: datos.Talla.nombre,
      idTalla: datos.Talla.id,
      Precio: datos.Producto.precioU ?? 0,
      Subtotal: Number(datos.Cantidad) * (datos.Producto.precioU ?? 0),
    }

    setProductosAgregados([...productosAgregados, nuevoProducto])

    toast.current?.show({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${datos.Producto.nombre} agregado a la venta`,
      life: 2000
    })

    setDatos({
      Cantidad: '',
      Producto: null,
      Talla: null,
    })
  }

  const handleSudmit = async () => {
  const ordenPedido = {
    idCliente: clienteSeleccionado?.id,
    idUsuario: user.id,
    direccion: cliente.direccion,
    telefono: cliente.telefono,
    tipoPago: documento?.id,
    tipoVenta: ventaTipo?.id,
    total: total.toFixed(2),
    productos: productosAgregados.map((p) => ({
      idPrenda: p.idProducto,
      idTalla: p.idTalla,
      cantidad: p.Cantidad
    }))
  }

  if (ventaTipo?.id === 1 && !clienteSeleccionado) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Cliente requerido',
      detail: 'Debe seleccionar un cliente para venta por pedido',
      life: 3000
    })
    return
  }

  if (productosAgregados.length === 0) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Sin productos',
      detail: 'Debe agregar al menos un producto',
      life: 3000
    })
    return
  }

  try {
    await axiosInstance.post('/postVenta', ordenPedido)

    toast.current?.show({
      severity: 'success',
      summary: 'Venta registrada',
      detail: 'La venta se registró correctamente',
      life: 3000
    })

    ListaPrenda()
    ListaPedidos()

    setProductosAgregados([])
    setCliente({ nombre: '', direccion: '', telefono: '' })
    setDocumento(null)
    setVentaTipo(null)

  } catch (error) {

    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo registrar la venta',
      life: 3000
    })

    console.log('Error al crear venta', error)
  }
}
  const eliminarProducto = (idProducto: number) => {
  setProductosAgregados(productosAgregados.filter((p) => p.idProducto !== idProducto))

  toast.current?.show({
    severity: 'info',
    summary: 'Producto eliminado',
    detail: 'El producto fue eliminado de la venta',
    life: 2000
  })
}

  const handleModificarCantidad = (idProducto: number, cantidad: number) => {
    const productosActualizados = productosAgregados.map((producto) => {
      if (producto.idProducto === idProducto) {
        return { ...producto, Cantidad: cantidad, Subtotal: cantidad * producto.Precio }
      }
      return producto
    })
    setProductosAgregados(productosActualizados)
  }

  const cantidadEditor = (row: any) => {
    return (
      <InputText
        type="number"
        value={row.Cantidad}
        onChange={(e) => handleModificarCantidad(row.idProducto, Number(e.target.value))}
        className="w-full"
      />
    )
  }

  useEffect(() => {
  if (ventaTipo?.id !== 1) {
    setClienteSeleccionado('')
    setCliente({
      nombre: '',
      direccion: '',
      telefono: '',
    });
  }
}, [ventaTipo]);


  const subtotal = productosAgregados.reduce((sum, p) => sum + p.Subtotal, 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv

  return (
    <div className={`flex flex-col p-10 min-h-screen ${isDark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"}`}>
      <Toast ref={toast} />

      <strong className={`text-[40px] text-[#4F9CD7]`}>Interfaz de Ventas</strong>
      <span className={`text-[20px] pt-2 ${isDark ? "text-gray-300" : "text-black"}`}>
        En este módulo usted podrá realizar las ventas
      </span>

      <div className={`rounded-lg shadow-md mt-6 ${isDark ? "bg-[#1E293B] border border-gray-700" : "bg-white"}`}>
        {/* DATOS PRODUCTOS */}
        <div className="p-6 pt-0">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-[#4F9CD7]" : "text-[#4F9CD7]"}`}>Datos de Venta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <InputText
              name="nombre"
              value={user?.nombres}
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
              disabled
            />
            <Dropdown
              placeholder="Tipo de venta"
              value={ventaTipo}
              onChange={(e) => setVentaTipo(e.value)}
              options={tipoVenta}
              optionLabel="name"
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
            />
          </div>
        </div>

        {/* DATOS DEL CLIENTE */}
        {ventaTipo?.id === 1 && (
          <div className="p-6 pt-0">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-[#4F9CD7]" : "text-[#4F9CD7]"}`}>Datos del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <Dropdown
                  placeholder="Seleccione cliente..."
                  value={clienteSeleccionado}
                  options={clientes}
                  optionLabel="nombre"
                  onChange={(e) => setClienteSeleccionado(e.value)}
                  className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
                  filter
                />
                <Button
                  icon="pi pi-plus"
                  className="mt-1 ml-[-50] h-[46px] bg-[#BACD00] border-[#BACD00] text-white"
                  onClick={() => setVisible(true)}
                />
              </div>

              <InputText
                placeholder="Dirección de entrega"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
              />
              <InputText
                placeholder="Teléfono"
                value={cliente.telefono}
                onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
              />
            </div>
          </div>
        )}

        {/* DATOS PRODUCTOS */}
        <div className="p-6 pt-0">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-[#4F9CD7]" : "text-[#4F9CD7]"}`}>Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-4">
            <Dropdown
              placeholder="Seleccione producto..."
              value={datos.Producto}
              options={prenda}
              optionLabel="nombre"
              onChange={(e) => handleSelect('Producto', e.value)}
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
              filter
            />
            <Dropdown
              placeholder="Seleccione talla..."
              value={datos.Talla}
              options={talla}
              optionLabel="nombre"
              onChange={(e) => handleSelect('Talla', e.value)}
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
              filter
            />
            <InputText
              type="number"
              name="Cantidad"
              value={datos.Cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
            />
            <Button
              label="Agregar"
              icon="pi pi-plus"
              onClick={handleAgregarProducto}
              className="w-full h-[42px] bg-[#BACD00] border-[#BACD00] text-white"
            />
          </div>

          {/* Tabla editable */}
          <DataTable
            value={productosAgregados}
            editMode="cell"
            dataKey="index"
            paginator
            rows={5}
            emptyMessage="No hay productos agregados."
            className={isDark ? "bg-[#0F172A] text-white" : ""}
          >
            <Column field="index" header="ID" />
            <Column field="Producto" header="Producto" />
            <Column field="talla" header="Talla" />
            <Column
              header="Cantidad"
              body={(row) => cantidadEditor(row)}
              style={{ width: '150px' }}
            />
            <Column field="Precio" header="Precio Unit." body={(row) => `S/${row.Precio.toFixed(2)}`} />
            <Column field="Subtotal" header="Subtotal" body={(row) => `S/${row.Subtotal.toFixed(2)}`} />
            <Column
              header="Acciones"
              body={(row) => (
                <Button
                  icon="pi pi-trash"
                  className="bg-red-100 border-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-200"
                  onClick={() => eliminarProducto(row.idProducto)}
                />
              )}
            />
          </DataTable>
        </div>

        {/* DATOS DE PAGO */}
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-[#4F9CD7]" : "text-[#4F9CD7]"}`}>Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <Dropdown
              placeholder="Tipo de pago"
              value={pago}
              onChange={(e) => setPago(e.value)}
              options={tipoPago}
              optionLabel="name"
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
            />
            <Dropdown
              placeholder="Boleta o Factura"
              value={documento}
              onChange={(e) => setDocumento(e.value)}
              options={tipoDocumento}
              optionLabel="name"
              className={`w-full ${isDark ? "bg-[#0F172A] text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300"}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-lg font-medium">
            <div className={isDark ? "text-gray-300" : "text-black"}>SubTotal: <span className="text-gray-400">S/{subtotal.toFixed(2)}</span></div>
            <div className={isDark ? "text-gray-300" : "text-black"}>IGV (18%): <span className="text-gray-400">S/{igv.toFixed(2)}</span></div>
            <div className={isDark ? "text-gray-300" : "text-black"}>Total: <span className="text-[#12C447] font-bold">S/{total.toFixed(2)}</span></div>
            <div>
              <Button
                label="Finalizar Venta"
                icon="pi pi-check"
                className="w-full bg-[#4F9CD7] border-[#4F9CD7] text-white"
                onClick={handleSudmit}
                disabled={productosAgregados.length === 0}
              />
            </div>
          </div>
        </div>
      </div>

      <DialogCliente Open={visible} Close={()=>setVisible(false)} />
    </div>
  )
}
