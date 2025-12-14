import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { maintenanceTimeline } from '@/data/mockData';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function MaintenanceTimeline() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4 text-primary" />
          Maintenance Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {maintenanceTimeline.map((item, index) => (
              <div key={item.id} className="relative pl-10">
                {/* Timeline dot */}
                <div 
                  className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                    item.type === 'completed' 
                      ? 'bg-success border-success' 
                      : item.type === 'upcoming'
                      ? 'bg-primary border-primary'
                      : 'bg-warning border-warning'
                  }`}
                />
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.type === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Calendar className="w-4 h-4 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.service}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={
                        item.type === 'completed' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : item.type === 'upcoming'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }
                    >
                      {item.type === 'completed' ? 'Done' : item.type === 'upcoming' ? 'Scheduled' : 'Predicted'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">${item.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}