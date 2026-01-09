'use client'
import Button from './components/Button';
import Card from './components/Card';
import Header from './components/Header';
import Avatar from './components/Avatar';
import Badge from './components/Badge';
import ProfileCard from './components/ProfileCard'; 
import Counter from './components/Counter';
import Toggle from './components/Toggle';
import NameInput from './components/NameInput';
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Mis 5 Componentes React 🎨
        </h2>
        <div className="mb-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    Profile Cards con Props 🎯
  </h2>
  
  <div className="grid md:grid-cols-3 gap-6">
    <ProfileCard 
      name="Alice Johnson"
      title="Frontend Developer"
      bio="Passionate about creating beautiful user interfaces with React."
    />
    
    <ProfileCard 
      name="Bob Smith"
      title="Backend Engineer"
      bio="Building scalable APIs and loving every minute of it!"
    />
    
    <ProfileCard 
      name="Carol White"
      title="Full Stack Developer"
      bio="Jack of all trades, master of... well, still learning!"
    />
  </div>
</div>
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">1. Card Component</h3>
            <Card />
          </div>
          
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">2. Button Component</h3>
          <Button 
          text="Click Me" 
          onClick={() => alert('Button clicked!')}
          />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">3. Avatar Component</h3>
            <Avatar />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">4. Badge Component</h3>
            <Badge />
          </div>
          
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700">
            ✅ <strong>¡Completado!</strong> Has creado 5 componentes React reutilizables.
          </p>
        </div>
        
        <div className="mt-12">
   <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    State: Contador Interactivo 🔢
  </h2>
  
  <div className="mt-12 grid md:grid-cols-3 gap-6">
  <Counter />
  <Toggle />
  <NameInput />
</div>
</div>
<div className="mt-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    Final Exercise: Todo List 🎯
  </h2>
  <TodoList />
</div>
</main>

    </div>
  );
}