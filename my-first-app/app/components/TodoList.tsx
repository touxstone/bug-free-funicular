'use client'

import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
}

// Tipo para los filtros
type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
  // Estado: array de todos
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Estado: input text
  const [inputText, setInputText] = useState('');
  
  // Estado: filtro actual
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Estado: id del todo en edición (null si ninguno)
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estado: texto temporal mientras edita
  const [editText, setEditText] = useState('');
  
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
  
  // 🆕 FEATURE 1: Clear Completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  // 🆕 FEATURE 3: Start editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  
  // 🆕 FEATURE 3: Save edit
  const saveEdit = (id: number) => {
    if (editText.trim() === '') {
      // Si está vacío, cancelar
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
  
  // 🆕 FEATURE 3: Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };
  
  // 🆕 FEATURE 2: Filtrar todos según el filtro activo
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
      <h3 className="text-2xl font-bold mb-4 text-center">Enhanced Todo List 📝</h3>
      
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
      
      {/* 🆕 FEATURE 2: Filter Buttons */}
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
              
              {/* 🆕 FEATURE 3: Texto editable o normal */}
              {editingId === todo.id ? (
                // Modo edición
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
                // Modo normal
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
      
      {/* Stats y Clear Completed */}
      {todos.length > 0 && (
        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>
              {activeCount} pending / {todos.length} total
            </p>
          </div>
          
          {/* 🆕 FEATURE 1: Clear Completed Button */}
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 font-medium"
            >
              Clear Completed ({completedCount})
            </button>
          )}
        </div>
      )}
      
      {/* Info de uso */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-1">💡 Features:</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Double-click</strong> any task to edit it</li>
          <li>• Click <strong>Edit</strong> button to edit</li>
          <li>• Use <strong>filter buttons</strong> to view different lists</li>
          <li>• <strong>Clear Completed</strong> removes all done tasks</li>
        </ul>
      </div>
    </div>
  );
}