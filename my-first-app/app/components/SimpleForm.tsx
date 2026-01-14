'use client'

import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  age: number;
}

export default function SimpleForm() {
  // useForm hook
  const {
    register,      // Registrar inputs
    handleSubmit,  // Manejar submit
    formState: { errors }  // Errores de validación
  } = useForm<FormData>();
  
  // Función que se ejecuta cuando el form es válido
  const onSubmit = (data: FormData) => {
    console.log('✅ Form data:', data);
    alert(`Hello ${data.name}! You are ${data.age} years old.`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">Simple Form 📝</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            {...register('age', {
              required: 'Age is required',
              min: {
                value: 18,
                message: 'You must be at least 18 years old'
              },
              max: {
                value: 120,
                message: 'Age must be less than 120'
              }
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="25"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-2">💡 Try this:</p>
        <ul className="space-y-1 text-xs">
          <li>• Leave name empty → see error</li>
          <li>• Type invalid email → see error</li>
          <li>• Set age under 18 → see error</li>
          <li>• Fill correctly → see alert</li>
        </ul>
      </div>
    </div>
  );
}