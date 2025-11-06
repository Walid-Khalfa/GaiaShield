import { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileJson, Upload, FormInput } from 'lucide-react';
import { CSVUploader } from './CSVUploader';
import type { ClimateInputs, BusinessInputs, CyberInputs } from '@/lib/api';

// Geocoding helper using OpenStreetMap Nominatim API
async function geocodeLocation(location: string): Promise<{ lat: number; lon: number }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    
    // Fallback to Paris if geocoding fails
    console.warn('Geocoding failed, using Paris as default');
    return { lat: 48.8566, lon: 2.3522 };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { lat: 48.8566, lon: 2.3522 };
  }
}

interface TaskFormProps {
  task: 'climate' | 'business' | 'cyber';
  onSubmit: (inputs: ClimateInputs | BusinessInputs | CyberInputs) => Promise<void>;
  loading: boolean;
  onLoadSample: () => void;
}

export const TaskForm = memo(function TaskForm({ task, onSubmit, loading, onLoadSample }: TaskFormProps) {
  const [formData, setFormData] = useState<string>('{}');
  const [inputMode, setInputMode] = useState<'form' | 'json' | 'upload'>('form');
  
  // Climate form fields
  const [climateLocation, setClimateLocation] = useState('');
  const [climateIndustry, setClimateIndustry] = useState('');
  const [climateContext, setClimateContext] = useState('');
  
  // Business form fields
  const [salesDate, setSalesDate] = useState('');
  const [salesQty, setSalesQty] = useState('');
  const [salesRevenue, setSalesRevenue] = useState('');
  const [stockSku, setStockSku] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockLeadDays, setStockLeadDays] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierOnTimeRate, setSupplierOnTimeRate] = useState('');
  const [supplierRegion, setSupplierRegion] = useState('');
  const [energyCostPerKwh, setEnergyCostPerKwh] = useState('');
  const [cashOnHand, setCashOnHand] = useState('');
  
  // Cyber form fields
  const [cyberInfrastructure, setCyberInfrastructure] = useState('');
  const [cyberContext, setCyberContext] = useState('');

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task === 'climate') {
      // Transform user-friendly form to API format
      // Geocode location to coordinates
      const locationCoords = await geocodeLocation(climateLocation);
      
      const sectorMap: Record<string, 'retail' | 'agri' | 'logistics' | 'manufacturing' | 'services'> = {
        'agriculture': 'agri',
        'tourisme': 'retail',
        'retail': 'retail',
        'manufacturing': 'manufacturing',
        'logistique': 'logistics',
        'logistics': 'logistics',
        'services': 'services',
      };
      
      const sector = sectorMap[climateIndustry.toLowerCase()] || 'services';
      
      await onSubmit({
        lat: locationCoords.lat,
        lon: locationCoords.lon,
        horizonDays: 7,
        sector,
        context: climateContext, // Include user context
      } as ClimateInputs);
    } else if (task === 'business') {
      const parsedSalesQty = Number(salesQty);
      const parsedSalesRevenue = Number(salesRevenue);
      const parsedStockQty = Number(stockQty);
      const parsedStockLeadDays = Number(stockLeadDays);
      const parsedOnTimeRate = Number(supplierOnTimeRate);
      const parsedEnergyCost = energyCostPerKwh.trim() !== '' ? Number(energyCostPerKwh) : undefined;
      const parsedCash = cashOnHand.trim() !== '' ? Number(cashOnHand) : undefined;

      const requiredFieldsFilled =
        salesDate &&
        salesQty.trim() !== '' &&
        !Number.isNaN(parsedSalesQty) &&
        salesRevenue.trim() !== '' &&
        !Number.isNaN(parsedSalesRevenue) &&
        stockSku.trim() !== '' &&
        stockQty.trim() !== '' &&
        !Number.isNaN(parsedStockQty) &&
        stockLeadDays.trim() !== '' &&
        !Number.isNaN(parsedStockLeadDays) &&
        supplierName.trim() !== '' &&
        supplierRegion.trim() !== '' &&
        supplierOnTimeRate.trim() !== '' &&
        !Number.isNaN(parsedOnTimeRate);

      if (!requiredFieldsFilled) {
        alert('Veuillez renseigner toutes les données requises avec des valeurs numériques valides.');
        return;
      }

      if (parsedOnTimeRate < 0 || parsedOnTimeRate > 1) {
        alert('Le taux de ponctualité fournisseur doit être compris entre 0 et 1.');
        return;
      }

      if (parsedEnergyCost !== undefined && (Number.isNaN(parsedEnergyCost) || parsedEnergyCost < 0)) {
        alert('Le coût énergie doit être un nombre positif.');
        return;
      }

      if (parsedCash !== undefined && (Number.isNaN(parsedCash) || parsedCash < 0)) {
        alert('La trésorerie disponible doit être un nombre positif.');
        return;
      }

      const businessData: BusinessInputs = {
        sales: [{ date: salesDate, qty: parsedSalesQty, revenue: parsedSalesRevenue }],
        stock: [{ sku: stockSku, qty: parsedStockQty, leadDays: parsedStockLeadDays }],
        suppliers: [{ name: supplierName, onTimeRate: parsedOnTimeRate, region: supplierRegion }],
        ...(parsedEnergyCost !== undefined && !Number.isNaN(parsedEnergyCost) ? { energyCostPerKwh: parsedEnergyCost } : {}),
        ...(parsedCash !== undefined && !Number.isNaN(parsedCash) ? { cashOnHand: parsedCash } : {}),
      };

      await onSubmit(businessData);
    } else if (task === 'cyber') {
      // Transform infrastructure description to events format
      await onSubmit({
        events: [
          {
            id: 'evt-1',
            type: 'log' as const,
            content: `Infrastructure: ${cyberInfrastructure}. Context: ${cyberContext}`,
          },
        ],
      } as CyberInputs);
    }
  }, [
    task,
    climateLocation,
    climateIndustry,
    climateContext,
    salesDate,
    salesQty,
    salesRevenue,
    stockSku,
    stockQty,
    stockLeadDays,
    supplierName,
    supplierOnTimeRate,
    supplierRegion,
    energyCostPerKwh,
    cashOnHand,
    cyberInfrastructure,
    cyberContext,
    onSubmit,
  ]);

  const handleJSONSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(formData);
      onSubmit(parsed);
    } catch {
      alert('JSON invalide. Veuillez vérifier votre saisie.');
    }
  }, [formData, onSubmit]);

  const handleCSVUpload = useCallback((files: { sales: string; stock: string; suppliers: string }) => {
    const parseSalesCSV = (csv: string) => {
      const lines = csv.trim().split('\n').slice(1);
      return lines.map(line => {
        const [date, qty, revenue] = line.split(',');
        return { date: date.trim(), qty: parseInt(qty), revenue: parseFloat(revenue) };
      });
    };

    const parseStockCSV = (csv: string) => {
      const lines = csv.trim().split('\n').slice(1);
      return lines.map(line => {
        const [sku, qty, leadDays] = line.split(',');
        return { sku: sku.trim(), qty: parseInt(qty), leadDays: parseInt(leadDays) };
      });
    };

    const parseSuppliersCSV = (csv: string) => {
      const lines = csv.trim().split('\n').slice(1);
      return lines.map(line => {
        const [name, onTimeRate, region] = line.split(',');
        return { name: name.trim(), onTimeRate: parseFloat(onTimeRate), region: region.trim() };
      });
    };

    try {
      const businessData: BusinessInputs = {
        sales: parseSalesCSV(files.sales),
        stock: parseStockCSV(files.stock),
        suppliers: parseSuppliersCSV(files.suppliers),
      };
      onSubmit(businessData);
    } catch {
      alert('Erreur lors du parsing des fichiers CSV. Vérifiez le format.');
    }
  }, [onSubmit]);

  const getPlaceholder = () => {
    switch (task) {
      case 'climate':
        return JSON.stringify(
          {
            location: 'Paris, France',
            industry: 'Agriculture',
            context: 'Ferme de 100 hectares, cultures céréalières',
          },
          null,
          2
        );
      case 'business':
        return JSON.stringify(
          {
            sales: [{ date: '2025-01-01', qty: 100, revenue: 3000 }],
            stock: [{ sku: 'PROD-001', qty: 50, leadDays: 14 }],
            suppliers: [{ name: 'Fournisseur A', onTimeRate: 0.9, region: 'Dakar' }],
          },
          null,
          2
        );
      case 'cyber':
        return JSON.stringify(
          {
            infrastructure: '200 postes Windows 10, Office 365, AWS',
            context: 'Formation annuelle, MFA activé, antivirus Defender',
          },
          null,
          2
        );
    }
  };

  const getTitle = () => {
    switch (task) {
      case 'climate':
        return 'Climate Guard';
      case 'business':
        return 'Business Shield';
      case 'cyber':
        return 'CyberProtect';
    }
  };

  const getDescription = () => {
    switch (task) {
      case 'climate':
        return 'Analyse des risques climatiques et environnementaux';
      case 'business':
        return 'Évaluation de la résilience opérationnelle';
      case 'cyber':
        return 'Détection de menaces cybersécurité';
    }
  };

  const loadSampleToForm = () => {
    if (task === 'climate') {
      setClimateLocation('Paris, France');
      setClimateIndustry('Agriculture');
      setClimateContext('Ferme de 100 hectares, cultures céréalières, irrigation par aspersion');
    } else if (task === 'business') {
      setSalesDate('2025-01-01');
      setSalesQty('100');
      setSalesRevenue('5000');
      setStockSku('PROD-001');
      setStockQty('50');
      setStockLeadDays('14');
      setSupplierName('Supplier A');
      setSupplierOnTimeRate('0.9');
      setSupplierRegion('Europe');
      setEnergyCostPerKwh('0.12');
      setCashOnHand('25000');
    } else if (task === 'cyber') {
      setCyberInfrastructure('200 postes Windows 10, Office 365, AWS (EC2, S3, RDS), VPN Cisco');
      setCyberContext('Formation annuelle, MFA activé, antivirus Defender, SOC externe, données clients RGPD');
    }
  };

  return (
    <Card className="glass-effect animate-slide-up shadow-xl border-0 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-heading">{getTitle()}</CardTitle>
        <CardDescription className="text-base mt-2">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'form' | 'json' | 'upload')} className="space-y-6">
          <TabsList className={`grid w-full ${task === 'business' ? 'grid-cols-3' : 'grid-cols-2'} p-1 gap-1 rounded-xl`}>
            <TabsTrigger value="form" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-md">
              <FormInput className="h-4 w-4" />
              <span className="hidden sm:inline">Formulaire</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-md">
              <FileJson className="h-4 w-4" />
              <span className="hidden sm:inline">JSON</span>
            </TabsTrigger>
            {task === 'business' && (
              <TabsTrigger value="upload" className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-md">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">CSV</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Form Mode */}
          <TabsContent value="form">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {task === 'climate' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <Input
                      id="location"
                      placeholder="ex: Paris, France"
                      value={climateLocation}
                      onChange={(e) => setClimateLocation(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Ville et pays pour l'analyse climatique</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Secteur d'activité *</Label>
                    <Input
                      id="industry"
                      placeholder="ex: Agriculture, Tourisme, Manufacturing"
                      value={climateIndustry}
                      onChange={(e) => setClimateIndustry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="context">Contexte *</Label>
                    <Textarea
                      id="context"
                      placeholder="Décrivez vos opérations, infrastructures, et préoccupations spécifiques..."
                      value={climateContext}
                      onChange={(e) => setClimateContext(e.target.value)}
                      rows={4}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Plus de détails = analyse plus précise</p>
                  </div>
                </>
              )}
              
              {task === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Ventes (dernière période)</h4>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="sales-date">Date *</Label>
                        <Input
                          id="sales-date"
                          type="date"
                          value={salesDate}
                          onChange={(e) => setSalesDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sales-qty">Quantité vendue *</Label>
                        <Input
                          id="sales-qty"
                          type="number"
                          min={0}
                          value={salesQty}
                          onChange={(e) => setSalesQty(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sales-revenue">Revenu (USD) *</Label>
                        <Input
                          id="sales-revenue"
                          type="number"
                          min={0}
                          step="0.01"
                          value={salesRevenue}
                          onChange={(e) => setSalesRevenue(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Stock actuel</h4>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="stock-sku">SKU *</Label>
                        <Input
                          id="stock-sku"
                          value={stockSku}
                          onChange={(e) => setStockSku(e.target.value)}
                          placeholder="ex: PROD-001"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="stock-qty">Quantité en stock *</Label>
                        <Input
                          id="stock-qty"
                          type="number"
                          min={0}
                          value={stockQty}
                          onChange={(e) => setStockQty(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="stock-lead">Délais d'approvisionnement (jours) *</Label>
                        <Input
                          id="stock-lead"
                          type="number"
                          min={0}
                          value={stockLeadDays}
                          onChange={(e) => setStockLeadDays(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Fournisseur principal</h4>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="supplier-name">Nom *</Label>
                        <Input
                          id="supplier-name"
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                          placeholder="ex: Supplier A"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="supplier-rate">Taux de ponctualité (0-1) *</Label>
                        <Input
                          id="supplier-rate"
                          type="number"
                          min={0}
                          max={1}
                          step="0.01"
                          value={supplierOnTimeRate}
                          onChange={(e) => setSupplierOnTimeRate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="supplier-region">Région *</Label>
                        <Input
                          id="supplier-region"
                          value={supplierRegion}
                          onChange={(e) => setSupplierRegion(e.target.value)}
                          placeholder="ex: Europe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="energy-cost">Coût énergie (USD/kWh)</Label>
                      <Input
                        id="energy-cost"
                        type="number"
                        min={0}
                        step="0.01"
                        value={energyCostPerKwh}
                        onChange={(e) => setEnergyCostPerKwh(e.target.value)}
                        placeholder="ex: 0.12"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cash-on-hand">Trésorerie disponible (USD)</Label>
                      <Input
                        id="cash-on-hand"
                        type="number"
                        min={0}
                        step="0.01"
                        value={cashOnHand}
                        onChange={(e) => setCashOnHand(e.target.value)}
                        placeholder="ex: 25000"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    💡 Astuce: Passez à l'onglet CSV pour uploader plusieurs enregistrements de ventes, stocks et fournisseurs.
                  </p>
                </div>
              )}
              
              {task === 'cyber' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="infrastructure">Infrastructure IT *</Label>
                    <Textarea
                      id="infrastructure"
                      placeholder="Décrivez votre infrastructure: serveurs, réseaux, cloud, endpoints..."
                      value={cyberInfrastructure}
                      onChange={(e) => setCyberInfrastructure(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cyber-context">Contexte de sécurité *</Label>
                    <Textarea
                      id="cyber-context"
                      placeholder="Décrivez vos mesures de sécurité actuelles, politiques, formations, incidents..."
                      value={cyberContext}
                      onChange={(e) => setCyberContext(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1 transition-all duration-200 hover:scale-105">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    'Analyser'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={loadSampleToForm}>
                  Exemple
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* JSON Mode */}
          <TabsContent value="json">
            <form onSubmit={handleJSONSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="inputs">Données d'entrée (JSON)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={onLoadSample}>
                    Charger exemple
                  </Button>
                </div>
                <Textarea
                  id="inputs"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="font-mono text-sm min-h-[300px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full transition-all duration-200 hover:scale-105">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* CSV Upload Mode (Business only) */}
          {task === 'business' && (
            <TabsContent value="upload">
              <CSVUploader onFilesLoaded={handleCSVUpload} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
});
