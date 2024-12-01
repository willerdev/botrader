import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { PriceCard } from '../components/PriceCard';
import { TradeForm } from '../components/TradeForm';
import { TradeStatus } from '../components/TradeStatus';
import { ActiveSymbol, TickResponse, BuyResponse } from '../types/deriv';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
const API_TOKEN = "WNrbiV9dFgXktno";

interface PriceData {
  current: number;
  previous: number | null;
}

export const TradePage = () => {
  const [activeSymbols, setActiveSymbols] = useState<ActiveSymbol[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTrade, setCurrentTrade] = useState<BuyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set());

  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  // Cleanup function for subscriptions
  const unsubscribeFromTicks = () => {
    if (subscribedSymbols.size > 0) {
      sendMessage(JSON.stringify({
        forget_all: 'ticks'
      }));
      setSubscribedSymbols(new Set());
    }
  };

  // Initialize connection and fetch symbols
  useEffect(() => {
    sendMessage(JSON.stringify({
      authorize: API_TOKEN
    }));

    sendMessage(JSON.stringify({
      active_symbols: 'brief',
      product_type: 'basic'
    }));

    // Cleanup subscriptions when component unmounts
    return () => {
      unsubscribeFromTicks();
    };
  }, [sendMessage]);

  // Subscribe to ticks for a symbol
  const subscribeToSymbol = (symbol: string) => {
    if (!subscribedSymbols.has(symbol)) {
      sendMessage(JSON.stringify({
        ticks: symbol,
        subscribe: 1
      }));
      setSubscribedSymbols(prev => new Set([...prev, symbol]));
    }
  };

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage?.data) return;
    
    const response = JSON.parse(lastMessage.data);

    if (response.error) {
      // Ignore "AlreadySubscribed" errors
      if (response.error.code === 'AlreadySubscribed') {
        return;
      }
      setError(response.error.message);
      return;
    }

    if (response.authorize) {
      setIsAuthorized(true);
      setError(null);
    }

    if (response.active_symbols) {
      // Cleanup existing subscriptions before setting new symbols
      unsubscribeFromTicks();

      const volatilitySymbols = response.active_symbols
        .filter((symbol: ActiveSymbol) => symbol.market === 'synthetic_index')
        .slice(0, 20);
      setActiveSymbols(volatilitySymbols);
      
      // Subscribe to ticks for all symbols
      volatilitySymbols.forEach((symbol: ActiveSymbol) => {
        subscribeToSymbol(symbol.symbol);
      });
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

    if (response.buy) {
      setCurrentTrade(response as BuyResponse);
    }

  }, [lastMessage, sendMessage]);

  const handleTrade = (tradeType: 'CALL' | 'PUT', amount: number, duration: number) => {
    if (!selectedSymbol) return;

    const tradeRequest = {
      buy: 1,
      price: amount,
      parameters: {
        amount: amount,
        basis: "stake",
        contract_type: tradeType,
        currency: "USD",
        duration: duration,
        duration_unit: "m",
        symbol: selectedSymbol
      }
    };
    
    sendMessage(JSON.stringify(tradeRequest));
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeSymbols.map((symbol) => (
          <PriceCard
            key={symbol.symbol}
            symbol={symbol.symbol}
            displayName={symbol.display_name}
            price={prices[symbol.symbol]?.current || 0}
            previousPrice={prices[symbol.symbol]?.previous || undefined}
            onClick={() => handleSymbolSelect(symbol.symbol)}
          />
        ))}
      </div>

      {selectedSymbol && isAuthorized && (
        <div className="max-w-2xl mx-auto">
          <TradeForm 
            symbol={selectedSymbol}
            displayName={activeSymbols.find(s => s.symbol === selectedSymbol)?.display_name || selectedSymbol}
            onTrade={handleTrade}
          />
          
          {currentTrade && <TradeStatus trade={currentTrade} />}
        </div>
      )}
    </div>
  );
};