import React, { useMemo } from "react";
import StatCard from "./StatCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import MultiLineChart from "./MultiLineChart";
import Table from "./Table";
import type { MetricsData } from "../types";
import metricsData from "../result_metrics_pawtato_final.json";
import "./Dashboard.css";

// Phase labels constant
const PHASE_LABELS: Record<number, string> = {
  0: "Team Mints",
  1: "Whitelist 1",
  2: "Whitelist 2",
  3: "Whitelist 3",
  100: "Public Mint",
};

const Dashboard: React.FC = () => {
  const data: MetricsData = metricsData as MetricsData;
  const heroMinted = data.HeroMinted;

  // Copy to clipboard handler
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show temporary feedback
      const btn = document.activeElement as HTMLElement;
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = "✓";
        btn.style.color = "#48bb78";
        setTimeout(() => {
          btn.textContent = originalText || "";
          btn.style.color = "";
        }, 1000);
      }
    });
  };

  // Calculate additional metrics
  const playerCount = useMemo(() => {
    return Object.keys(heroMinted.player_hero_minted).length;
  }, [heroMinted.player_hero_minted]);

  const averageHeroesPerPlayer = useMemo(() => {
    return heroMinted.total_hero_minted / playerCount;
  }, [heroMinted.total_hero_minted, playerCount]);

  const averageSuiPaid = useMemo(() => {
    return heroMinted.total_sui_paid / heroMinted.total_paid_hero_minted;
  }, [heroMinted.total_sui_paid, heroMinted.total_paid_hero_minted]);

  // Calculate unpaid heroes
  const totalUnpaidHeroes = useMemo(() => {
    return heroMinted.total_hero_minted - heroMinted.total_paid_hero_minted;
  }, [heroMinted.total_hero_minted, heroMinted.total_paid_hero_minted]);

  // Phase distribution
  const phaseDistribution = useMemo(() => {
    const phases: Record<string, number> = {};
    Object.values(heroMinted.player_hero_minted).forEach((events) => {
      events.forEach((event) => {
        const phaseLabel = PHASE_LABELS[event.phase] || `Phase ${event.phase}`;
        phases[phaseLabel] = (phases[phaseLabel] || 0) + 1;
      });
    });
    return phases;
  }, [heroMinted.player_hero_minted]);

  // Top players by hero count
  const topPlayers = useMemo(() => {
    const playerCounts = Object.entries(heroMinted.player_hero_minted)
      .map(([address, events]) => ({
        address: `${address.slice(0, 6)}...${address.slice(-4)}`,
        count: events.length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    return playerCounts;
  }, [heroMinted.player_hero_minted]);

  // Top players by SUI paid (for pie chart)
  const topPlayersBySui = useMemo(() => {
    const playerSui = Object.entries(heroMinted.player_sui_paid_chart)
      .map(([address, sui]) => ({
        address: `${address.slice(0, 6)}...${address.slice(-4)}`,
        sui,
      }))
      .sort((a, b) => b.sui - a.sui)
      .slice(0, 10);
    return playerSui;
  }, [heroMinted.player_sui_paid_chart]);

  // All players data for table
  const allPlayersData = useMemo(() => {
    return Object.entries(heroMinted.player_sui_paid_chart)
      .map(([address, sui], index) => ({
        rank: index + 1,
        address: address,
        shortAddress: `${address.slice(0, 10)}...${address.slice(-8)}`,
        sui: sui,
        heroCount: heroMinted.player_hero_minted[address]?.length || 0,
      }))
      .sort((a, b) => b.sui - a.sui)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }, [heroMinted.player_sui_paid_chart, heroMinted.player_hero_minted]);

  // Process transaction timeline data - group by minute
  const txTimelineData = useMemo(() => {
    const minuteTxCount: Map<number, { label: string; count: number }> = new Map();

    Object.values(heroMinted.tx_time_chart).forEach((timestamp) => {
      const date = new Date(timestamp);
      // Round down to the minute
      const minuteTimestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const label = `${monthNames[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes}`;

      if (minuteTxCount.has(minuteTimestamp)) {
        const existing = minuteTxCount.get(minuteTimestamp)!;
        existing.count += 1;
      } else {
        minuteTxCount.set(minuteTimestamp, { label, count: 1 });
      }
    });

    // Sort by timestamp
    const sortedEntries = Array.from(minuteTxCount.entries()).sort((a, b) => a[0] - b[0]);

    // Get start and end times
    const totalTxCount = Object.keys(heroMinted.tx_time_chart).length;
    const timestamps = Object.values(heroMinted.tx_time_chart);
    const startTimestamp = Math.min(...timestamps);
    const endTimestamp = Math.max(...timestamps);

    const formatDateTime = (timestamp: number) => {
      const date = new Date(timestamp);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${monthNames[date.getMonth()]} ${date.getDate()}, 2025 ${hours}:${minutes}:${seconds}`;
    };

    return {
      labels: sortedEntries.map(([, data]) => data.label),
      data: sortedEntries.map(([, data]) => data.count),
      totalCount: totalTxCount,
      startTime: formatDateTime(startTimestamp),
      endTime: formatDateTime(endTimestamp),
    };
  }, [heroMinted.tx_time_chart]);

  // Process phase-wise timeline data
  const phaseTimelineData = useMemo(() => {
    const phaseColors = [
      { border: "rgba(34, 197, 94, 1)", bg: "rgba(34, 197, 94, 0.2)" }, // Green - Phase 1
      { border: "rgba(59, 130, 246, 1)", bg: "rgba(59, 130, 246, 0.2)" }, // Blue - Phase 2
      { border: "rgba(168, 85, 247, 1)", bg: "rgba(168, 85, 247, 0.2)" }, // Purple - Phase 3
      { border: "rgba(249, 115, 22, 1)", bg: "rgba(249, 115, 22, 0.2)" }, // Orange - Phase 4
      { border: "rgba(236, 72, 153, 1)", bg: "rgba(236, 72, 153, 0.2)" }, // Pink - Phase 5
    ];

    // Collect all unique minute timestamps across all phases
    const allMinuteTimestamps = new Set<number>();
    const phaseMinuteCounts: Map<number, Map<number, number>> = new Map();

    // Process each phase
    Object.entries(heroMinted.phase_time_chart).forEach(([phase, timestamps]) => {
      const phaseNum = Number(phase);
      const minuteCounts = new Map<number, number>();

      timestamps.forEach((timestamp) => {
        const date = new Date(timestamp);
        const minuteTimestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();

        allMinuteTimestamps.add(minuteTimestamp);
        minuteCounts.set(minuteTimestamp, (minuteCounts.get(minuteTimestamp) || 0) + 1);
      });

      phaseMinuteCounts.set(phaseNum, minuteCounts);
    });

    // Sort all timestamps
    const sortedTimestamps = Array.from(allMinuteTimestamps).sort((a, b) => a - b);

    // Create labels
    const labels = sortedTimestamps.map((timestamp) => {
      const date = new Date(timestamp);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes}`;
    });

    // Create datasets for each phase
    const datasets = Array.from(phaseMinuteCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([phase, counts]) => {
        // Ensure positive index (handle phase 0 or negative phases)
        const colorIndex = (((phase - 1) % phaseColors.length) + phaseColors.length) % phaseColors.length;
        const color = phaseColors[colorIndex];

        return {
          label: PHASE_LABELS[phase] || `Phase ${phase}`,
          data: sortedTimestamps.map((timestamp) => counts.get(timestamp) || 0),
          borderColor: color.border,
          backgroundColor: color.bg,
        };
      });

    return { labels, datasets };
  }, [heroMinted.phase_time_chart]);

  // Process SUI paid amount timeline data - group by minute
  const suiPaidTimelineData = useMemo(() => {
    const minuteSuiAmount: Map<number, { label: string; amount: number }> = new Map();
    let totalSuiPaid = 0;

    heroMinted.sui_paid_amount_chart.forEach(({ amount, timestamp }) => {
      totalSuiPaid += amount;
      const date = new Date(timestamp);
      // Round down to the minute
      const minuteTimestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const label = `${monthNames[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes}`;

      if (minuteSuiAmount.has(minuteTimestamp)) {
        const existing = minuteSuiAmount.get(minuteTimestamp)!;
        existing.amount += amount;
      } else {
        minuteSuiAmount.set(minuteTimestamp, { label, amount });
      }
    });

    // Sort by timestamp
    const sortedEntries = Array.from(minuteSuiAmount.entries()).sort((a, b) => a[0] - b[0]);

    return {
      labels: sortedEntries.map(([, data]) => data.label),
      data: sortedEntries.map(([, data]) => data.amount),
      totalSui: totalSuiPaid,
    };
  }, [heroMinted.sui_paid_amount_chart]);

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1 className='dashboard-title'>🐾 Pawtato Heroes Minting Analytics</h1>
      </header>

      {/* Total Stats Section */}
      <section className='stats-section'>
        <StatCard title='Total Heroes Minted' value={heroMinted.total_hero_minted} icon='🎮' subtitle='All minted heroes' />
        <StatCard title='Total SUI Paid' value={heroMinted.total_sui_paid} icon='💰' subtitle='Total SUI collected' />
        <StatCard title='Paid Heroes Minted' value={heroMinted.total_paid_hero_minted} icon='💳' subtitle='Heroes purchased' />
        <StatCard title='Total Players' value={playerCount} icon='👥' subtitle='Unique minters' />
        <StatCard title='Avg Heroes/Player' value={averageHeroesPerPlayer.toFixed(2)} icon='📊' subtitle='Average per player' />
        <StatCard title='Avg SUI Price' value={averageSuiPaid.toFixed(2)} icon='💵' subtitle='Average price paid' />
        <StatCard title='Total Transactions' value={Object.keys(heroMinted.tx_time_chart).length} icon='💵' subtitle='Total transactions' />
      </section>

      {/* Weekly Hero Minted Bar Chart */}
      <section className='charts-section'>
        <div className='chart-full-width'>
          <BarChart title='Weekly Hero Minted' labels={heroMinted.weekly_hero_minted.map((w) => w.weekStart)} data={heroMinted.weekly_hero_minted.map((w) => w.count)} />
        </div>
      </section>

      {/* Transaction Timeline - By Minute */}
      <section className='charts-section'>
        <div className='chart-full-width'>
          <div className='timeline-info-container'>
            <div className='timeline-info'>
              <div className='timeline-info-item'>
                <span className='timeline-info-label'>Total Transactions:</span>
                <span className='timeline-info-value'>{txTimelineData.totalCount.toLocaleString()}</span>
              </div>
              <div className='timeline-info-item'>
                <span className='timeline-info-label'>Start Time:</span>
                <span className='timeline-info-value'>{txTimelineData.startTime}</span>
              </div>
              <div className='timeline-info-item'>
                <span className='timeline-info-label'>End Time:</span>
                <span className='timeline-info-value'>{txTimelineData.endTime}</span>
              </div>
            </div>
          </div>
          <LineChart title='Transaction Timeline (By Minute)' labels={txTimelineData.labels} data={txTimelineData.data} backgroundColor='rgba(59, 130, 246, 0.2)' borderColor='rgba(59, 130, 246, 1)' />
        </div>
      </section>

      {/* Phase-wise Timeline */}
      <section className='charts-section'>
        <div className='chart-full-width'>
          <MultiLineChart title='Phase-wise Minting Timeline (By Minute)' labels={phaseTimelineData.labels} datasets={phaseTimelineData.datasets} />
        </div>
      </section>

      {/* SUI Paid Amount Timeline */}
      <section className='charts-section'>
        <div className='chart-full-width'>
          <div className='timeline-info-container'>
            <div className='timeline-info'>
              <div className='timeline-info-item'>
                <span className='timeline-info-label'>Total SUI Paid:</span>
                <span className='timeline-info-value'>{suiPaidTimelineData.totalSui.toLocaleString()} SUI</span>
              </div>
            </div>
          </div>
          <LineChart
            title='SUI Paid Amount Timeline (By Minute)'
            labels={suiPaidTimelineData.labels}
            data={suiPaidTimelineData.data}
            backgroundColor='rgba(34, 197, 94, 0.2)'
            borderColor='rgba(34, 197, 94, 1)'
          />
        </div>
      </section>

      {/* Paid vs Unpaid Heroes Distribution */}
      <section className='charts-section charts-row'>
        <div className='chart-half-width'>
          <PieChart
            title='Paid vs Unpaid Heroes'
            labels={["Paid Heroes", "Unpaid Heroes"]}
            data={[heroMinted.total_paid_hero_minted, totalUnpaidHeroes]}
            colors={["rgba(34, 197, 94, 0.8)", "rgba(148, 163, 184, 0.8)"]}
          />
        </div>
        <div className='chart-half-width'>
          <PieChart title='Heroes by Phase' labels={Object.keys(phaseDistribution)} data={Object.values(phaseDistribution)} />
        </div>
      </section>

      {/* Top Players by Heroes Minted */}
      <section className='charts-section'>
        <div className='chart-full-width'>
          <BarChart
            title='Top 10 Players by Heroes Minted'
            labels={topPlayers.map((p) => p.address)}
            data={topPlayers.map((p) => p.count)}
            backgroundColor='rgba(237, 100, 166, 0.8)'
            borderColor='rgba(237, 100, 166, 1)'
          />
        </div>
      </section>

      {/* Player SUI Paid Section */}
      <section className='player-sui-section'>
        <h2 className='section-title'>💰 Player SUI Contributions</h2>

        <div className='charts-section'>
          <div className='chart-center'>
            <PieChart
              title='Top 10 Players SUI Distribution'
              labels={topPlayersBySui.map((p) => p.address)}
              data={topPlayersBySui.map((p) => p.sui)}
              colors={[
                "rgba(102, 126, 234, 0.8)",
                "rgba(118, 75, 162, 0.8)",
                "rgba(237, 100, 166, 0.8)",
                "rgba(255, 154, 158, 0.8)",
                "rgba(250, 208, 196, 0.8)",
                "rgba(165, 94, 234, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 205, 86, 0.8)",
                "rgba(201, 203, 207, 0.8)",
                "rgba(54, 162, 235, 0.8)",
              ]}
            />
          </div>
        </div>

        <div className='table-section'>
          <Table
            title='All Players - SUI Paid'
            columns={[
              { key: "rank", label: "Rank", sortable: true },
              {
                key: "shortAddress",
                label: "Player Address",
                sortable: false,
                render: (value, row) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span title={row.address} style={{ fontFamily: "monospace", fontSize: "13px" }}>
                      {value}
                    </span>
                    <button className='copy-btn' onClick={() => copyToClipboard(row.address)} title='Copy full address' aria-label='Copy address to clipboard'>
                      📋
                    </button>
                  </div>
                ),
              },
              { key: "sui", label: "SUI Paid", sortable: true },
              { key: "heroCount", label: "Heroes Minted", sortable: true },
            ]}
            data={allPlayersData}
            itemsPerPage={15}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className='dashboard-footer'>
        <p>
          Created by{" "}
          <a href='https://vendettagame.xyz/' target='_blank' rel='noopener noreferrer' className='footer-link'>
            Vendetta
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
