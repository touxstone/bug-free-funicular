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
import RenderCounter from './components/RenderCounter';  
import TimerComponent from './components/TimerComponent';
import PersistentTimer from './components/PersistentTimer';
import Timer from './components/Timer';
import UserList from './components/UserList';
import WeatherApp from './components/WeatherApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Mis 5 Componentes React 🎨
        </h2>
{/* ========== DÍA 3: useEffect ========== */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Day 3: useEffect Hook 🎣
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <RenderCounter />
          </div>
        </section>
{/* ========== DÍA 3A: useEffect (Timer) ========== */}        
     <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Day 3(extra): Timer Component ⏱️
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <TimerComponent />
          </div>
        </section>   
{/* ========== DÍA 3B: useEffect (Persistent Timer) ========== */}        
<section className="max-w-2xl mx-auto bg-blue-900 text-white p-6 rounded-xl">
        <h3 className="font-bold mb-2">¿Qué observar aquí?</h3>
        <ul className="list-disc list-inside text-sm space-y-1 opacity-90">
          <li>El <b>Render Counter</b> muestra cuántas veces Next.js refresca la UI.</li>
          <li>El <b>Persistent Timer</b> sobrevive si refrescas la página (F5).</li>
          <li>Ambos usan <code>useEffect</code> pero para propósitos totalmente distintos.</li>
        </ul>
      </section>
      <br />  

{/* ========== DÍA 3C: (another) useEffect ========== */}
<section className="mb-16">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
    Day 3: (otro) useEffect Hook 🎣
  </h2>
  
  <div className="grid md:grid-cols-2 gap-6">
    {/* <RenderCounter /> */}
    <Timer />  {/* ← AÑADIR */}
  </div>
</section>  
<br />

{/* ========== WEATHER APP ========== */}
<section className="mb-16">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
    Weather App Project 🌤️
  </h2>
  </section>
  <WeatherApp />  
  <br /> 

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
{/* ========== FETCH DE APIs ========== */}
<section className="mb-16">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
    Fetching Real Data from APIs 🌐
  </h2>
  
  <UserList />
</section>
```

---

</main>

    </div>
  );
}