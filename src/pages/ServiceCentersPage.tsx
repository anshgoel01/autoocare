import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ServiceCenterCard from '@/components/dashboard/ServiceCenterCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServiceCenters } from '@/hooks/useServiceCenters';
import { Search, MapPin, Filter, List, Map } from 'lucide-react';

export default function ServiceCentersPage() {
  const { serviceCenters } = useServiceCenters();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredCenters = serviceCenters.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = selectedService === 'all' || 
      center.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
    
    return matchesSearch && matchesService;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Service Centers</h1>
          <p className="text-muted-foreground">Find and book nearby automotive service centers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="maintenance">General Maintenance</SelectItem>
              <SelectItem value="brake">Brake Service</SelectItem>
              <SelectItem value="tire">Tires</SelectItem>
              <SelectItem value="battery">Battery</SelectItem>
              <SelectItem value="oil">Oil Change</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredCenters.length} service center{filteredCenters.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCenters.map((center) => (
                <ServiceCenterCard key={center.id} center={center} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Map View</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive map showing {filteredCenters.length} nearby service centers
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {filteredCenters.map((center) => (
                  <div 
                    key={center.id}
                    className="px-3 py-1.5 bg-secondary rounded-full text-sm flex items-center gap-1.5"
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      center.availability === 'high' ? 'bg-success' :
                      center.availability === 'medium' ? 'bg-warning' : 'bg-critical'
                    }`} />
                    {center.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
