import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { StatsService } from 'src/services/stats.service';
import { SessionRow, AggregateStats, StatsResponse } from 'src/models/stats.model';

type DateFilter = 'all' | 'week' | 'month' | 'year' | 'custom';

const EMPTY_STATS: AggregateStats = {
  total_pnl: 0, average_pnl: 0, biggest_win: 0, date_of_biggest_win: null,
  biggest_loss: 0, date_of_biggest_loss: null, win_rate: 0,
  sessions_won: 0, sessions_lost: 0, total_sessions: 0, total_buy_in: 0, roi: 0
};

@Component({
  selector: 'app-view-data-page',
  templateUrl: './view-data-page.component.html',
  styleUrls: ['./view-data-page.component.css']
})
export class ViewDataPageComponent implements OnInit {
  sessions: SessionRow[] = [];
  stats: AggregateStats = { ...EMPTY_STATS };
  allTimeStats: AggregateStats = { ...EMPTY_STATS };

  selectedFilter: DateFilter = 'all';
  customBegDate: string = '';
  customEndDate: string = '';
  pinStatsToAllTime = false;
  isLoading = true;
  hasNoData = false;

  lineChartOptions: any = {};
  cumulativeChartOptions: any = {};
  donutChartOptions: any = {};
  barChartOptions: any = {};

  private pnId = '';

  constructor(
    private authService: AuthService,
    private statsService: StatsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserSubject.value;
    if (!user?.pn_id) {
      this.router.navigate(['/']);
      return;
    }
    this.pnId = user.pn_id;
    this.loadStats();
  }

  get displayedStats(): AggregateStats {
    return this.pinStatsToAllTime ? this.allTimeStats : this.stats;
  }

  onFilterChange(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.isLoading = true;
    const { begDate, endDate } = this.getDateParams();

    this.statsService.getStats(this.pnId, begDate, endDate).subscribe({
      next: (res: StatsResponse) => {
        this.sessions = res.sessions;
        this.stats = res.stats;
        if (this.selectedFilter === 'all') {
          this.allTimeStats = res.stats;
        }
        this.hasNoData = res.sessions.length === 0;
        this.buildChartOptions();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasNoData = true;
      }
    });
  }

  private getDateParams(): { begDate?: string; endDate?: string } {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    switch (this.selectedFilter) {
      case 'week': {
        const beg = new Date(today); beg.setDate(today.getDate() - 7);
        return { begDate: fmt(beg), endDate: fmt(today) };
      }
      case 'month': {
        const beg = new Date(today); beg.setMonth(today.getMonth() - 1);
        return { begDate: fmt(beg), endDate: fmt(today) };
      }
      case 'year': {
        const beg = new Date(today); beg.setFullYear(today.getFullYear() - 1);
        return { begDate: fmt(beg), endDate: fmt(today) };
      }
      case 'custom':
        return {
          begDate: this.customBegDate || undefined,
          endDate: this.customEndDate || undefined
        };
      default:
        return {};
    }
  }

  private buildChartOptions(): void {
    const sorted = [...this.sessions].sort((a, b) => a.date.localeCompare(b.date));
    const fmtVal = (v: number) => '$' + Math.round(v * 100) / 100;
    const yAxisFmt = { labels: { formatter: (v: number) => '$' + v.toFixed(2) } };
    const scrollToolbar = {
      show: true,
      autoSelected: 'pan',
      tools: { download: false, selection: false, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true }
    };

    // Line chart — session winnings
    const discreteMarkers = sorted.map((s, i) => ({
      seriesIndex: 0,
      dataPointIndex: i,
      fillColor: s.winnings >= 0 ? '#4caf50' : '#f44336',
      strokeColor: s.winnings >= 0 ? '#4caf50' : '#f44336',
      size: 6
    }));
    this.lineChartOptions = {
      series: [{ name: 'Winnings', data: sorted.map(s => Math.round(s.winnings * 100) / 100) }],
      chart: { type: 'line', height: '100%', background: '#121212', toolbar: scrollToolbar, zoom: { enabled: true } },
      theme: { mode: 'dark' },
      xaxis: { categories: sorted.map(s => s.date), labels: { rotate: -45 } },
      yaxis: yAxisFmt,
      markers: { size: 6, discrete: discreteMarkers },
      stroke: { curve: 'smooth', colors: ['#BB86FC'] },
      colors: ['#BB86FC'],
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark', y: { formatter: fmtVal } },
      title: { text: 'Session Winnings', style: { color: '#fff' } }
    };

    // Cumulative P&L area chart
    let running = 0;
    const cumulative = sorted.map(s => { running += s.winnings; return Math.round(running * 100) / 100; });
    this.cumulativeChartOptions = {
      series: [{ name: 'Cumulative P&L', data: cumulative }],
      chart: { type: 'area', height: '100%', background: '#121212', toolbar: scrollToolbar, zoom: { enabled: true } },
      theme: { mode: 'dark' },
      xaxis: { categories: sorted.map(s => s.date), labels: { rotate: -45 } },
      yaxis: yAxisFmt,
      colors: ['#BB86FC'],
      fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark', y: { formatter: fmtVal } },
      title: { text: 'Cumulative P&L', style: { color: '#fff' } }
    };

    // Donut chart — win/loss ratio
    this.donutChartOptions = {
      series: [this.stats.sessions_won, this.stats.sessions_lost],
      chart: { type: 'donut', height: '100%', background: '#121212' },
      theme: { mode: 'dark' },
      labels: ['Winning Sessions', 'Losing Sessions'],
      colors: ['#4caf50', '#f44336'],
      dataLabels: { formatter: (val: number) => val.toFixed(1) + '%' },
      tooltip: { theme: 'dark' },
      title: { text: 'Win / Loss Ratio', style: { color: '#fff' } }
    };

    // Bar chart — monthly P&L
    const monthMap: Record<string, number> = {};
    for (const s of sorted) {
      const month = s.date.substring(0, 7);
      monthMap[month] = Math.round(((monthMap[month] || 0) + s.winnings) * 100) / 100;
    }
    const months = Object.keys(monthMap).sort();
    const monthlyValues = months.map(m => monthMap[m]);
    const barColors = monthlyValues.map(v => v >= 0 ? '#4caf50' : '#f44336');
    this.barChartOptions = {
      series: [{ name: 'Net P&L', data: monthlyValues }],
      chart: { type: 'bar', height: '100%', background: '#121212', toolbar: { show: false } },
      theme: { mode: 'dark' },
      xaxis: { categories: months },
      yaxis: yAxisFmt,
      colors: ['#BB86FC'],
      plotOptions: { bar: { distributed: true } },
      fill: { colors: barColors },
      dataLabels: { formatter: (v: number) => '$' + v.toFixed(2) },
      tooltip: { theme: 'dark', y: { formatter: fmtVal } },
      title: { text: 'Monthly P&L', style: { color: '#fff' } },
      legend: { show: false }
    };
  }

  sortColumn: keyof SessionRow = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  sortBy(col: keyof SessionRow): void {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
  }

  get sortedSessions(): SessionRow[] {
    return [...this.sessions].sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return this.sortDirection === 'asc' ? cmp : -cmp;
    });
  }
}
