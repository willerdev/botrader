import { ChevronDownIcon } from 'lucide-react';
import { ActiveSymbol } from '../types/deriv';

interface SymbolSelectorProps {
  symbols: ActiveSymbol[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const SymbolSelector = ({ symbols, selectedSymbol, onSelectSymbol }: SymbolSelectorProps) => {
  return (
    <div className="relative w-full">
      <select
        className="w-full p-2 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer pr-10"
        value={selectedSymbol}
        onChange={(e) => onSelectSymbol(e.target.value)}
      >
        {symbols.map((symbol) => (
          <option key={symbol.symbol} value={symbol.symbol}>
            {symbol.display_name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
    </div>
  );
};