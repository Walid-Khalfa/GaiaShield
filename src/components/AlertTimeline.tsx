import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

interface TimelineEntry {
  id: string;
  timestamp: Date | string;
  module?: 'climate' | 'business' | 'cyber' | string;
  riskLevel?: string;
  summary: string;
  confidence?: number;
}

interface AlertTimelineProps {
  history: TimelineEntry[];
}

export function AlertTimeline({ history }: AlertTimelineProps) {
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'climate':
        return '🌍';
      case 'business':
        return '💼';
      case 'cyber':
        return '🔒';
      default:
        return '📊';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'climate':
        return 'text-blue-600 dark:text-blue-400';
      case 'business':
        return 'text-green-600 dark:text-green-400';
      case 'cyber':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskBadge = (riskLevel?: string) => {
    const level = (riskLevel ?? 'unknown').toLowerCase();
    switch (level) {
      case 'critical':
        return { variant: 'destructive' as const, icon: XCircle, color: 'bg-red-600' };
      case 'high':
        return { variant: 'destructive' as const, icon: AlertTriangle, color: 'bg-orange-600' };
      case 'medium':
        return { variant: 'secondary' as const, icon: Info, color: 'bg-yellow-600' };
      case 'low':
        return { variant: 'default' as const, icon: CheckCircle2, color: 'bg-green-600' };
      default:
        return { variant: 'outline' as const, icon: Info, color: 'bg-gray-600' };
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (history.length === 0) {
    return (
      <Card className="glass-effect animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Clock className="h-16 w-16 mb-4 text-muted-foreground/50" />
          <p className="text-center">
            Aucune analyse effectuée pour le moment
          </p>
          <p className="text-sm text-center mt-2">
            Les analyses passées apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historique des Alertes
            </CardTitle>
            <CardDescription>
              {history.length} analyse{history.length > 1 ? 's' : ''} effectuée{history.length > 1 ? 's' : ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {history.map((entry, index) => {
              if (!entry) return null;

              const riskLevel = typeof entry.riskLevel === 'string' ? entry.riskLevel : 'unknown';
              const badge = getRiskBadge(riskLevel);
              const RiskIcon = badge.icon;
              const moduleKey = typeof entry.module === 'string' ? entry.module : 'unknown';

              const timestamp = entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp);
              
              return (
                <div
                  key={entry.id}
                  className="relative pl-8 pb-8 last:pb-0 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline line */}
                  {index !== history.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-background ${getModuleColor(entry.module)} bg-background flex items-center justify-center text-xs`}>
                    {getModuleIcon(entry.module)}
                  </div>

                  {/* Content */}
                  <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={badge.color}>
                            <RiskIcon className="h-3 w-3 mr-1" />
                            {riskLevel}
                          </Badge>
                          <span className={`text-sm font-medium ${getModuleColor(moduleKey)}`}>
                            {moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{entry.summary}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(timestamp)}
                      </span>
                      {entry.confidence !== undefined && (
                        <span>Confiance: {entry.confidence}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
