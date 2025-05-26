import React from 'react';
import { Link } from 'react-router-dom';
import { CircuitBoard, Search, ShoppingBag, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, userData, login, logout } = useAuth();

  return (
    <nav className="bg-primary-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <CircuitBoard className="h-8 w-8 text-accent-500" />
              <span className="ml-2 text-xl font-heading font-bold">ChainTrack</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/items" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                Items
              </Link>
              <Link to="/scan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                Scan
              </Link>
              {isAuthenticated && (
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                  Register Item
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/search" className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary-600 focus:outline-none">
              <Search className="h-5 w-5" />
            </Link>
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center">
                <div className="text-sm font-medium mr-2">
                  <span className="hidden md:inline">{userData?.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary-600 focus:outline-none flex items-center"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-1 hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="ml-3 px-4 py-2 rounded-md bg-accent-500 text-white hover:bg-accent-600 focus:outline-none flex items-center transition-colors"
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600">
            Dashboard
          </Link>
          <Link to="/items" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600">
            Items
          </Link>
          <Link to="/scan" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600">
            Scan
          </Link>
          {isAuthenticated && (
            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600">
              Register Item
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;