export interface RawAnalysis {
  id?: number;
  fileName: string;
  rawText: string;
  parsedData: {
    date?: string;
    amount?: number;
    description?: string;
    additionalFields?: { [key: string]: string | number };
  };
  status: 'success' | 'error';
  errorMessage?: string;
  createdAt?: Date;
}
