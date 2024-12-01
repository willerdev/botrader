import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TradeFormProps {
  symbol: string;
  displayName: string;
  onTrade: (type: 'CALL' | 'PUT', amount: number, duration: number) => void;
}

export const TradeForm = ({ symbol, displayName, onTrade }: TradeFormProps) => {
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-secondary-dark rounded-lg shadow-sm">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-medium">{displayName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{symbol}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount (USD)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border rounded p-2 dark:bg-secondary-dark dark:border-gray-700"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border rounded p-2 dark:bg-secondary-dark dark:border-gray-700"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onTrade('CALL', amount, duration)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <ArrowUpCircle size={20} />
              Call
            </button>
            
            <button
              onClick={() => onTrade('PUT', amount, duration)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <ArrowDownCircle size={20} />
              Put
            </button>
          </div>
        </div>
      )}
    </div>
  );
};