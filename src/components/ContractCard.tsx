import { Contract } from '../types/deriv';
import { Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface ContractCardProps {
  contract: Contract;
}

export const ContractCard = ({ contract }: ContractCardProps) => {
  const isWin = contract.status === 'won';
  const isLoss = contract.status === 'lost';
  const isOpen = contract.status === 'open';

  const getStatusColor = () => {
    if (isWin) return 'text-green-600';
    if (isLoss) return 'text-red-600';
    return 'text-blue-600';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-secondary-dark rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{contract.display_name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contract.contract_type === 'CALL' ? (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Rise
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4" /> Fall
              </span>
            )}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Buy Price
          </span>
          <span className="font-medium">${contract.buy_price}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Payout
          </span>
          <span className="font-medium">${contract.payout}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Start Time
          </span>
          <span className="font-medium">{formatDate(contract.date_start)}</span>
        </div>

        {!isOpen && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> End Time
            </span>
            <span className="font-medium">{formatDate(contract.date_expiry)}</span>
          </div>
        )}
      </div>
    </div>
  );
};