'use client';
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 px-8 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My App</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-200 transition-colors">About</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}