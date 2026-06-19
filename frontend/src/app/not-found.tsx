import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-orange-100 p-6 rounded-full mb-8">
        <ShoppingBag size={64} className="text-orange-500" />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Oops! It looks like the page you are looking for has been moved or doesn't exist. Let's get you back to shopping.
      </p>
      <Link 
        href="/"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        Back to Home
      </Link>
    </div>
  );
}
