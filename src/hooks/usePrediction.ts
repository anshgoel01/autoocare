import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PredictionInput {
  engine_temp: number;
  oil_pressure: number;
  coolant_temp: number;
  brake_pad_thickness: number;
  battery_voltage: number;
  tire_pressure_fl: number;
  tire_pressure_fr: number;
  tire_pressure_rl: number;
  tire_pressure_rr: number;
  transmission_fluid_level: number;
  suspension_wear: number;
  odometer: number;
  fuel_efficiency: number;
  vibration_level: number;
}

export interface PredictionResult {
  probability: number;
  classification: 0 | 1;
  confidence: number;
  risk_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  recommendations: string[];
}

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (input: PredictionInput): Promise<PredictionResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('predict-failure', {
        body: input,
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as PredictionResult);
      return data as PredictionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(errorMessage);
      toast.error('Prediction failed', { description: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    predict,
    isLoading,
    result,
    error,
    clearResult,
  };
}
