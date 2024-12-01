import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { PriceCard } from '../components/PriceCard';
import { TradingViewWidget } from '../components/TradingViewWidget';
import { ActiveSymbol, TickResponse } from '../types/deriv';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";
const DEFAULT_VISIBLE_PAIRS = 3;

interface PriceData {
  current: number;
  previous: number | null;
}

export const TradePage = () => {
  const [activeSymbols, setActiveSymbols] = useState<ActiveSymbol[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set());
  const [showAllPairs, setShowAllPairs] = useState(false);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  const visibleSymbols = showAllPairs 
    ? activeSymbols 
    : activeSymbols.slice(0, DEFAULT_VISIBLE_PAIRS);

  const unsubscribeFromTicks = () => {
    if (subscribedSymbols.size > 0) {
      sendMessage(JSON.stringify({
        forget_all: 'ticks'
      }));
      setSubscribedSymbols(new Set());
    }
  };

  useEffect(() => {
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));

    sendMessage(JSON.stringify({
      active_symbols: 'brief',
      product_type: 'basic'
    }));

    return () => {
      unsubscribeFromTicks();
    };
  }, [sendMessage]);

  const subscribeToSymbol = (symbol: string) => {
    if (!subscribedSymbols.has(symbol)) {
      sendMessage(JSON.stringify({
        ticks: symbol,
        subscribe: 1
      }));
      setSubscribedSymbols(prev => new Set([...prev, symbol]));
    }
  };

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      if (response.error.code === 'AlreadySubscribed') {
        return;
      }
      setError(response.error.message);
      return;
    }

    if (response.active_symbols) {
      unsubscribeFromTicks();

      const volatilitySymbols = response.active_symbols
        .filter((symbol: ActiveSymbol) => symbol.market === 'synthetic_index')
        .slice(0, 20);
      setActiveSymbols(volatilitySymbols);
      
      volatilitySymbols.forEach((symbol: ActiveSymbol) => {
        subscribeToSymbol(symbol.symbol);
      });

      if (!selectedSymbol && volatilitySymbols.length > 0) {
        setSelectedSymbol(volatilitySymbols[0].symbol);
      }
    }

    if (response.tick) {
      const tickResponse = response as TickResponse;
      if (tickResponse.tick?.quote) {
        setPrices(prev => ({
          ...prev,
          [tickResponse.tick!.symbol]: {
            previous: prev[tickResponse.tick!.symbol]?.current || null,
            current: tickResponse.tick!.quote
          }
        }));
      }
    }
  }, [lastMessage, sendMessage]);

  if (error) {
    return (
      <div className="content-container">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Market pairs */}
        <div className="lg:col-span-1 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Market Pairs</h2>
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-4">
              {visibleSymbols.map((symbol) => (
                <PriceCard
                  key={symbol.symbol}
                  symbol={symbol.symbol}
                  displayName={symbol.display_name}
                  price={prices[symbol.symbol]?.current || 0}
                  previousPrice={prices[symbol.symbol]?.previous || undefined}
                  onClick={() => setSelectedSymbol(symbol.symbol)}
                />
              ))}
            </div>
            
            {activeSymbols.length > DEFAULT_VISIBLE_PAIRS && (
              <button
                onClick={() => setShowAllPairs(!showAllPairs)}
                className="w-full flex items-center justify-center gap-2 p-2 mt-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showAllPairs ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More Pairs <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right column - Chart */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          {selectedSymbol ? (
            <div className="h-full flex flex-col bg-white dark:bg-secondary-dark rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">
                  {activeSymbols.find(s => s.symbol === selectedSymbol)?.display_name}
                </h2>
                <div className="text-2xl font-bold mt-2">
                  ${prices[selectedSymbol]?.current.toFixed(5)}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <TradingViewWidget symbol={selectedSymbol} />
              </div>
            </div>
          ) : (
            <div className="h-full bg-white dark:bg-secondary-dark rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a market pair to view the chart
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};