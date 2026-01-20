'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Schema Zod
const contactoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z
    .string()
    .email('Invalid email address'),
  
  subject: z
    .string()
    .min(1, 'Please select a subject'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
});

export default function ContactoForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: any) => {
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('📧 Contact form data:', data);
    setIsSubmitted(true);
    
    // Reset form después de 3 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Message Sent!
          </h3>
          <p className="text-gray-600">
            Thank you for contacting us. We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Contact Us 📧</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            {...register('name')}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
        
        {/* Subject (Select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <select
            {...register('subject')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.subject 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Select a subject...</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="billing">Billing Question</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>
        
        {/* Message (Textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            {...register('message')}
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Tell us how we can help you..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters, maximum 500
          </p>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg text-sm">
        <p className="font-semibold text-purple-800 mb-2">💡 New Elements:</p>
        <ul className="space-y-1 text-xs text-purple-700">
          <li>✓ Select dropdown validation</li>
          <li>✓ Textarea with min/max length</li>
          <li>✓ Auto-reset after success</li>
          <li>✓ Loading state during submit</li>
        </ul>
      </div>
    </div>
  );
}