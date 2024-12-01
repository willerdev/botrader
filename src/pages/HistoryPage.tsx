import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCcw, History, TrendingUp } from 'lucide-react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

interface TradeTransaction {
  time: string;
  id: string;
  type: string;
  amount: string;
  profit: string;
  balance: string;
  rawProfit: number; // Used for color styling
}

export const HistoryPage = () => {
  const [trades, setTrades] = useState<TradeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  const fetchHistory = () => {
    setIsLoading(true);
    setError(null);
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));
  };

  const refreshHistory = () => {
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
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
      sendMessage(JSON.stringify({
        profit_table: 1,
        description: 1,
        limit: 20
      }));
    }

    if (response.profit_table) {
      const transactions = response.profit_table.transactions.map((trade: any) => ({
        time: trade.transaction_time
          ? new Date(trade.transaction_time * 1000).toLocaleString()
          : 'N/A',
        id: trade.transaction_id || 'N/A',
        type: trade.shortcode || 'N/A',
        amount: trade.buy_price !== undefined ? `$${trade.buy_price.toFixed(2)}` : 'N/A',
        profit: trade.profit !== undefined ? `$${trade.profit.toFixed(2)}` : 'N/A',
        balance: trade.balance !== undefined ? `$${trade.balance.toFixed(2)}` : 'N/A',
        rawProfit: trade.profit || 0
      }));
      setTrades(transactions);
      setIsLoading(false);
      setError(null);
    }
  }, [lastMessage, sendMessage]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading history</span>
          </div>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={refreshHistory}
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
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trading History</h2>
          <div className="animate-spin">
            <RefreshCcw className="w-5 h-5" />
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-secondary-dark rounded-lg p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trading History</h2>
        <button
          onClick={refreshHistory}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      {trades.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-secondary-dark rounded-lg">
          <div className="mb-4">
            <History className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Trading History
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't made any trades yet.
          </p>
          <Link
            to="/trade"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light dark:bg-accent-dark text-primary-light dark:text-primary-dark rounded-md hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="w-4 h-4" />
            Start Trading
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary-dark rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit/Loss
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-dark divide-y divide-gray-200 dark:divide-gray-700">
                {trades.map((trade, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {trade.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {trade.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {trade.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {trade.amount}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      trade.rawProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {trade.profit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {trade.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};