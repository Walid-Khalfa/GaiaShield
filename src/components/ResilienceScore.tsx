import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import type { BaseResponse } from '@/lib/api';
import { generatePDFReport } from '@/lib/pdfExport';
import { useTranslation } from '@/lib/i18n';

interface ResilienceScoreProps {
  results: {
    climate?: BaseResponse | null;
    business?: BaseResponse | null;
    cyber?: BaseResponse | null;
  };
}

export function ResilienceScore({ results }: ResilienceScoreProps) {
  const { t } = useTranslation();
  const calculateGlobalScore = () => {
    const scores: number[] = [];
    
    // Climate score (inverse of risk level)
    if (results.climate?.risk_level) {
      const riskMap = { low: 90, medium: 60, high: 30, critical: 10 };
      scores.push(riskMap[results.climate.risk_level as keyof typeof riskMap] || 50);
    }
    
    // Business score (direct score if available)
    if (results.business?.score !== undefined) {
      scores.push(results.business.score);
    }
    
    // Cyber score (based on actions)
    if (results.cyber?.actions) {
      const maliciousCount = results.cyber.actions.filter(a => a.classification === 'malicious').length;
      const suspiciousCount = results.cyber.actions.filter(a => a.classification === 'suspicious').length;
      const total = results.cyber.actions.length;
      const cyberScore = total > 0 ? Math.max(0, 100 - (maliciousCount * 30 + suspiciousCount * 15)) : 100;
      scores.push(cyberScore);
    }
    
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const globalScore = calculateGlobalScore();

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { label: t('excellent'), variant: 'default' as const, color: 'bg-green-600' };
    if (score >= 40) return { label: t('average'), variant: 'secondary' as const, color: 'bg-yellow-600' };
    return { label: t('low'), variant: 'destructive' as const, color: 'bg-red-600' };
  };

  const getTrend = () => {
    // Simulate trend based on score (in real app, compare with historical data)
    if (!globalScore) return null;
    if (globalScore >= 70) return { icon: TrendingUp, text: t('improving'), color: 'text-green-600' };
    if (globalScore >= 40) return { icon: Minus, text: t('stable'), color: 'text-yellow-600' };
    return { icon: TrendingDown, text: t('needsAttention'), color: 'text-red-600' };
  };

  if (globalScore === null) {
    return (
      <Card className="glass-effect animate-fade-in border-0 shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center h-72 text-muted-foreground">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Shield className="h-20 w-20 mb-6 text-primary/60 relative" />
          </div>
          <p className="text-center text-lg font-medium">
            {t('submitDataToSee')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const badge = getScoreBadge(globalScore);
  const trend = getTrend();
  const TrendIcon = trend?.icon;

  return (
    <Card className="glass-effect animate-scale-in shadow-xl border-0 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Shield className="h-10 w-10 text-primary relative" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-heading">{t('globalResilienceScore')}</CardTitle>
              <CardDescription className="text-base mt-1">{t('combinedEvaluation')}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generatePDFReport({ ...results, globalScore })}
              className="flex items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('exportPDF')}</span>
            </Button>
            <Badge className={`${badge.color} text-base px-4 py-2 rounded-full shadow-lg`}>{badge.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('overallScore')}</p>
            <div className={`text-6xl md:text-7xl font-heading font-bold ${getScoreColor(globalScore)}`}>
              {globalScore}<span className="text-3xl md:text-4xl opacity-70">/100</span>
            </div>
          </div>
          {trend && TrendIcon && (
            <div className="flex items-center gap-3 bg-accent/50 px-4 py-3 rounded-xl">
              <TrendIcon className={`h-7 w-7 ${trend.color}`} />
              <span className={`text-base font-semibold ${trend.color}`}>{trend.text}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t('progress')}</span>
            <span className="font-semibold text-foreground">{globalScore}%</span>
          </div>
          <Progress value={globalScore} className="h-4 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.climate ? '✓' : '—'}
              </div>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{t('climate')}</div>
          </div>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 dark:bg-green-500/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.business ? '✓' : '—'}
              </div>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{t('business')}</div>
          </div>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {results.cyber ? '✓' : '—'}
              </div>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{t('cyber')}</div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-2">
          {t('lastUpdate')}: {new Date().toLocaleString(t('language') === 'fr' ? 'fr-FR' : 'en-US')}
        </div>
      </CardContent>
    </Card>
  );
}
