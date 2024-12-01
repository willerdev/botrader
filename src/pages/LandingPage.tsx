import { Link } from 'react-router-dom';
import { Bot, TrendingUp, Shield, Globe, Zap, Users } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-accent-light dark:text-accent-dark" />
              <span className="ml-2 text-xl font-bold text-accent-light dark:text-accent-dark">
                MuraBot
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-accent-light dark:text-accent-dark hover:opacity-80"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-accent-light dark:bg-accent-dark text-primary-light dark:text-primary-dark px-4 py-2 rounded-md hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-accent-light dark:text-accent-dark">
                Professional Trading
              </span>
              <span className="block text-indigo-600 dark:text-indigo-400">
                Made Simple
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Access global markets, trade with confidence, and join thousands of successful traders on our cutting-edge platform.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-secondary-light dark:bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-accent-light dark:text-accent-dark sm:text-4xl">
              Why Choose MuraBot?
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Everything you need to succeed in the financial markets
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-accent-light dark:text-accent-dark">Advanced Trading Tools</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                  Professional-grade charts, indicators, and analysis tools at your fingertips.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-accent-light dark:text-accent-dark">Secure Platform</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                  Bank-grade security with 24/7 monitoring and encrypted transactions.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-accent-light dark:text-accent-dark">Global Markets</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                  Access to a wide range of markets and trading instruments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white dark:bg-secondary-dark overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Traders
                      </dt>
                      <dd className="text-3xl font-bold text-accent-light dark:text-accent-dark">
                        100,000+
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-secondary-dark overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Executions Daily
                      </dt>
                      <dd className="text-3xl font-bold text-accent-light dark:text-accent-dark">
                        1M+
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-secondary-dark overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Countries Served
                      </dt>
                      <dd className="text-3xl font-bold text-accent-light dark:text-accent-dark">
                        150+
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};