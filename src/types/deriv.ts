export interface TickResponse {
  tick?: {
    quote: number;
    symbol: string;
    epoch: number;
  };
  ticks?: {
    quote: number;
    symbol: string;
    epoch: number;
  }[];
}

export interface ActiveSymbol {
  symbol: string;
  display_name: string;
  market: string;
  market_display_name: string;
}

export interface AuthResponse {
  authorize: {
    email: string;
    currency: string;
    balance: number;
    loginid: string;
  };
}

export interface BuyResponse {
  buy: {
    contract_id: number;
    longcode: string;
    start_time: number;
    transaction_id: number;
    buy_price: number;
    payout: number;
  };
}

export interface Contract {
  contract_id: number;
  contract_type: string;
  date_start: number;
  date_expiry: number;
  display_name: string;
  buy_price: number;
  payout: number;
  status: 'won' | 'lost' | 'open';
  underlying_symbol: string;
}

export interface PortfolioContract {
  contract_id: number;
  currency: string;
  date_start: number;
  expiry_time: number;
  contract_type: string;
  longcode: string;
  payout: number;
  purchase_time: number;
  symbol: string;
  buy_price: number;
}

export interface PortfolioResponse {
  portfolio: {
    contracts: PortfolioContract[];
    total: number;
  };
}

export interface ProposalOpenContractResponse extends Contract {
  barrier: string;
  bid_price: number;
  buy_price: number;
  contract_id: number;
  contract_type: string;
  currency: string;
  current_spot: number;
  current_spot_display_value: string;
  current_spot_time: number;
  date_expiry: number;
  date_settlement: number;
  date_start: number;
  display_name: string;
  entry_spot: number;
  entry_tick: number;
  entry_tick_display_value: string;
  entry_tick_time: number;
  exit_tick: number;
  exit_tick_display_value: string;
  exit_tick_time: number;
  high_barrier: string;
  is_expired: number;
  is_forward_starting: number;
  is_intraday: number;
  is_path_dependent: number;
  is_settleable: number;
  is_sold: number;
  is_valid_to_cancel: number;
  is_valid_to_sell: number;
  low_barrier: string;
  payout: number;
  profit: number;
  profit_percentage: number;
  purchase_time: number;
  sell_price: number;
  sell_spot: number;
  sell_spot_display_value: string;
  sell_spot_time: number;
  sell_time: number;
  status: 'won' | 'lost' | 'open';
  transaction_ids: {
    buy: number;
    sell?: number;
  };
  underlying_symbol: string;
}