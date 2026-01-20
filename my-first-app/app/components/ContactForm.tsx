'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Esquema de validación completo
const contactSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Introduce un email válido'),
  subject: z.string().min(1, 'Por favor, selecciona un asunto'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur', // Valida al salir del campo
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulamos una espera de red
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log('✅ Datos recogidos:', data);
    alert(`¡Gracias ${data.fullName}! Hemos recibido tu mensaje sobre "${data.subject}".`);
    
    reset(); // Limpia el formulario tras el éxito
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 mt-10">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Formulario de Contacto</h2>
        <p className="text-gray-500 text-sm">Completa todos los campos para enviarnos tu consulta.</p>
      </header>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
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

        {/* Campo: Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="correo@ejemplo.com"
            className={`w-full p-3 rounded-lg border outline-none transition-all ${
              errors.email ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Campo: Asunto (SELECT) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
          <select
            {...register('subject')}
            className={`w-full p-3 rounded-lg border outline-none bg-white transition-all ${
              errors.subject ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
            }`}
          >
            <option value="">Selecciona una opción...</option>
            <option value="Soporte Técnico">Soporte Técnico</option>
            <option value="Ventas">Ventas</option>
            <option value="Otros">Otros</option>
          </select>
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
        </div>

        {/* Campo: Mensaje (TEXTAREA) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder="¿En qué podemos ayudarte?"
            className={`w-full p-3 rounded-lg border outline-none transition-all resize-none ${
              errors.message ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
            }`}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
}