'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


// 🔑 SCHEMA DE VALIDACIÓN CON ZOD
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  rememberMe: z.boolean().default(false),     
  });

// TypeScript type inferido del schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },  
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }, // 🔑 Conectar Zod
  });
  
  // Asegúrate de que este 'data' sea exactamente LoginFormData
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Login data:', data);
    alert(`Welcome back, ${data.email}!\nRemember me: ${data.rememberMe ? 'Yes' : 'No'}`);
    
    // En producción, aquí harías:
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // });
  };
  
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Sign In 🔐</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email */}
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
        
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            {...register('password')}
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="********"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
          </div>
                
        {/* Remember Me Checkbox */}
        <div>
          <label className="flex items-start gap-2">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Remember me
            </span>
          </label>
         </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {/* Extra Links */}
      <div className="mt-4 text-center text-sm">
        <a href="#" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
        <span className="mx-2 text-gray-400">•</span>
        <a href="#" className="text-blue-600 hover:underline">
          Create account
        </a>
      </div>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm">
        <p className="font-semibold text-green-800 mb-2">💡 Login Form Features:</p>
        <ul className="space-y-1 text-xs text-green-700">
          <li>✓ Simplified validation (6+ chars password)</li>
          <li>✓ Remember me checkbox</li>
          <li>✓ Loading state during submit</li>
          <li>✓ Email format validation</li>
        </ul>
      </div>
    </div>
  );
}