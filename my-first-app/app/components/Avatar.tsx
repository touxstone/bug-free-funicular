'use client';
type AvatarProps ={
	name?: string;
  username?: string;
}
export default function Avatar({name = '', username}:AvatarProps) {
  const initials = (name ||" ")
  .trim()
  .split(' ')
  .map(n => n[0])
  .join('')
  .toUpperCase()

  const displayUsername = username || '@' + name.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
        {initials}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{displayUsername}</p>
      </div>
    </div>
  );
}

