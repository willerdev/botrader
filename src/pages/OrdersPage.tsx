import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { ContractCard } from '../components/ContractCard';
import { Contract, PortfolioContract, PortfolioResponse } from '../types/deriv';
import { AlertCircle, RefreshCcw, History, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

export const OrdersPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  const mapPortfolioContractToContract = (pc: PortfolioContract): Contract => ({
    contract_id: pc.contract_id,
    contract_type: pc.contract_type,
    date_start: pc.purchase_time,
    date_expiry: pc.expiry_time,
    display_name: pc.longcode,
    buy_price: pc.buy_price,
    payout: pc.payout,
    status: 'open', // Portfolio contracts are always open
    underlying_symbol: pc.symbol
  });

  const fetchContracts = () => {
    setIsLoading(true);
    setError(null);
    // First authorize
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));
  };

  const refreshContracts = () => {
    fetchContracts();
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      setError(response.error.message);
      setIsLoading(false);
      return;
    }

    // After authorization, fetch portfolio
    if (response.authorize) {
      console.log("Authorized, fetching portfolio...");
      sendMessage(JSON.stringify({
        portfolio: 1
      }));
    }

    // Handle portfolio response
    if (response.portfolio) {
      console.log("Received portfolio response:", response);
      const portfolioResponse = response as PortfolioResponse;
      const mappedContracts = (portfolioResponse.portfolio.contracts || [])
        .map(mapPortfolioContractToContract);
      setContracts(mappedContracts);
      setIsLoading(false);
    }
  }, [lastMessage, sendMessage]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading orders</span>
          </div>
          <p className="text-red-600 dark:text-red-300">
            {error}
            {error.includes('InvalidToken') && (
              <span className="block mt-2">
                Please ensure you have set a valid API token in the code.
              </span>
            )}
          </p>
          <button
            onClick={refreshContracts}
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Orders</h2>
          <div className="animate-spin">
            <RefreshCcw className="w-5 h-5" />
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-secondary-light dark:bg-secondary-dark rounded-lg p-6">
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <button
          onClick={refreshContracts}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      {contracts.length === 0 ? (
        <div className="text-center py-12 bg-secondary-light dark:bg-secondary-dark rounded-lg">
          <div className="mb-4">
            <History className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You don't have any trading orders at the moment.
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
        <div className="space-y-4">
          {contracts.map((contract) => (
            <ContractCard key={contract.contract_id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
};