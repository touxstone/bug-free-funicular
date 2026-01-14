'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// 🔑 SCHEMA DE VALIDACIÓN CON ZOD
const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  age: z
    .number()
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age'),
  
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // Error aparece en confirmPassword
});

// TypeScript type inferido del schema
type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema), // 🔑 Conectar Zod
  });
  
  const onSubmit = async (data: RegistrationFormData) => {
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Registration data:', data);
    setSubmittedData(data);
    setIsSubmitted(true);
    
    // En producción, aquí harías:
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // });
  };
  
  const handleReset = () => {
    reset();
    setIsSubmitted(false);
    setSubmittedData(null);
  };
  
  if (isSubmitted && submittedData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Registration Successful!
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-600 mb-2"><strong>Username:</strong> {submittedData.username}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {submittedData.email}</p>
            <p className="text-sm text-gray-600"><strong>Age:</strong> {submittedData.age}</p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Register Another User
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Create Account 🚀</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            {...register('username')}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.username 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="john_doe"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        
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
          <p className="text-xs text-gray-500 mt-1">
            Must contain: 8+ chars, uppercase, lowercase, number
          </p>
        </div>
        
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.age 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="25"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>
        
        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-2">
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <p className="font-semibold text-blue-800 mb-2">💡 Zod Validation Features:</p>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>✓ Type-safe schemas</li>
          <li>✓ Complex validation rules</li>
          <li>✓ Custom error messages</li>
          <li>✓ Cross-field validation (password match)</li>
          <li>✓ Regex patterns</li>
        </ul>
      </div>
    </div>
  );
}