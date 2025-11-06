import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Shield, TrendingUp, Download } from 'lucide-react';
import type { BaseResponse } from '@/lib/api';
import { generatePDFReport } from '@/lib/pdfExport';

interface ResultCardProps {
  result: BaseResponse | null;
  error: string | null;
}

export const ResultCard = memo(function ResultCard({ result, error }: ResultCardProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="animate-scale-in rounded-2xl shadow-lg">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Erreur</AlertTitle>
        <AlertDescription className="text-base">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed border-2 glass-effect animate-fade-in rounded-2xl">
        <CardContent className="flex items-center justify-center h-80 text-muted-foreground">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
              <Shield className="h-16 w-16 mx-auto text-muted-foreground/40 relative" />
            </div>
            <p className="text-lg font-medium">Les résultats d'analyse apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="glass-effect animate-scale-in shadow-xl border-0 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl font-heading">Résultats d'analyse</CardTitle>
            <CardDescription className="capitalize text-base mt-1">{result.task.replace('_', ' ')}</CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                generatePDFReport({ [result.task === 'climate_guard' ? 'climate' : result.task === 'business_shield' ? 'business' : 'cyber']: result });
              }}
              className="flex items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            {result.risk_level && (
              <Badge className={`${getRiskColor(result.risk_level)} text-sm px-4 py-2 rounded-full shadow-lg`}>
                {result.risk_level.toUpperCase()}
              </Badge>
            )}
            {result.score !== undefined && (
              <div className="text-right bg-accent/30 px-4 py-2 rounded-xl">
                <div className={`text-3xl font-heading font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Score de résilience</div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 relative">
        {result.findings && result.findings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Constats
            </h3>
            {result.findings.map((finding, idx) => (
              <Card key={idx} className="bg-accent/30 border-0 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl">
                <CardContent className="pt-5">
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <h4 className="font-semibold text-base">{finding.title}</h4>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold">{Math.round(finding.confidence * 100)}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{finding.evidence}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {result.recommendations && result.recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              Recommandations
            </h3>
            {result.recommendations.map((reco, idx) => (
              <Card key={idx} className="border-0 bg-green-500/10 dark:bg-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl">
                <CardContent className="pt-5">
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <h4 className="font-semibold text-base text-green-900 dark:text-green-100">{reco.action}</h4>
                    {reco.est_saving_usd > 0 && (
                      <Badge className="bg-green-600 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                        ${reco.est_saving_usd.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{reco.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {result.actions && result.actions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Actions recommandées
            </h3>
            {result.actions.map((action, idx) => (
              <Card key={idx} className="bg-accent/30 border-0 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-xl">
                <CardContent className="pt-5">
                  <div className="flex justify-between items-start mb-3 gap-3 flex-wrap">
                    <Badge
                      variant={
                        action.type === 'block'
                          ? 'destructive'
                          : action.type === 'ignore'
                          ? 'secondary'
                          : 'default'
                      }
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {action.type.toUpperCase()}
                    </Badge>
                    {action.classification && (
                      <Badge
                        variant="outline"
                        className={
                          action.classification === 'malicious'
                            ? 'border-red-500 text-red-700 dark:text-red-400 rounded-full px-3 py-1 text-xs font-semibold'
                            : action.classification === 'suspicious'
                            ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400 rounded-full px-3 py-1 text-xs font-semibold'
                            : 'border-green-500 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold'
                        }
                      >
                        {action.classification}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{action.reason}</p>
                  {action.event_id && (
                    <p className="text-xs text-muted-foreground mt-1">Event: {action.event_id}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {result.notes && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Notes</AlertTitle>
            <AlertDescription>{result.notes}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
});
