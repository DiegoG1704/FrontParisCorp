'use client'

import { Button } from 'primereact/button'
// import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
// import { InputText } from 'primereact/inputtext'
import React from 'react'
// import axiosInstance from '../Herramientas/axiosToken'
// import { useAppContext } from '../Provider/AppContext'
// import { InputTextarea } from 'primereact/inputtextarea'

interface Props {
  Open: boolean
  Close: () => void
  Datos: any
}

export default function DialogNotificaciones({ Close, Open, Datos }: Props) {
//   const {Listacolor}=useAppContext();
//   const [respuesta,setRespuesta]= useState('')

//   console.log('notificaciones',Datos);
  
//   const handleSubmit = async()=>{
//     console.log('Color',color);
//     const nombre = color
//     try {
//       await axiosInstance.post('PostColor',{nombre})
//       console.log('exito');
//       setColor('')
//       Listacolor();
//       Close();
//     } catch (error) {
//       console.log('Error',error);
//     }
//   }
  
  const Titulo = () => (
    <div className="flex items-center gap-3">
      <i className="pi pi-slack bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
      <p className="text-[#BACD00] text-[1.5rem] font-semibold">
        {Datos?.titulo}
      </p>
    </div>
  )

  return (
    <Dialog header={Titulo} onHide={Close} visible={Open} className="w-[25rem]">
        <div className="flex flex-col gap-3">
            <span className='font-semibold'>Remitente:</span>
            <span>{Datos?.nombres}</span>
            <span className='font-semibold'>Mensaje: </span>
            <span className="text-lm">
            {Datos?.mensaje}
            </span>

            <span className="text-xs opacity-60 flex justify-end">
            {Datos?.fechaEnvio && new Date(Datos?.fechaEnvio).toLocaleString()}
            </span>

            {/* <Button
                className='m-2 flex justify-end'
                label="Cerrar"
                onClick={Close}
              /> */}

            {/* <span className='text-lg mt-5'>Respuesta</span>

            <InputTextarea
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            rows={3}
            placeholder="Escribe una respuesta..."
            />
            <div className='flex justify-end mt-5'>
                <Button
                    className='m-2'
                    label="Cancelar"
                    icon="pi pi-send"
                    onClick={Close}
                />
                <Button
                    className='m-2'
                    label="Enviar"
                    icon="pi pi-send"
                    // onClick={() => enviarRespuesta()}
                    disabled={!respuesta.trim()}
                />
            </div> */}
        </div>
    </Dialog>
  )
}
