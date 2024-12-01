import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { ArrowRight, BarChart2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

interface Market {
  symbol: string;
  display_name: string;
  market_display_name: string;
}

const INITIAL_MARKET_COUNT = 6;
const MARKETS_INCREMENT = 6;

export const MarketView = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [tickData, setTickData] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [visibleMarkets, setVisibleMarkets] = useState(INITIAL_MARKET_COUNT);
  const [showAll, setShowAll] = useState(false);

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    // Authorize and request markets
    sendMessage(JSON.stringify({ authorize: API_TOKEN }));
    sendMessage(JSON.stringify({
      active_symbols: 'brief'
    }));
  }, [sendMessage]);

  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      setError(response.error.message);
    } else if (response.active_symbols) {
      setMarkets(response.active_symbols);
    } else if (response.tick) {
      const { symbol, quote } = response.tick;
      setTickData(prev => ({
        ...prev,
        [symbol]: quote,
      }));
    }
  }, [lastMessage]);

  const handleMarketSelection = (symbol: string) => {
    setSelectedMarket(symbol);
    // Subscribe to ticks for the selected market
    sendMessage(JSON.stringify({
      forget_all: 'ticks',
    }));
    sendMessage(JSON.stringify({
      ticks: symbol,
      subscribe: 1
    }));
  };

  const handleShowMore = () => {
    if (showAll) {
      setVisibleMarkets(INITIAL_MARKET_COUNT);
    } else {
      setVisibleMarkets(prev => Math.min(prev + MARKETS_INCREMENT, markets.length));
    }
    setShowAll(!showAll);
  };

  const visibleMarketsList = markets.slice(0, visibleMarkets);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <BarChart2 className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Market View</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Markets List */}
        <div className="lg:col-span-1 bg-white dark:bg-secondary-dark rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Available Markets</h3>
          {markets.length === 0 ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {visibleMarketsList.map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => handleMarketSelection(market.symbol)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedMarket === market.symbol
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{market.display_name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {market.market_display_name}
                    </span>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${
                    selectedMarket === market.symbol
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400'
                  }`} />
                </button>
              ))}

              {markets.length > INITIAL_MARKET_COUNT && (
                <button
                  onClick={handleShowMore}
                  className="w-full mt-4 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show More Markets
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Market Details */}
        <div className="lg:col-span-2">
          {selectedMarket ? (
            <div className="bg-white dark:bg-secondary-dark rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-6">
                {markets.find(m => m.symbol === selectedMarket)?.display_name}
              </h3>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Current Price
                  </div>
                  <div className="text-3xl font-bold">
                    ${tickData[selectedMarket]?.toFixed(5) || "Loading..."}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Market
                    </div>
                    <div className="font-medium">
                      {markets.find(m => m.symbol === selectedMarket)?.market_display_name}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Symbol
                    </div>
                    <div className="font-medium">
                      {selectedMarket}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-secondary-dark rounded-lg shadow p-6 flex flex-col items-center justify-center h-full text-center">
              <BarChart2 className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Select a Market
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Choose a market from the list to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};