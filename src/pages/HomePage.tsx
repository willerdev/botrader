import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, ClipboardList, User, ArrowRight, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useWebSocket from 'react-use-websocket';
import { MarketView } from '../components/MarketView';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('USD');

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Authorize and request balance
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));
  }, [sendMessage]);

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);
    
    if (response.authorize) {
      setBalance(response.authorize.balance);
      setCurrency(response.authorize.currency);
    }
  }, [lastMessage]);

  return (
    <div className="space-y-6 p-4">
      {/* Welcome and Balance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome to MuraTrade Pro
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <Link
              to="/profile"
              className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              <User className="w-4 h-4 mr-1" />
              View Profile
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Account Balance
            </h2>
            <Link
              to="/trade"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Trade now →
            </Link>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {balance !== null ? (
                `${currency} ${balance.toFixed(2)}`
              ) : (
                "Loading..."
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Market View */}
      <MarketView />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/trade"
          className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trade Now</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start a new trade</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>

        <Link
          to="/orders"
          className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Orders</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">View your positions</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>

        <Link
          to="/history"
          className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trading History</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">View past trades</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  );
};