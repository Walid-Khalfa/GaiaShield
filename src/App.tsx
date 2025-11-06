import { useState, useEffect, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/TaskForm';
import { ResultCard } from '@/components/ResultCard';
import { Cloud, Building2, Lock, Moon, Sun, History, Languages, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  analyzeClimate,
  analyzeBusiness,
  analyzeCyber,
  type ClimateInputs,
  type BusinessInputs,
  type CyberInputs,
  type BaseResponse,
} from '@/lib/api';
import { climateSample, businessSample, cyberSample } from '@/lib/samples';
import { useTranslation } from '@/lib/i18n';
import { analytics, errorTracking } from '@/lib/monitoring';

// Lazy load heavy components
const ResilienceScore = lazy(() => import('@/components/ResilienceScore').then(m => ({ default: m.ResilienceScore })));
const AlertTimeline = lazy(() => import('@/components/AlertTimeline').then(m => ({ default: m.AlertTimeline })));
const MonitoringDashboard = lazy(() => import('@/components/MonitoringDashboard').then(m => ({ default: m.MonitoringDashboard })));
type HistoryModule = 'climate' | 'business' | 'cyber';

interface StoredHistoryEntry {
  module: HistoryModule;
  result: BaseResponse;
  timestamp: number;
}

const HISTORY_STORAGE_KEY = 'alertHistory';

const useAlertHistory = () => {
  const [history, setHistory] = useState<StoredHistoryEntry[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredHistoryEntry[];
        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .filter((entry): entry is StoredHistoryEntry => Boolean(entry && entry.result && entry.module && typeof entry.timestamp === 'number'))
              .map(entry => ({
                module: entry.module,
                result: entry.result,
                timestamp: entry.timestamp,
              }))
          );
        }
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addEntry = (module: HistoryModule, result: BaseResponse) => {
    setHistory(prevHistory => {
      const newEntry: StoredHistoryEntry = { module, result, timestamp: Date.now() };
      const updated = [newEntry, ...prevHistory].slice(0, 50);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  return { history, addEntry };
};

function App() {
  const [activeTab, setActiveTab] = useState('climate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BaseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [allResults, setAllResults] = useState<{
    climate?: BaseResponse | null;
    business?: BaseResponse | null;
    cyber?: BaseResponse | null;
  }>({});
  const { history, addEntry } = useAlertHistory();
  const { t, language, changeLanguage } = useTranslation();

  const LOGO_URL = 'https://assets-gen.codenut.dev/lib/398d1e3d-a0f0-4680-b168-55a3d268093d/GaiaShield.png';

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    analytics.trackThemeChange(newMode ? 'dark' : 'light');
  };

  const handleClimateSubmit = async (inputs: ClimateInputs) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      errorTracking.addBreadcrumb('Climate analysis started', 'analysis', { inputs });
      const response = await analyzeClimate({ inputs, locale: language === 'en' ? 'en-US' : 'fr-FR' });
      setResult(response);
      setAllResults(prev => ({ ...prev, climate: response }));
      addEntry('climate', response);
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('climate', duration, true);
    } catch (err) {
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('climate', duration, false);
      errorTracking.captureException(err instanceof Error ? err : new Error(String(err)), { module: 'climate', inputs });
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (inputs: BusinessInputs) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      errorTracking.addBreadcrumb('Business analysis started', 'analysis', { inputs });
      const response = await analyzeBusiness({ inputs, locale: language === 'en' ? 'en-US' : 'fr-FR' });
      setResult(response);
      setAllResults(prev => ({ ...prev, business: response }));
      addEntry('business', response);
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('business', duration, true);
    } catch (err) {
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('business', duration, false);
      errorTracking.captureException(err instanceof Error ? err : new Error(String(err)), { module: 'business', inputs });
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleCyberSubmit = async (inputs: CyberInputs) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      errorTracking.addBreadcrumb('Cyber analysis started', 'analysis', { inputs });
      const response = await analyzeCyber({ inputs, locale: language === 'en' ? 'en-US' : 'fr-FR' });
      setResult(response);
      setAllResults(prev => ({ ...prev, cyber: response }));
      addEntry('cyber', response);
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('cyber', duration, true);
    } catch (err) {
      const duration = Date.now() - startTime;
      analytics.trackModuleAnalysis('cyber', duration, false);
      errorTracking.captureException(err instanceof Error ? err : new Error(String(err)), { module: 'cyber', inputs });
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen hero-gradient transition-colors duration-300">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20" 
          style={{
            backgroundImage: `url('https://assets-gen.codenut.dev/images/1762371802_4d3031a7.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <img 
                src={LOGO_URL} 
                alt="GaiaShield Logo" 
                className="h-24 w-auto object-contain drop-shadow-lg"
              />
            </div>
            <div className="flex items-center justify-center gap-3 mb-6 relative max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 dark:from-primary dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {t('appTitle')}
              </h1>
              <div className="absolute right-0 top-0 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeLanguage(language === 'fr' ? 'en' : 'fr')}
                title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
              >
                <Languages className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('appSubtitle')}
          </p>
          <p className="text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t('appTagline')}
          </p>
        </div>
      </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8 animate-slide-up">

          <TabsList className="grid w-full grid-cols-5 max-w-5xl mx-auto glass-effect shadow-xl rounded-2xl p-2 gap-2">
            <TabsTrigger value="climate" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 rounded-xl data-[state=active]:shadow-lg">
              <Cloud className="h-5 w-5" />
              <span className="hidden sm:inline">{t('climateGuard')}</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 rounded-xl data-[state=active]:shadow-lg">
              <Building2 className="h-5 w-5" />
              <span className="hidden sm:inline">{t('businessShield')}</span>
            </TabsTrigger>
            <TabsTrigger value="cyber" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 rounded-xl data-[state=active]:shadow-lg">
              <Lock className="h-5 w-5" />
              <span className="hidden sm:inline">{t('cyberProtect')}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 rounded-xl data-[state=active]:shadow-lg">
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">{t('history')}</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 rounded-xl data-[state=active]:shadow-lg">
              <Activity className="h-5 w-5" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
          </TabsList>

          <div className="mb-8">
            <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
              <ResilienceScore results={allResults} />
            </Suspense>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <TabsContent value="climate" className="mt-0">
              <TaskForm
                task="climate"
                onSubmit={(inputs) => handleClimateSubmit(inputs as ClimateInputs)}
                loading={loading}
                onLoadSample={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea) {
                    textarea.value = JSON.stringify(climateSample, null, 2);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="business" className="mt-0">
              <TaskForm
                task="business"
                onSubmit={(inputs) => handleBusinessSubmit(inputs as BusinessInputs)}
                loading={loading}
                onLoadSample={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea) {
                    textarea.value = JSON.stringify(businessSample, null, 2);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="cyber" className="mt-0">
              <TaskForm
                task="cyber"
                onSubmit={(inputs) => handleCyberSubmit(inputs as CyberInputs)}
                loading={loading}
                onLoadSample={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea) {
                    textarea.value = JSON.stringify(cyberSample, null, 2);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              />
            </TabsContent>

            <div className="md:col-start-2">
              <ResultCard result={result} error={error} />
            </div>
          </div>

          <TabsContent value="history" className="mt-0">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AlertTimeline history={history} />
            </Suspense>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <MonitoringDashboard />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
