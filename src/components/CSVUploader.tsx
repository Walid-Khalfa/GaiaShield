import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { analytics } from '@/lib/monitoring';

interface CSVUploaderProps {
  onFilesLoaded: (files: { sales: string; stock: string; suppliers: string }) => void;
}

export function CSVUploader({ onFilesLoaded }: CSVUploaderProps) {
  const [files, setFiles] = useState<{
    sales: File | null;
    stock: File | null;
    suppliers: File | null;
  }>({
    sales: null,
    stock: null,
    suppliers: null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (type: 'sales' | 'stock' | 'suppliers', file: File | null) => {
    if (file && !file.name.endsWith('.csv')) {
      setError('Seuls les fichiers CSV sont acceptés');
      return;
    }
    setError(null);
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUpload = async () => {
    if (!files.sales || !files.stock || !files.suppliers) {
      setError('Veuillez charger les 3 fichiers CSV');
      return;
    }

    try {
      const salesText = await files.sales.text();
      const stockText = await files.stock.text();
      const suppliersText = await files.suppliers.text();

      // Count total rows across all files
      const totalRows = [
        salesText.split('\n').length - 1,
        stockText.split('\n').length - 1,
        suppliersText.split('\n').length - 1,
      ].reduce((a, b) => a + b, 0);

      analytics.trackCSVUpload('business', totalRows);

      onFilesLoaded({
        sales: salesText,
        stock: stockText,
        suppliers: suppliersText,
      });
    } catch {
      setError('Erreur lors de la lecture des fichiers');
    }
  };

  const removeFile = (type: 'sales' | 'stock' | 'suppliers') => {
    setFiles((prev) => ({ ...prev, [type]: null }));
  };

  const FileInput = ({
    type,
    label,
  }: {
    type: 'sales' | 'stock' | 'suppliers';
    label: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={type}>{label}</Label>
      {files[type] ? (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{files[type]!.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(type)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <label
          htmlFor={type}
          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Cliquez pour charger un CSV</p>
          </div>
          <input
            id={type}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <FileInput type="sales" label="Fichier des ventes (sales.csv)" />
      <FileInput type="stock" label="Fichier des stocks (stock.csv)" />
      <FileInput type="suppliers" label="Fichier des fournisseurs (suppliers.csv)" />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleUpload}
        disabled={!files.sales || !files.stock || !files.suppliers}
        className="w-full"
      >
        Charger les fichiers
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground mb-2">Fichiers d'exemple disponibles :</p>
        <div className="flex gap-2 justify-center flex-wrap">
          <a href="/samples/sales.csv" download className="text-xs text-primary hover:underline">
            sales.csv
          </a>
          <a href="/samples/stock.csv" download className="text-xs text-primary hover:underline">
            stock.csv
          </a>
          <a href="/samples/suppliers.csv" download className="text-xs text-primary hover:underline">
            suppliers.csv
          </a>
        </div>
      </div>
    </div>
  );
}
