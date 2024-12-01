import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface PriceCardProps {
  symbol: string;
  displayName: string;
  price: number;
  previousPrice?: number;
  onClick?: () => void;
}

export const PriceCard = ({ displayName, price, previousPrice, onClick }: PriceCardProps) => {
  const priceChange = previousPrice ? price - previousPrice : 0;
  const isPositive = priceChange >= 0;

  return (
    <div 
      className="bg-white dark:bg-secondary-dark rounded-lg p-4 shadow-sm w-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400 font-medium mb-1">{displayName}</span>
        <div className={`flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange !== 0 && (
            isPositive ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />
          )}
          <span className="text-lg font-bold">{price.toFixed(5)}</span>
        </div>
      </div>
    </div>
  );
};