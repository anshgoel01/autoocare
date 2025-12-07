import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serviceHistory } from '@/data/mockData';
import { format } from 'date-fns';
import { Download, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceHistoryPage() {
  const { toast } = useToast();

  const totalSpent = serviceHistory.reduce((acc, s) => acc + s.cost, 0);

  const handleDownloadReceipt = (serviceId: string) => {
    toast({
      title: 'Downloading Receipt',
      description: 'Your receipt is being prepared for download.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Service History</h1>
            <p className="text-muted-foreground">View your complete vehicle service records</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{serviceHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-success/10">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Service</p>
                  <p className="text-2xl font-bold">
                    {format(new Date(serviceHistory[0].date), 'MMM d')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Service Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceHistory.map((service) => (
                <div 
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.service}</h3>
                      <p className="text-sm text-muted-foreground">{service.center}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(service.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {service.technician}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="text-lg font-semibold">
                      {service.cost === 0 ? 'Free' : `$${service.cost.toFixed(2)}`}
                    </span>
                    <Badge className="bg-success/10 text-success border-success/20">
                      {service.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReceipt(service.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
