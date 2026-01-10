'use client'

import { useState, useEffect } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
  // Estados
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // 🆕 KEY para localStorage
  const STORAGE_KEY = 'todos-app-data';
  
  // 🆕 useEffect: Detectar cuando estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 🆕 useEffect: CARGAR datos de localStorage al montar
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      
      if (savedTodos) {
        // Parsear el JSON guardado
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
        console.log('✅ Loaded todos from localStorage:', parsedTodos.length);
      }
    } catch (error) {
      console.error('❌ Error loading todos from localStorage:', error);
    }
  }, []); // Solo corre UNA VEZ al montar
  
  // 🆕 useEffect: GUARDAR datos en localStorage cuando cambien
  useEffect(() => {
    try {
      // Convertir a JSON y guardar
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      console.log('💾 Saved todos to localStorage:', todos.length);
    } catch (error) {
      console.error('❌ Error saving todos to localStorage:', error);
    }
  }, [todos]); // Corre cada vez que 'todos' cambia
  
  // Función: agregar todo
  const addTodo = () => {
    if (inputText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputText('');
  };
  
  // Función: toggle completed
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  // Función: eliminar todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Función: clear completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  // 🆕 Función: BORRAR TODOS LOS DATOS
  const clearAllData = () => {
    if (confirm('Are you sure you want to delete ALL todos? This cannot be undone.')) {
      setTodos([]);
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ All data cleared');
    }
  };
  
  // 🆕 Función: EXPORTAR datos (descarga JSON)
  const exportData = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  // 🆕 Función: IMPORTAR datos (carga JSON)
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTodos = JSON.parse(e.target?.result as string);
        setTodos(importedTodos);
        console.log('📥 Imported todos:', importedTodos.length);
      } catch (error) {
        alert('Error importing file. Make sure it\'s a valid JSON file.');
        console.error('❌ Import error:', error);
      }
    };
    reader.readAsText(file);
  };
  
  // Función: start editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  
  // Función: save edit
  const saveEdit = (id: number) => {
    if (editText.trim() === '') {
      setEditingId(null);
      return;
    }
    
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text: editText }
        : todo
    ));
    
    setEditingId(null);
    setEditText('');
  };
  
  // Función: cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };
  
  // Función: filtrar todos
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };
  
  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {/* Header con info de persistencia */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Todo List with localStorage 💾</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Auto-saved
        </div>
      </div>
      
      {/* Input + Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
        >
          Add
        </button>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({todos.length})
        </button>
        
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active ({activeCount})
        </button>
        
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>
      
      {/* Lista de todos */}
      <div className="space-y-2 mb-4">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {filter === 'all' && 'No tasks yet. Add one above!'}
            {filter === 'active' && 'No active tasks. Great job! 🎉'}
            {filter === 'completed' && 'No completed tasks yet.'}
          </p>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500 cursor-pointer flex-shrink-0"
              />
              
              {/* Texto editable o normal */}
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit(todo.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    onBlur={() => saveEdit(todo.id)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span 
                    onDoubleClick={() => startEdit(todo)}
                    className={`flex-1 cursor-pointer ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => startEdit(todo)}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 flex-shrink-0"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex-shrink-0"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Stats y acciones */}
      {todos.length > 0 && (
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>{activeCount} pending / {todos.length} total</p>
            </div>
            
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 font-medium"
              >
                Clear Completed ({completedCount})
              </button>
            )}
          </div>
          
          {/* 🆕 Data Management Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 font-medium"
            >
              📥 Export Data
            </button>
            
            <label className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 font-medium cursor-pointer">
              📤 Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>
      )}
      
      {/* Info de uso */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">💡 localStorage Features:</p>
        <ul className="space-y-1 text-xs">
          <li>✅ Data persists after closing browser</li>
          <li>✅ Auto-saves on every change</li>
          <li>✅ Export/Import for backup</li>
          <li>✅ Works offline</li>
          <li>⚠️ Data stored locally (not in cloud)</li>
        </ul>
        
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="font-semibold mb-1">🔍 Open DevTools to inspect:</p>
          <p className="text-xs font-mono bg-white px-2 py-1 rounded">
            Application → Local Storage → {isMounted ? window.location.origin : '...'}
          </p>
        </div>
      </div>
    </div>
  );
}