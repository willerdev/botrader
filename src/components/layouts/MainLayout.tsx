import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, ClipboardList, Clock, User, LogOut, Bot, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../ThemeToggle';
import { useState } from 'react';

export const MainLayout = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const NavItems = () => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `inline-flex flex-col items-center text-sm font-medium ${
            isActive
              ? 'text-accent-light dark:text-accent-dark'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`
        }
      >
        <Home className="w-6 h-6" />
        <span className="mt-1">Home</span>
      </NavLink>

      <NavLink
        to="/trade"
        className={({ isActive }) =>
          `inline-flex flex-col items-center text-sm font-medium ${
            isActive
              ? 'text-accent-light dark:text-accent-dark'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`
        }
      >
        <TrendingUp className="w-6 h-6" />
        <span className="mt-1">Trade</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `inline-flex flex-col items-center text-sm font-medium ${
            isActive
              ? 'text-accent-light dark:text-accent-dark'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`
        }
      >
        <ClipboardList className="w-6 h-6" />
        <span className="mt-1">Orders</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `inline-flex flex-col items-center text-sm font-medium ${
            isActive
              ? 'text-accent-light dark:text-accent-dark'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`
        }
      >
        <Clock className="w-6 h-6" />
        <span className="mt-1">History</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `inline-flex flex-col items-center text-sm font-medium ${
            isActive
              ? 'text-accent-light dark:text-accent-dark'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`
        }
      >
        <User className="w-6 h-6" />
        <span className="mt-1">Profile</span>
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-accent-light dark:text-accent-dark">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-secondary-light dark:bg-secondary-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bot className="w-6 h-6 mr-2" />
              <span className="font-bold">MuraBot</span>
            </div>
            <div className="flex space-x-8">
              <NavItems />
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md hover:bg-secondary-dark dark:hover:bg-secondary-light"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-secondary-light dark:bg-secondary-dark border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-5 gap-1 px-2 py-3">
          <NavItems />
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-secondary-light dark:bg-secondary-dark border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-2" />
          <h1 className="text-lg font-bold">MuraBot</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications Dropdown (Mobile) */}
      {showNotifications && (
        <div className="md:hidden absolute right-2 top-14 w-80 bg-white dark:bg-secondary-dark shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Notifications</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-20 md:mb-0">
        <Outlet />
      </main>
    </div>
  );
};