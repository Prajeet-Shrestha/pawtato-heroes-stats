export interface WeeklyData {
  weekStartTimestamp: number;
  weekEndTimestamp: number;
  weekStart: string;
  weekEnd: string;
  count: number;
  weekNumber: number;
}

export interface HeroMintedEvent {
  digest: string;
  hero_id: string;
  timestamp: number;
  is_paid: boolean;
  phase: number;
}

export interface SuiPaidAmountEntry {
  amount: number;
  timestamp: number;
}

export interface HeroMintedData {
  total_hero_minted: number;
  total_sui_paid: number;
  total_paid_hero_minted: number;
  weekly_hero_minted: WeeklyData[];
  player_hero_minted: Record<string, HeroMintedEvent[]>;
  player_sui_paid_chart: Record<string, number>;
  tx_time_chart: Record<string, number>;
  phase_time_chart: Record<number, number[]>;
  sui_paid_amount_chart: SuiPaidAmountEntry[];
}

export interface MetricsData {
  HeroMinted: HeroMintedData;
}
