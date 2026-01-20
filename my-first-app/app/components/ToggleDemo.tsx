'use client'

import { useToggle } from '../hooks/useToggle';

export default function ToggleDemo() {
  const modal = useToggle(false);
  const darkMode = useToggle(false);
  const notifications = useToggle(true);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">useToggle Hook 🔄</h3>
      
      <div className="space-y-4">
        {/* Modal Toggle */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Modal</span>
            <span className="text-sm text-gray-500">
              {modal.value ? '✅ Open' : '❌ Closed'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={modal.toggle}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Toggle
            </button>
            <button
              onClick={modal.setTrue}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Open
            </button>
            <button
              onClick={modal.setFalse}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Dark Mode Toggle */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Dark Mode</span>
            <button
              onClick={darkMode.toggle}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                darkMode.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {darkMode.value ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
        
        {/* Notifications Toggle */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Notifications</span>
            <button
              onClick={notifications.toggle}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                notifications.value
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {notifications.value ? '🔔 On' : '🔕 Off'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg text-sm">
        <p className="font-semibold text-purple-800 mb-2">💡 useToggle API:</p>
        <ul className="space-y-1 text-xs text-purple-700">
          <li>• <code>value</code> - Current boolean value</li>
          <li>• <code>toggle()</code> - Flip the value</li>
          <li>• <code>setTrue()</code> - Set to true</li>
          <li>• <code>setFalse()</code> - Set to false</li>
          <li>• <code>setValue(bool)</code> - Set specific value</li>
        </ul>
      </div>
    </div>
  );
}