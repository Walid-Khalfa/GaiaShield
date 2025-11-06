import { useEffect, useState, memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Users, Zap, Globe, Moon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BaseResponse } from '@/lib/api';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard = memo(function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'} className="mt-2">
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
});

interface MonitoringMetrics {
  totalAnalyses: number;
  avgResponseTime: number;
  successRate: number;
  activeUsers: number;
  darkModeUsers: number;
  languageDistribution: { fr: number; en: number };
}

interface ModuleChartDatum {
  name: string;
  value: number;
}

interface RiskChartDatum {
  name: string;
  value: number;
  color: string;
}

interface TimelineChartDatum {
  date: string;
  analyses: number;
}

type HistoryModule = 'climate' | 'business' | 'cyber';

interface StoredAlert {
  module: HistoryModule;
  result?: Pick<BaseResponse, 'risk_level'>;
  timestamp: number;
}

const isStoredAlert = (item: unknown): item is StoredAlert => {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<StoredAlert>;
  return (
    candidate.module === 'climate' ||
    candidate.module === 'business' ||
    candidate.module === 'cyber'
  );
};

const parseAlerts = (raw: unknown): StoredAlert[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .filter(isStoredAlert)
    .map(alert => {
      const timestamp =
        typeof alert.timestamp === 'number'
          ? alert.timestamp
          : Date.parse(alert.timestamp);
      return {
        module: alert.module,
        result: alert.result,
        timestamp,
      };
    })
    .filter(alert => Number.isFinite(alert.timestamp));
};

export const MonitoringDashboard = memo(function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    totalAnalyses: 0,
    avgResponseTime: 0,
    successRate: 100,
    activeUsers: 1,
    darkModeUsers: 0,
    languageDistribution: { fr: 0, en: 0 },
  });
  const [moduleData, setModuleData] = useState<ModuleChartDatum[]>([]);
  const [riskData, setRiskData] = useState<RiskChartDatum[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineChartDatum[]>([]);

  useEffect(() => {
    // Load metrics from localStorage
    const loadMetrics = () => {
      const history = localStorage.getItem('alertHistory');
      const darkMode = localStorage.getItem('darkMode') === 'true';
      const language = localStorage.getItem('gaiashield_language') || 'fr';

      if (history) {
        try {
          const alertsRaw = JSON.parse(history);
          const alerts = parseAlerts(alertsRaw);
          
          // Count by module
          const moduleCounts: Record<HistoryModule, number> = { climate: 0, business: 0, cyber: 0 };
          const riskCounts: Record<'low' | 'medium' | 'high' | 'unknown', number> = {
            low: 0,
            medium: 0,
            high: 0,
            unknown: 0,
          };
          
          alerts.forEach((alert) => {
            moduleCounts[alert.module] += 1;
            
            const risk = alert.result?.risk_level ?? 'unknown';
            if (riskCounts[risk as keyof typeof riskCounts] !== undefined) {
              riskCounts[risk as keyof typeof riskCounts] += 1;
            } else {
              riskCounts.unknown += 1;
            }
          });
          
          setModuleData([
            { name: 'Climate Guard', value: moduleCounts.climate },
            { name: 'Business Shield', value: moduleCounts.business },
            { name: 'CyberProtect', value: moduleCounts.cyber },
          ]);
          
          setRiskData([
            { name: 'Faible', value: riskCounts.low, color: '#22c55e' },
            { name: 'Moyen', value: riskCounts.medium, color: '#f59e0b' },
            { name: 'Élevé', value: riskCounts.high, color: '#ef4444' },
            { name: 'Inconnu', value: riskCounts.unknown, color: '#6b7280' },
          ]);
          
          // Timeline data (last 7 days)
          const now = Date.now();
          const dayMs = 24 * 60 * 60 * 1000;
          const timeline = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now - (6 - i) * dayMs);
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            const dayEnd = dayStart + dayMs;
            const count = alerts.filter((alert) => alert.timestamp >= dayStart && alert.timestamp < dayEnd).length;
            return {
              date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
              analyses: count,
            };
          });
          setTimelineData(timeline);
          
          setMetrics(prev => ({
            ...prev,
            totalAnalyses: alerts.length,
            darkModeUsers: darkMode ? 1 : 0,
            languageDistribution: {
              fr: language === 'fr' ? 1 : 0,
              en: language === 'en' ? 1 : 0,
            },
          }));
        } catch (e) {
          console.error('Failed to parse alert history', e);
        }
      }
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const sentryConfigured = useMemo(() => import.meta.env.VITE_SENTRY_DSN, []);
  const posthogConfigured = useMemo(() => import.meta.env.VITE_POSTHOG_KEY, []);
  const isDev = useMemo(() => import.meta.env.DEV, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tableau de Bord Monitoring</h2>
        <p className="text-muted-foreground">
          Métriques en temps réel de l'utilisation de GaiaShield
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Analyses Totales"
          value={metrics.totalAnalyses}
          description="Nombre total d'analyses effectuées"
          icon={<Activity className="h-4 w-4" />}
          trend={metrics.totalAnalyses > 0 ? 'up' : 'stable'}
        />

        <MetricCard
          title="Taux de Succès"
          value={`${metrics.successRate}%`}
          description="Analyses réussies sans erreur"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="stable"
        />

        <MetricCard
          title="Utilisateurs Actifs"
          value={metrics.activeUsers}
          description="Sessions actives actuellement"
          icon={<Users className="h-4 w-4" />}
          trend="stable"
        />

        <MetricCard
          title="Temps de Réponse Moyen"
          value={`${metrics.avgResponseTime}ms`}
          description="Latence moyenne des analyses"
          icon={<Zap className="h-4 w-4" />}
          trend="stable"
        />

        <MetricCard
          title="Mode Sombre"
          value={metrics.darkModeUsers > 0 ? 'Activé' : 'Désactivé'}
          description="Préférence de thème utilisateur"
          icon={<Moon className="h-4 w-4" />}
        />

        <MetricCard
          title="Langue"
          value={metrics.languageDistribution.fr > 0 ? 'Français' : 'English'}
          description="Langue de l'interface"
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Analyses par Module</CardTitle>
            <CardDescription>Répartition des analyses effectuées</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moduleData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Distribution des Risques</CardTitle>
            <CardDescription>Niveaux de risque détectés</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Évolution des Analyses</CardTitle>
          <CardDescription>Analyses effectuées sur les 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="analyses" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Informations de Monitoring</CardTitle>
          <CardDescription>
            Configuration des outils de suivi et d'analyse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sentry Error Tracking</p>
              <p className="text-sm text-muted-foreground">
                {sentryConfigured ? '✅ Configuré' : '⚠️ Non configuré'}
              </p>
            </div>
            <Badge variant={sentryConfigured ? 'default' : 'secondary'}>
              {sentryConfigured ? 'Actif' : 'Inactif'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">PostHog Analytics</p>
              <p className="text-sm text-muted-foreground">
                {posthogConfigured ? '✅ Configuré' : '⚠️ Non configuré'}
              </p>
            </div>
            <Badge variant={posthogConfigured ? 'default' : 'secondary'}>
              {posthogConfigured ? 'Actif' : 'Inactif'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Environment</p>
              <p className="text-sm text-muted-foreground">
                Mode de déploiement actuel
              </p>
            </div>
            <Badge variant={isDev ? 'secondary' : 'default'}>
              {isDev ? 'Development' : 'Production'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
