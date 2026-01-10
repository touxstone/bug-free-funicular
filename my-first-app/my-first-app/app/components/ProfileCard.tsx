import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';

// TypeScript: definimos qué props recibe
type ProfileCardProps = {
  name: string;
  title: string;
  bio: string;
}
export default function ProfileCard({ name, title, bio }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm border border-gray-200">
      
      {/* Avatar centrado */}
      <div className="flex justify-center mb-4">
        <Avatar name={name}/>
      </div>
      
      {/* Nombre y título */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {name} 
        </h3>
        <p className="text-gray-600 text-sm">
          {title} 
        </p>
      </div>
      
      {/* Badge centrado */}
      <div className="flex justify-center mb-4">
        <Badge />
      </div>

      {/* Bio */}
      <p className="text-gray-600 text-center mb-6">
        {bio}</p>
      {/* Botón centrado */}
      <div className="flex justify-center">
        <Button 
        text="View Profile"
        onClick={() => alert(`Profile clicked!`)}
        />
      </div>
    </div>
  );
}