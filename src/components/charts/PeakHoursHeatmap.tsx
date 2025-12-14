import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { peakHoursData } from '@/data/mockData';
import { Clock } from 'lucide-react';

const timeSlots = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];

function getHeatColor(value: number): string {
  if (value >= 9) return 'bg-chart-5/80';
  if (value >= 7) return 'bg-chart-2/70';
  if (value >= 5) return 'bg-chart-4/60';
  if (value >= 3) return 'bg-chart-1/40';
  return 'bg-chart-1/20';
}

export default function PeakHoursHeatmap() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4 text-warning" />
          Peak Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Time labels */}
          <div className="grid grid-cols-9 gap-1 mb-2">
            <div className="text-xs text-muted-foreground"></div>
            {timeSlots.map((time) => (
              <div key={time} className="text-xs text-muted-foreground text-center">
                {time}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          {peakHoursData.map((dayData) => (
            <div key={dayData.day} className="grid grid-cols-9 gap-1">
              <div className="text-xs text-muted-foreground flex items-center">
                {dayData.day}
              </div>
              {dayData.hours.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`aspect-square rounded-sm ${getHeatColor(value)} transition-all hover:scale-110 cursor-default`}
                  title={`${dayData.day} ${timeSlots[hourIndex]}: ${value} bookings`}
                />
              ))}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-chart-1/20" />
              <div className="w-3 h-3 rounded-sm bg-chart-1/40" />
              <div className="w-3 h-3 rounded-sm bg-chart-4/60" />
              <div className="w-3 h-3 rounded-sm bg-chart-2/70" />
              <div className="w-3 h-3 rounded-sm bg-chart-5/80" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}