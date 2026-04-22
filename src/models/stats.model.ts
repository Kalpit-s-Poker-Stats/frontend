export interface SessionRow {
  date: string;
  buy_in_amount: number;
  buy_out_amount: number;
  winnings: number;
}

export interface AggregateStats {
  total_pnl: number;
  average_pnl: number;
  biggest_win: number;
  date_of_biggest_win: string | null;
  biggest_loss: number;
  date_of_biggest_loss: string | null;
  win_rate: number;
  sessions_won: number;
  sessions_lost: number;
  total_sessions: number;
  total_buy_in: number;
  roi: number;
}

export interface StatsResponse {
  sessions: SessionRow[];
  stats: AggregateStats;
}
