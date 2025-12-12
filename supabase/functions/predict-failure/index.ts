import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionInput {
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

interface PredictionResult {
  probability: number;
  classification: 0 | 1;
  confidence: number;
  risk_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  recommendations: string[];
}

// Feature importance weights (based on typical ML model feature importance)
const FEATURE_WEIGHTS = {
  engine_temp: 0.12,
  oil_pressure: 0.10,
  coolant_temp: 0.08,
  brake_pad_thickness: 0.11,
  battery_voltage: 0.09,
  tire_pressure_fl: 0.05,
  tire_pressure_fr: 0.05,
  tire_pressure_rl: 0.05,
  tire_pressure_rr: 0.05,
  transmission_fluid_level: 0.07,
  suspension_wear: 0.08,
  odometer: 0.06,
  fuel_efficiency: 0.04,
  vibration_level: 0.05,
};

// Optimal ranges for each feature (simulating RobustScaler normalization)
const FEATURE_RANGES = {
  engine_temp: { optimal_min: 85, optimal_max: 105, critical_low: 70, critical_high: 115 },
  oil_pressure: { optimal_min: 40, optimal_max: 60, critical_low: 25, critical_high: 80 },
  coolant_temp: { optimal_min: 80, optimal_max: 100, critical_low: 60, critical_high: 110 },
  brake_pad_thickness: { optimal_min: 4, optimal_max: 12, critical_low: 2, critical_high: 15 },
  battery_voltage: { optimal_min: 12.4, optimal_max: 14.7, critical_low: 11.5, critical_high: 15.5 },
  tire_pressure_fl: { optimal_min: 32, optimal_max: 36, critical_low: 28, critical_high: 40 },
  tire_pressure_fr: { optimal_min: 32, optimal_max: 36, critical_low: 28, critical_high: 40 },
  tire_pressure_rl: { optimal_min: 32, optimal_max: 36, critical_low: 28, critical_high: 40 },
  tire_pressure_rr: { optimal_min: 32, optimal_max: 36, critical_low: 28, critical_high: 40 },
  transmission_fluid_level: { optimal_min: 60, optimal_max: 100, critical_low: 40, critical_high: 105 },
  suspension_wear: { optimal_min: 0, optimal_max: 30, critical_low: -5, critical_high: 70 },
  odometer: { optimal_min: 0, optimal_max: 50000, critical_low: -1000, critical_high: 150000 },
  fuel_efficiency: { optimal_min: 10, optimal_max: 20, critical_low: 5, critical_high: 30 },
  vibration_level: { optimal_min: 0, optimal_max: 2, critical_low: -0.5, critical_high: 5 },
};

function calculateFeatureRisk(value: number, featureName: keyof typeof FEATURE_RANGES): number {
  const range = FEATURE_RANGES[featureName];
  
  // If within optimal range, low risk
  if (value >= range.optimal_min && value <= range.optimal_max) {
    return 0;
  }
  
  // Calculate deviation from optimal range
  let deviation = 0;
  if (value < range.optimal_min) {
    deviation = (range.optimal_min - value) / (range.optimal_min - range.critical_low);
  } else {
    deviation = (value - range.optimal_max) / (range.critical_high - range.optimal_max);
  }
  
  // Clamp between 0 and 1
  return Math.min(Math.max(deviation, 0), 1);
}

function identifyRiskFactors(input: PredictionInput): string[] {
  const riskFactors: string[] = [];
  
  const checks: { key: keyof PredictionInput; message: string; isRisky: (v: number) => boolean }[] = [
    { key: 'engine_temp', message: 'Engine temperature is outside optimal range', isRisky: v => v < 85 || v > 105 },
    { key: 'oil_pressure', message: 'Oil pressure is abnormal', isRisky: v => v < 40 || v > 60 },
    { key: 'coolant_temp', message: 'Coolant temperature is concerning', isRisky: v => v < 80 || v > 100 },
    { key: 'brake_pad_thickness', message: 'Brake pads are worn', isRisky: v => v < 4 },
    { key: 'battery_voltage', message: 'Battery voltage is low', isRisky: v => v < 12.4 },
    { key: 'transmission_fluid_level', message: 'Transmission fluid is low', isRisky: v => v < 60 },
    { key: 'suspension_wear', message: 'Suspension shows significant wear', isRisky: v => v > 50 },
    { key: 'vibration_level', message: 'High vibration detected', isRisky: v => v > 3 },
    { key: 'fuel_efficiency', message: 'Fuel efficiency has decreased', isRisky: v => v < 8 },
  ];
  
  // Check tire pressures
  const tirePressures = [input.tire_pressure_fl, input.tire_pressure_fr, input.tire_pressure_rl, input.tire_pressure_rr];
  const avgPressure = tirePressures.reduce((a, b) => a + b, 0) / 4;
  if (avgPressure < 30 || avgPressure > 38) {
    riskFactors.push('Tire pressure needs attention');
  }
  
  const pressureVariance = Math.max(...tirePressures) - Math.min(...tirePressures);
  if (pressureVariance > 5) {
    riskFactors.push('Uneven tire pressure detected');
  }
  
  for (const check of checks) {
    if (check.isRisky(input[check.key])) {
      riskFactors.push(check.message);
    }
  }
  
  if (input.odometer > 100000) {
    riskFactors.push('High mileage vehicle requires more frequent checks');
  }
  
  return riskFactors;
}

function generateRecommendations(riskFactors: string[], probability: number): string[] {
  const recommendations: string[] = [];
  
  if (probability > 0.7) {
    recommendations.push('Schedule immediate vehicle inspection');
  } else if (probability > 0.4) {
    recommendations.push('Schedule routine maintenance within 2 weeks');
  }
  
  if (riskFactors.some(r => r.includes('Brake'))) {
    recommendations.push('Inspect and replace brake pads if necessary');
  }
  if (riskFactors.some(r => r.includes('Battery'))) {
    recommendations.push('Test battery and charging system');
  }
  if (riskFactors.some(r => r.includes('Tire'))) {
    recommendations.push('Check and adjust tire pressure');
  }
  if (riskFactors.some(r => r.includes('Engine'))) {
    recommendations.push('Run engine diagnostics');
  }
  if (riskFactors.some(r => r.includes('vibration'))) {
    recommendations.push('Check wheel balance and alignment');
  }
  if (riskFactors.some(r => r.includes('Transmission'))) {
    recommendations.push('Check transmission fluid and consider service');
  }
  if (riskFactors.some(r => r.includes('Suspension'))) {
    recommendations.push('Inspect suspension components');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Vehicle is in good condition. Continue regular maintenance.');
  }
  
  return recommendations;
}

function predictFailure(input: PredictionInput): PredictionResult {
  console.log('Predicting failure for input:', input);
  
  // Calculate weighted risk score for each feature
  let totalRisk = 0;
  let totalWeight = 0;
  
  for (const [featureName, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const value = input[featureName as keyof PredictionInput];
    const risk = calculateFeatureRisk(value, featureName as keyof typeof FEATURE_RANGES);
    totalRisk += risk * weight;
    totalWeight += weight;
  }
  
  // Normalize to get probability
  let probability = totalRisk / totalWeight;
  
  // Apply some non-linearity to simulate ML model behavior
  probability = Math.pow(probability, 0.8); // Slightly amplify small risks
  
  // Add interaction effects (e.g., multiple issues compound risk)
  const riskFactors = identifyRiskFactors(input);
  if (riskFactors.length > 3) {
    probability = Math.min(probability * 1.2, 0.95);
  }
  if (riskFactors.length > 5) {
    probability = Math.min(probability * 1.3, 0.98);
  }
  
  // Clamp probability
  probability = Math.min(Math.max(probability, 0.01), 0.99);
  
  // Classification threshold at 0.5
  const classification: 0 | 1 = probability >= 0.5 ? 1 : 0;
  
  // Calculate confidence (higher when probability is far from 0.5)
  const confidence = Math.abs(probability - 0.5) * 2 * 100;
  
  // Determine risk level
  let risk_level: 'low' | 'medium' | 'high';
  if (probability < 0.4) {
    risk_level = 'low';
  } else if (probability < 0.7) {
    risk_level = 'medium';
  } else {
    risk_level = 'high';
  }
  
  const recommendations = generateRecommendations(riskFactors, probability);
  
  console.log('Prediction result:', { probability, classification, confidence, risk_level, riskFactors });
  
  return {
    probability: Math.round(probability * 100) / 100,
    classification,
    confidence: Math.round(confidence),
    risk_level,
    risk_factors: riskFactors,
    recommendations,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PredictionInput = await req.json();
    
    // Validate input
    const requiredFields = [
      'engine_temp', 'oil_pressure', 'coolant_temp', 'brake_pad_thickness',
      'battery_voltage', 'tire_pressure_fl', 'tire_pressure_fr', 'tire_pressure_rl',
      'tire_pressure_rr', 'transmission_fluid_level', 'suspension_wear',
      'odometer', 'fuel_efficiency', 'vibration_level'
    ];
    
    for (const field of requiredFields) {
      if (typeof input[field as keyof PredictionInput] !== 'number') {
        return new Response(
          JSON.stringify({ error: `Missing or invalid field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    const result = predictFailure(input);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Prediction failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
