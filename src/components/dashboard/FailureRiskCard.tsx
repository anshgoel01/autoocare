import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { PredictionResult } from '@/hooks/usePrediction';

interface FailureRiskCardProps {
  result: PredictionResult | null;
  isLoading: boolean;
  onCheckHealth: () => void;
}

export default function FailureRiskCard({ 
  result, 
  isLoading, 
  onCheckHealth 
}: FailureRiskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-critical';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-critical/10 border-critical/20';
      case 'medium':
        return 'bg-warning/10 border-warning/20';
      case 'low':
        return 'bg-success/10 border-success/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-critical" />;
      case 'medium':
        return <AlertCircle className="w-6 h-6 text-warning" />;
      case 'low':
        return <CheckCircle className="w-6 h-6 text-success" />;
      default:
        return <Activity className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getPercentageColor = (probability: number) => {
    if (probability >= 0.7) return 'text-critical';
    if (probability >= 0.4) return 'text-warning';
    return 'text-success';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            ML Failure Prediction
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && !isLoading && (
          <div className="text-center py-6">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">
              Analyze your vehicle's telemetry data to predict potential failures
            </p>
            <Button onClick={onCheckHealth} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Check Vehicle Health
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin mb-3" />
            <p className="text-muted-foreground">Analyzing telemetry data...</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Running ML prediction model
            </p>
          </div>
        )}

        {result && !isLoading && (
          <>
            {/* Main Risk Display */}
            <div className={cn(
              'rounded-xl border p-4',
              getRiskBgColor(result.risk_level)
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getRiskIcon(result.risk_level)}
                  <div>
                    <p className="text-sm text-muted-foreground">Failure Risk</p>
                    <p className={cn(
                      'text-3xl font-bold',
                      getPercentageColor(result.probability)
                    )}>
                      {Math.round(result.probability * 100)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={cn(
                    'capitalize',
                    result.risk_level === 'high' && 'bg-critical text-critical-foreground',
                    result.risk_level === 'medium' && 'bg-warning text-warning-foreground',
                    result.risk_level === 'low' && 'bg-success text-success-foreground'
                  )}>
                    {result.risk_level} risk
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>

              {/* Classification */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Prediction:</span>
                <span className={cn(
                  'font-medium',
                  result.classification === 1 ? 'text-critical' : 'text-success'
                )}>
                  {result.classification === 1 ? 'Potential Failure Detected' : 'No Failure Expected'}
                </span>
              </div>
            </div>

            {/* Risk Factors & Recommendations (Expandable) */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>
                {result.risk_factors.length} risk factor{result.risk_factors.length !== 1 ? 's' : ''} • 
                {result.recommendations.length} recommendation{result.recommendations.length !== 1 ? 's' : ''}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
              <div className="space-y-4 animate-fade-in">
                {result.risk_factors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Risk Factors</h4>
                    <ul className="space-y-1">
                      {result.risk_factors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Recheck Button */}
            <Button 
              variant="outline" 
              onClick={onCheckHealth} 
              className="w-full gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recheck Health
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
