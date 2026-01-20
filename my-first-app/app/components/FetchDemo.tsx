'use client'

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function FetchDemo() {
  const [postId, setPostId] = useState(1);
  
  // ✨ Una línea vs 15 líneas de código
  const { data: post, loading, error } = useFetch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">useFetch Hook 🌐</h3>
      
      {/* Post Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Post ID:
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => setPostId(id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                postId === id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}
      
      {/* Data State */}
      {post && !loading && !error && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-blue-900">
                Post #{post.id}
              </h4>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                User {post.userId}
              </span>
            </div>
            <h5 className="text-lg font-bold text-gray-800 mb-2">
              {post.title}
            </h5>
            <p className="text-sm text-gray-600">
              {post.body}
            </p>
          </div>
          
          {/* Raw JSON */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
              View Raw JSON
            </summary>
            <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {JSON.stringify(post, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      {/* Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm">
        <p className="font-semibold text-green-800 mb-2">💡 useFetch Benefits:</p>
        <ul className="space-y-1 text-xs text-green-700">
          <li>✓ 1 line vs 15+ lines of code</li>
          <li>✓ Automatic loading state</li>
          <li>✓ Error handling included</li>
          <li>✓ Re-fetches when URL changes</li>
          <li>✓ Type-safe with TypeScript</li>
        </ul>
      </div>
    </div>
  );
}