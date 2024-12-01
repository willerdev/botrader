import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useWebSocket from 'react-use-websocket';
import { BalanceCard } from '../components/BalanceCard';
import { Settings } from '../components/Settings';
import { AlertCircle, RefreshCcw, ChevronRight } from 'lucide-react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

interface AccountBalance {
  totalBalance: number;
  availableBalance: number;
  equity: number;
  marginUsage: number;
  currency: string;
}

export const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  // Cleanup subscriptions when component unmounts or before new subscription
  const cleanupSubscriptions = () => {
    sendMessage(JSON.stringify({
      forget_all: 'balance'
    }));
    setIsSubscribed(false);
  };

  const fetchBalance = () => {
    setIsLoading(true);
    setError(null);
    // Cleanup any existing subscriptions first
    cleanupSubscriptions();
    // Then authorize
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));
  };

  // Subscribe to balance updates
  const subscribeToBalance = () => {
    if (!isSubscribed) {
      sendMessage(JSON.stringify({
        balance: 1,
        subscribe: 1
      }));
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    fetchBalance();

    // Cleanup function for component unmount
    return () => {
      cleanupSubscriptions();
    };
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      if (response.error.code === 'AlreadySubscribed') {
        setError(null);
        setIsLoading(false);
        setIsSubscribed(true);
        return;
      }
      setError(response.error.message);
      setIsLoading(false);
      return;
    }

    if (response.authorize) {
      const balanceInfo = {
        totalBalance: response.authorize.balance,
        availableBalance: response.authorize.balance * 0.95,
        equity: response.authorize.balance,
        marginUsage: 5,
        currency: response.authorize.currency
      };
      setBalance(balanceInfo);
      setIsLoading(false);
      setError(null);
      
      if (!isSubscribed) {
        subscribeToBalance();
      }
    }

    if (response.balance && response.subscription) {
      setIsSubscribed(true);
    }

    if (response.balance) {
      const newBalance = {
        totalBalance: response.balance.balance,
        availableBalance: response.balance.balance * 0.95,
        equity: response.balance.balance,
        marginUsage: 5,
        currency: response.balance.currency
      };
      setBalance(newBalance);
      setIsLoading(false);
      setError(null);
    }
  }, [lastMessage]);

  if (error && !error.includes('AlreadySubscribed')) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading balance information</span>
          </div>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchBalance}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* User Profile Section */}
      <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile</h2>
        {user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User ID
              </label>
              <div className="mt-1">
                <p className="text-gray-900 dark:text-gray-100">{user.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings</h2>
        {user && <Settings userId={user.id} />}
      </div>

      {/* Account Management Links */}
      <div className="bg-white dark:bg-secondary-dark shadow rounded-lg overflow-hidden">
        <h3 className="px-6 py-4 text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          Account Management
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <Link
            to="/account-limits"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100">Account Limits</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Balance Section */}
      {isLoading ? (
        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : balance ? (
        <div className="relative">
          <div className="absolute top-2 right-2 text-xs text-green-500 dark:text-green-400 animate-pulse">
            Live Updates
          </div>
          <BalanceCard {...balance} />
        </div>
      ) : null}
    </div>
  );
};