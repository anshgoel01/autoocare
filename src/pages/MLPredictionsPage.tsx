import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  Brain,
  Cpu,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrediction } from '@/hooks/usePrediction';
import { mlFeatures, vehicleHealth } from '@/data/mockData';
import ComponentHealthBar from '@/components/dashboard/ComponentHealthBar';
import { HealthTrendChart } from '@/components/charts';

export default function MLPredictionsPage() {
  const { predict, isLoading, result } = usePrediction();
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCheckHealth = async () => {
    await predict(mlFeatures);
    setLastChecked(new Date());
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-critical';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-critical/10 border-critical/30';
      case 'medium': return 'bg-warning/10 border-warning/30';
      case 'low': return 'bg-success/10 border-success/30';
      default: return 'bg-muted border-border';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-8 h-8 text-critical" />;
      case 'medium': return <AlertCircle className="w-8 h-8 text-warning" />;
      case 'low': return <CheckCircle className="w-8 h-8 text-success" />;
      default: return <Activity className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getPercentageColor = (probability: number) => {
    if (probability >= 0.7) return 'text-critical';
    if (probability >= 0.4) return 'text-warning';
    return 'text-success';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-glow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Health Analysis</h1>
                <p className="text-primary-foreground/80">
                  ML-powered failure prediction and vehicle diagnostics
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={handleCheckHealth}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white border-0 gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {isLoading ? 'Analyzing...' : 'Run Health Check'}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Prediction Results */}
          <div className="xl:col-span-2 space-y-6">
            {/* Prediction Status Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      ML Prediction Results
                    </CardTitle>
                    <CardDescription>
                      Real-time failure risk analysis based on telemetry data
                    </CardDescription>
                  </div>
                  {lastChecked && (
                    <Badge variant="outline" className="font-normal gap-1">
                      <Clock className="w-3 h-3" />
                      Last checked {lastChecked.toLocaleTimeString()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!result && !isLoading && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                      <Brain className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Run a health check to analyze your vehicle's telemetry data and predict potential failures using our ML model.
                    </p>
                    <Button onClick={handleCheckHealth} size="lg" className="gap-2">
                      <Zap className="w-5 h-5" />
                      Start Analysis
                    </Button>
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-12">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Analyzing Vehicle Data</h3>
                    <p className="text-muted-foreground">
                      Processing telemetry through ML prediction model...
                    </p>
                  </div>
                )}

                {result && !isLoading && (
                  <div className="space-y-6">
                    {/* Risk Level Display */}
                    <div className={cn(
                      'rounded-xl border-2 p-6',
                      getRiskBgColor(result.risk_level)
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getRiskIcon(result.risk_level)}
                          <div>
                            <p className="text-sm text-muted-foreground">Failure Probability</p>
                            <p className={cn(
                              'text-5xl font-bold tabular-nums',
                              getPercentageColor(result.probability)
                            )}>
                              {Math.round(result.probability * 100)}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={cn(
                            'text-lg px-4 py-1 capitalize',
                            result.risk_level === 'high' && 'bg-critical text-critical-foreground',
                            result.risk_level === 'medium' && 'bg-warning text-warning-foreground',
                            result.risk_level === 'low' && 'bg-success text-success-foreground'
                          )}>
                            {result.risk_level} risk
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-2">
                            Model confidence: {result.confidence}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-current/10">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          <span className="font-medium">Classification:</span>
                          <span className={cn(
                            result.classification === 1 ? 'text-critical' : 'text-success'
                          )}>
                            {result.classification === 1 ? 'Potential Failure Detected' : 'No Failure Expected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors & Recommendations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Risk Factors */}
                      <Card className="border-warning/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            Risk Factors
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {result.risk_factors.length > 0 ? (
                            <ul className="space-y-3">
                              {result.risk_factors.map((factor, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm">
                                  <ChevronRight className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground text-sm">No significant risk factors detected</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-3 text-sm">
                                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Trend Chart */}
            <HealthTrendChart />
          </div>

          {/* Right Column - Component Status */}
          <div className="space-y-6">
            {/* Component Health */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Component Status
                </CardTitle>
                <CardDescription>
                  Current health of major vehicle components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleHealth.components.map((component) => (
                  <ComponentHealthBar
                    key={component.name}
                    name={component.name}
                    health={component.health}
                    status={component.status}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Analysis Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Overall Score</span>
                  <span className="font-bold text-lg">{vehicleHealth.overallScore}/100</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Components Monitored</span>
                  <span className="font-semibold">{vehicleHealth.components.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Telemetry Points</span>
                  <span className="font-semibold">6 sensors</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">ML Model</span>
                  <Badge variant="outline">RandomForest v2.1</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recheck Button */}
            {result && (
              <Button 
                variant="outline" 
                onClick={handleCheckHealth}
                disabled={isLoading}
                className="w-full gap-2"
                size="lg"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                Run New Analysis
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
