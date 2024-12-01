import { BuyResponse } from '../types/deriv';

interface TradeStatusProps {
  trade: BuyResponse;
}

export const TradeStatus = ({ trade }: TradeStatusProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Trade Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Contract ID:</span>
          <span className="font-medium">{trade.buy.contract_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Buy Price:</span>
          <span className="font-medium">${trade.buy.buy_price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payout:</span>
          <span className="font-medium">${trade.buy.payout}</span>
        </div>
      </div>
    </div>
  );
};