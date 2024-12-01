import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AlertCircle, RefreshCcw, BadgeDollarSign, ArrowDownCircle, BarChart3 } from 'lucide-react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

interface AccountLimits {
  withdrawal_limits: number;
  available_withdrawal: number;
  turnover_limit: number;
}

export const AccountLimitsPage = () => {
  const [limits, setLimits] = useState<AccountLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  const fetchLimits = () => {
    setIsLoading(true);
    setError(null);
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      setError(response.error.message);
      setIsLoading(false);
      return;
    }

    if (response.authorize) {
      // After authorization, request account limits
      sendMessage(JSON.stringify({
        get_limits: 1
      }));
    }

    if (response.get_limits) {
      setLimits({
        withdrawal_limits: response.get_limits.daily_withdrawal_limit || 0,
        available_withdrawal: response.get_limits.withdrawal_available || 0,
        turnover_limit: response.get_limits.turnover_limit || 0
      });
      setIsLoading(false);
      setError(null);
    }
  }, [lastMessage, sendMessage]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading account limits</span>
          </div>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchLimits}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Account Limits</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account Limits</h2>
        <button
          onClick={fetchLimits}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <ArrowDownCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Daily Withdrawal Limits</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maximum amount you can withdraw per day</p>
            </div>
          </div>
          <p className="text-3xl font-bold">${limits?.withdrawal_limits.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <BadgeDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Available Withdrawal Amount</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount available for withdrawal</p>
            </div>
          </div>
          <p className="text-3xl font-bold">${limits?.available_withdrawal.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-secondary-dark shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Turnover Limits</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maximum trading volume allowed</p>
            </div>
          </div>
          <p className="text-3xl font-bold">${limits?.turnover_limit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};