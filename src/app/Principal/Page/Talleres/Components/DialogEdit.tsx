'use client'

import axiosInstance from '@/app/Herramientas/axiosToken';
import { useAppContext } from '@/app/Provider/AppContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
    Open: boolean;
    Close: () => void;
    Datos: any;
}

export default function DialogEdit({ Close, Open, Datos }: Props) {
    const {ListaTaller}= useAppContext()
    const toast = useRef<Toast>(null)
    const [form, setForm] = useState({
        nombre_taller: '',
        direccion: '',
        // telefono: '',
        // dni: ''
    });

    useEffect(() => {
        if (Datos) {
            setForm({
                nombre_taller: Datos.nombre_taller || '',
                direccion: Datos.direccion || '',
                // telefono: Datos.telefono || '',
                // dni: Datos.dni || ''
            });
        }
    }, [Datos]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {

            await axiosInstance.put(`EditTaller/${Datos?.id}`, {
                nombre: form.nombre_taller,
                direccion:form.direccion
            })

            toast.current?.show({
                severity: 'success',
                summary: 'Taller actualizado',
                detail: 'Los datos del taller se actualizaron correctamente',
                life: 3000
            })

            Close()
            ListaTaller()

        } catch (error: any) {

            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.message || 'No se pudo actualizar el taller',
                life: 4000
            })

            console.log('Error', error)
        }
    }

    const Titulo = () => (
        <div className="flex items-center gap-3">
            <i className="pi pi-user bg-[#dee87b] p-3 rounded-md text-[#BACD00] text-xl" />
            <p className="text-[#BACD00] text-[1.5rem] font-semibold">Editar Taller</p>
        </div>
    );

    return (
        <>
        <Toast ref={toast} />
            <Dialog
                onHide={Close}
                visible={Open}
                header={Titulo}
                style={{ width: '500px' }}
                className="p-fluid"
                closable
                draggable={false}
                modal
            >
                <div className="bg-white shadow-md rounded-lg px-6 py-4 space-y-5">

                    <label className="text-[#4F9CD7] text-[1.5rem] font-semibold">
                        <i className='pi pi-shop text-[1.4rem]' /> Datos del Taller
                    </label>

                    <div className="flex flex-col gap-3">

                        <div>
                            <label className="text-[#4F9CD7] font-medium">Nombre</label>
                            <InputText
                                name="nombre_taller"
                                className="mt-1"
                                value={form.nombre_taller}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-[#4F9CD7] font-medium">Dirección</label>
                            <InputText
                                name="direccion"
                                className="mt-1"
                                value={form.direccion}
                                onChange={handleChange}
                            />
                        </div>

                        {/* <div>
                            <label className="text-[#4F9CD7] font-medium">Teléfono</label>
                            <InputText
                                name="telefono"
                                className="mt-1"
                                value={form.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-[#4F9CD7] font-medium">DNI</label>
                            <InputText
                                name="dni"
                                className="mt-1"
                                value={form.dni}
                                onChange={handleChange}
                            />
                        </div> */}

                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <Button onClick={Close} label="Cancelar" className="p-button-text" />
                    <Button onClick={handleSubmit} label="Editar" className='bg-[#BACD00] border-[#BACD00] text-white' />
                </div>
            </Dialog>
        </>
        
    );
}