import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { Bot } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-accent-light dark:text-accent-dark" />
            <h2 className="text-3xl font-extrabold text-accent-light dark:text-accent-dark">
              MuraBot
            </h2>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-secondary-light dark:bg-secondary-dark py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};