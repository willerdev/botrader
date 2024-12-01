import { Wallet, DollarSign, TrendingUp, BarChart } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  availableBalance: number;
  equity: number;
  marginUsage: number;
  currency: string;
}

export const BalanceCard = ({
  totalBalance,
  availableBalance,
  equity,
  marginUsage,
  currency
}: BalanceCardProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-secondary-dark rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        Account Balance
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            Total Balance
          </div>
          <div className="text-xl font-semibold">
            {formatAmount(totalBalance)}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            Available Balance
          </div>
          <div className="text-xl font-semibold">
            {formatAmount(availableBalance)}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            Equity
          </div>
          <div className="text-xl font-semibold">
            {formatAmount(equity)}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <BarChart className="w-4 h-4" />
            Margin Usage
          </div>
          <div className="text-xl font-semibold">
            {marginUsage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};