'use client'

import { useCart } from '../contexts/CartContext';

const PRODUCTS = [
  { id: '1', name: 'React Course', price: 49.99, image: '📚' },
  { id: '2', name: 'Next.js Guide', price: 59.99, image: '📖' },
  { id: '3', name: 'TypeScript Book', price: 39.99, image: '📘' },
  { id: '4', name: 'Tailwind Tutorial', price: 29.99, image: '🎨' },
];

export default function CartDemo() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Shopping Cart Context 🛒
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Products Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Available Products</h4>
          <div className="space-y-3">
            {PRODUCTS.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{product.image}</span>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">
              Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h4>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>
          
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-4xl mb-2">🛒</p>
              <p>Your cart is empty</p>
              <p className="text-sm mt-1">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full mt-3 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm">
        <p className="font-semibold text-yellow-800 mb-2">🛒 Cart Features:</p>
        <ul className="space-y-1 text-xs text-yellow-700">
          <li>• Add/remove items from cart</li>
          <li>• Update quantities</li>
          <li>• Auto-calculated totals</li>
          <li>• Persisted in localStorage</li>
          <li>• Accessible from any component</li>
        </ul>
      </div>
    </div>
  );
}