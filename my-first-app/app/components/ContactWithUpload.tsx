'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ... (Esquema_ schema de validación previo)
const contactSchema = z.object({
  fullName: z.string().min(3, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  // Validación de archivo
  attachment: z
    .any()
    .refine((files) => {
      // Si no hay archivos, es válido (porque es opcional)
      if (!files || files.length === 0) return true;
      // Validar tamaño (ej. máx 2MB)
      return files[0]?.size <= 2 * 1024 * 1024;
    }, 'El archivo debe ser menor a 2MB')
    .refine((files) => {
      if (!files || files.length === 0) return true;
      // Validar tipos permitidos
      const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return acceptedTypes.includes(files[0]?.type);
    }, 'Solo se aceptan JPG, PNG o PDF')
    .optional(),
});

export default function ContactWithUpload() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // Observamos el archivo para mostrar el nombre al seleccionarlo
  const fileSelected = watch('attachment');

  const onSubmit = async (data: any) => {
    // IMPORTANTE: Para enviar archivos a una API, se usa FormData
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    
    if (data.attachment?.[0]) {
      formData.append('file', data.attachment[0]);
    }

    console.log('Enviando FormData con archivo...');
    await new Promise(r => setTimeout(r, 2000));
    alert('¡Enviado con éxito!');
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar propuesta</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre e Email igual que antes... */}
          {/* Campo: Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
          <input
            {...register('fullName')}
            placeholder="Juan Pérez"
            className={`w-full p-3 rounded-lg border outline-none transition-all ${
              errors.fullName ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
{/* email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Campo de Archivo (Upload) */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adjuntar archivo (Opcional, máx 2MB)
          </label>
          
          <div className="flex items-center justify-center w-full">
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              errors.attachment ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-500">
                  {fileSelected?.[0] ? (
                    <span className="text-blue-600 font-medium">{fileSelected[0].name}</span>
                  ) : (
                    "Haga clic para subir o arrastre"
                  )}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                {...register('attachment')} 
              />
            </label>
          </div>
          {errors.attachment && (
            <p className="text-red-500 text-xs mt-2">{(errors.attachment as any).message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {isSubmitting ? 'Procesando archivo...' : 'Enviar todo'}
        </button>
      </form>
    </div>
  );
}