'use client'

import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';  // Estilos base de PrimeReact
import 'primeicons/primeicons.css';  // Iconos de PrimeReact
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAppContext } from './Provider/AppContext';
import logo from './Imagen/logoEllafit.png'
import Image from 'next/image';

export default function Home() {
  const { datos, handleChange, login, errorMessage } = useAppContext();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[90%] sm:w-96 bg-white p-8 rounded-xl shadow-lg space-y-6">
        <Image src={logo} alt="Logo Ellafit" className="mx-auto flex justify-center" />
        {/* <h2 className="text-center text-3xl font-semibold text-gray-700">EllaFit</h2> */}
        {/* Error message */}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">{errorMessage}</div>
        )}

        {/* Username Field */}
        <div className="m-4">
          <span className="text-gray-600 font-medium">Username</span>
          <InputText
            name="usuario"
            placeholder="Ingrese su correo"
            value={datos.usuario}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password Field */}
        <div className="m-4">
          <span className="text-gray-600 font-medium">Contraseña</span>
          <InputText
            name="contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            value={datos.contraseña}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <Button
            onClick={login}
            label="Ingresar"
            className="w-full p-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-200"
          />
        </div>
      </div>
    </div>
  );
}
