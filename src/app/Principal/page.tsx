'use client'

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Provider/AppContext';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';
import './styles/styles.css'

export default function Page() {
  const {listProductos} = useAppContext();
  const router = useRouter();

  // Asegúrate de que el primer video esté seleccionado por defecto al cargar la página
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(listProductos?.[0]?.clases?.[0]?.video);
  const [selectedDescripcion, setSelectedDescripcion] = useState<string | undefined>(listProductos?.[0]?.clases?.[0]?.descripcion);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(listProductos?.[0]?.clases?.[0]?.titulo);
  const [selectedModulo, setSelectedModulo] = useState<string | undefined>(listProductos?.[0]?.titulo); // Nuevo estado para el módulo
  const [selectedModuloTitulo, setSelectedModuloTitulo] = useState<string | undefined>(listProductos?.[0]?.descripcion);
  const [selectedDuracion, setSelectedDuracion] = useState<string | undefined>(listProductos?.[0]?.clases?.[0]?.duracion);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("/"); // Redirige si no hay sesión activa
      return;
    }

    // Simulación de carga de 3 segundos
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [router]);

  useEffect(() => {
    if (listProductos.length > 0 && listProductos[0].clases.length > 0) {
      setSelectedVideo(listProductos[0].clases[0].video);
      setSelectedTitle(listProductos[0].clases[0].titulo);
      setSelectedDescripcion(listProductos[0].clases[0].descripcion);
      setSelectedModulo(listProductos[0].titulo);
      setSelectedModuloTitulo(listProductos[0].descripcion);
      setSelectedDuracion(listProductos[0].clases[0].duracion);
    }
  }, [listProductos]);

  if (loading) {
    return (
      <div className="flex flex-col bg-[#2c2f36] justify-center items-center h-screen">
        <ProgressSpinner style={{width: '150px', height: '150px'}}/>
        <h1 className='text-white text-[2rem]'>Cargando tu curso...</h1>
      </div>
      )
  }
  // Función para manejar el clic en el título de la clase y actualizar el video
  const handleClassClick = (videoUrl: string, titulo: string, descripcion: string, moduloTitulo: string, moduloDescripcion: string,duracion:string) => {
    setSelectedVideo(videoUrl); // Actualiza el video seleccionado
    setSelectedTitle(titulo); // Actualiza el título de la clase seleccionada
    setSelectedDescripcion(descripcion);
    setSelectedModulo(moduloTitulo); // Actualiza el módulo seleccionado
    setSelectedModuloTitulo(moduloDescripcion)
    setSelectedDuracion(duracion)
  }

  const submit = () => {
    // Eliminar el 'authToken' del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    
    // Redirigir a la página de inicio o la página deseada
    router.push('/');
  };
  

  return (
    <div className="containerAplicacion">
      {/* Contenedor para el video */}
      {loading ? (
        <div className="flex bg-white justify-center items-center h-screen">
          <ProgressSpinner />
        </div>
      ) : (
        <>
      <div className="video-container">
        <div className="video-header">
          <h1>{selectedTitle}</h1>
          {selectedVideo && (
            <video controls className="video-player">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="video-description p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xl md:text-2xl">{selectedModulo}</span>
              <span className="bg-[#525252] text-white px-3 py-1 rounded-md text-xs md:text-sm">
                {selectedDuracion}
              </span>
            </div>
            <span className="block text-sm md:text-base text-gray-700">{selectedModuloTitulo}</span>
            <span className="block font-bold text-lg md:text-xl text-gray-900 mt-2">
              {selectedTitle}
            </span>
            <span className="block text-sm md:text-base text-gray-600 mt-1">
              {selectedDescripcion}
            </span>
          </div>

        </div>
      </div>

      {/* Contenedor para el acordeón y el botón */}
      <div className="modules-container">
        <h2 className="modules-header">Blockchain</h2>
        
        {/* Accordion con clases */}
        <div className="accordion-container">
          <Accordion multiple activeIndex={0}>
            {listProductos.map((modulo, index) => (
              <AccordionTab key={index} header={modulo.titulo}>
                {modulo?.clases?.map((clase, claseIndex) => (
                  <div key={claseIndex} className="accordion-tab">
                    <div>
                    <i
                      className={`pi pi-play-circle ${clase?.completado ? 'text-green-500' : 'text-white'}`}
                    />
                      <a
                        href="#"
                        onClick={() => handleClassClick(clase.video, clase.titulo, clase.descripcion, modulo.titulo, modulo.descripcion, clase.duracion)}
                        className="accordion-link"
                      >
                        {clase?.titulo}
                      </a>
                    </div>
                    <Tag severity="success" value="10 puntos"></Tag>
                  </div>
                ))}
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        {/* Botón de regreso */}
        <Button
          label="Regresar"
          onClick={submit}
          className="back-button"
        />
      </div>
      </>
      )}
    </div>
  );
}
