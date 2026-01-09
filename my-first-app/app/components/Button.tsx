type ButtonProps = {
text: string;
onClick?: () => void;  
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button 
    onClick={onClick}    
    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg">
      {text}
    </button>
  );
}