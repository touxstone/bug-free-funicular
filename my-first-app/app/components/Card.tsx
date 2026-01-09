export default function Card() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Card Title
      </h3>
      <p className="text-gray-600">
        This is a simple card component. It can contain any content you want!
      </p>
    </div>
  );
}