// User Profile Data
export const userProfile = {
  id: '1',
  name: 'John Mitchell',
  email: 'john.mitchell@email.com',
  phone: '+1 (555) 123-4567',
  address: '1234 Oak Street, San Francisco, CA 94102',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  vehicle: {
    registration: 'CA-7XYZ-921',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    vin: '5YJ3E1EA1PF123456',
    odometer: 24567,
    color: 'Pearl White',
    lastService: '2024-10-15',
  },
};

// Vehicle Health Data
export const vehicleHealth = {
  overallScore: 87,
  components: [
    { name: 'Engine', health: 92, status: 'good' as const },
    { name: 'Brakes', health: 78, status: 'warning' as const },
    { name: 'Battery', health: 95, status: 'good' as const },
    { name: 'Transmission', health: 88, status: 'good' as const },
    { name: 'Tires', health: 65, status: 'warning' as const },
  ],
  nextServiceDate: '2024-12-28',
  nextServiceDays: 21,
};

// ML Predictions
export const mlPredictions = [
  {
    id: '1',
    component: 'Brake Pads',
    severity: 'high' as const,
    message: 'Front brake pads showing 68% wear. Replacement recommended within 2,000 miles.',
    predictedDate: '2024-12-20',
    confidence: 94,
  },
  {
    id: '2',
    component: 'Tire Rotation',
    severity: 'medium' as const,
    message: 'Uneven tire wear detected. Rotation recommended to extend tire life.',
    predictedDate: '2024-12-15',
    confidence: 87,
  },
  {
    id: '3',
    component: 'Air Filter',
    severity: 'low' as const,
    message: 'Air filter efficiency at 72%. Consider replacement at next service.',
    predictedDate: '2025-01-10',
    confidence: 82,
  },
  {
    id: '4',
    component: 'Battery Health',
    severity: 'critical' as const,
    message: 'Battery cell degradation detected. Diagnostic check recommended.',
    predictedDate: '2024-12-10',
    confidence: 91,
  },
];

// Telemetry Data - Extended with all 14 ML model features
export const telemetryData = {
  // Display gauges (shown on dashboard)
  engineTemp: { value: 95, unit: '°C', min: 60, max: 120, optimal: { min: 85, max: 105 } },
  batteryVoltage: { value: 12.6, unit: 'V', min: 11, max: 15, optimal: { min: 12.4, max: 14.7 } },
  tirePressure: { value: 34, unit: 'PSI', min: 25, max: 45, optimal: { min: 32, max: 36 } },
  brakeThickness: { value: 7.2, unit: 'mm', min: 2, max: 12, optimal: { min: 4, max: 12 } },
  oilLevel: { value: 45, unit: 'PSI', min: 20, max: 80, optimal: { min: 40, max: 60 } },
  coolantLevel: { value: 88, unit: '°C', min: 60, max: 110, optimal: { min: 80, max: 100 } },
};

// Full ML model input features (14 features for predict-failure API)
export const mlFeatures = {
  engine_temp: 95,           // °C - Engine temperature
  oil_pressure: 45,          // PSI - Oil pressure
  coolant_temp: 88,          // °C - Coolant temperature
  brake_pad_thickness: 7.2,  // mm - Brake pad thickness
  battery_voltage: 12.6,     // V - Battery voltage
  tire_pressure_fl: 34,      // PSI - Front left tire
  tire_pressure_fr: 33,      // PSI - Front right tire
  tire_pressure_rl: 32,      // PSI - Rear left tire
  tire_pressure_rr: 34,      // PSI - Rear right tire
  transmission_fluid_level: 75, // % - Transmission fluid level
  suspension_wear: 25,       // % - Suspension wear percentage
  odometer: 24567,           // km - Total mileage
  fuel_efficiency: 12.5,     // km/L - Current fuel efficiency
  vibration_level: 1.2,      // g - Vibration intensity
};

// Service Centers
export const serviceCenters = [
  {
    id: '1',
    name: 'AutoCare Premium',
    address: '456 Market St, San Francisco, CA',
    distance: 1.2,
    rating: 4.8,
    reviews: 342,
    availability: 'high' as const,
    phone: '+1 (555) 234-5678',
    services: ['General Maintenance', 'Brake Service', 'Battery', 'Tires'],
    openHours: '8:00 AM - 6:00 PM',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: '2',
    name: 'Tesla Service Center',
    address: '789 Van Ness Ave, San Francisco, CA',
    distance: 2.8,
    rating: 4.9,
    reviews: 567,
    availability: 'medium' as const,
    phone: '+1 (555) 345-6789',
    services: ['EV Maintenance', 'Software Updates', 'Battery Service'],
    openHours: '9:00 AM - 7:00 PM',
    lat: 37.7849,
    lng: -122.4294,
  },
  {
    id: '3',
    name: 'QuickFix Auto',
    address: '123 Mission St, San Francisco, CA',
    distance: 0.8,
    rating: 4.5,
    reviews: 189,
    availability: 'low' as const,
    phone: '+1 (555) 456-7890',
    services: ['Oil Change', 'Tire Service', 'Brake Inspection'],
    openHours: '7:00 AM - 8:00 PM',
    lat: 37.7649,
    lng: -122.4094,
  },
];

// Service History
export const serviceHistory = [
  {
    id: '1',
    date: '2024-10-15',
    service: 'Full Service Inspection',
    center: 'AutoCare Premium',
    cost: 299.99,
    status: 'completed' as const,
    technician: 'Mike Johnson',
  },
  {
    id: '2',
    date: '2024-08-22',
    service: 'Tire Rotation & Balance',
    center: 'QuickFix Auto',
    cost: 89.99,
    status: 'completed' as const,
    technician: 'Sarah Williams',
  },
  {
    id: '3',
    date: '2024-06-10',
    service: 'Brake Pad Replacement',
    center: 'Tesla Service Center',
    cost: 450.00,
    status: 'completed' as const,
    technician: 'David Chen',
  },
  {
    id: '4',
    date: '2024-04-05',
    service: 'Battery Health Check',
    center: 'Tesla Service Center',
    cost: 0,
    status: 'completed' as const,
    technician: 'Emily Rodriguez',
  },
];

// Notifications
export const notifications = [
  {
    id: '1',
    type: 'alert' as const,
    title: 'Brake Pad Warning',
    message: 'Your brake pads are showing significant wear. Schedule service soon.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'reminder' as const,
    title: 'Upcoming Service',
    message: 'Your scheduled maintenance is in 3 days.',
    time: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Service Complete',
    message: 'Your tire rotation has been completed successfully.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'promo' as const,
    title: 'Winter Special',
    message: '20% off on winter tire packages. Valid until Dec 31.',
    time: '1 week ago',
    read: true,
  },
];

// === SERVICE CENTER DASHBOARD DATA ===

// Inventory Items
export const inventoryItems = [
  {
    id: '1',
    name: 'Brake Pads - Premium Ceramic',
    sku: 'BP-CER-001',
    category: 'Brakes',
    stock: 45,
    minStock: 20,
    price: 89.99,
    supplier: 'AutoParts Pro',
    lastRestocked: '2024-11-20',
  },
  {
    id: '2',
    name: 'Engine Oil - Synthetic 5W-30',
    sku: 'OIL-SYN-530',
    category: 'Fluids',
    stock: 120,
    minStock: 50,
    price: 42.99,
    supplier: 'LubeMaster',
    lastRestocked: '2024-11-25',
  },
  {
    id: '3',
    name: 'Air Filter - Universal',
    sku: 'AF-UNI-001',
    category: 'Filters',
    stock: 8,
    minStock: 15,
    price: 24.99,
    supplier: 'FilterKing',
    lastRestocked: '2024-11-01',
  },
  {
    id: '4',
    name: 'Spark Plugs - Iridium',
    sku: 'SP-IRD-004',
    category: 'Engine',
    stock: 0,
    minStock: 25,
    price: 15.99,
    supplier: 'AutoParts Pro',
    lastRestocked: '2024-10-15',
  },
  {
    id: '5',
    name: 'Battery - 12V 60Ah',
    sku: 'BAT-12V-60',
    category: 'Electrical',
    stock: 12,
    minStock: 10,
    price: 149.99,
    supplier: 'PowerCell Inc',
    lastRestocked: '2024-11-18',
  },
  {
    id: '6',
    name: 'Transmission Fluid - ATF',
    sku: 'TF-ATF-001',
    category: 'Fluids',
    stock: 35,
    minStock: 20,
    price: 18.99,
    supplier: 'LubeMaster',
    lastRestocked: '2024-11-22',
  },
  {
    id: '7',
    name: 'Wiper Blades - 22"',
    sku: 'WB-22-001',
    category: 'Accessories',
    stock: 5,
    minStock: 12,
    price: 29.99,
    supplier: 'AutoAccessories',
    lastRestocked: '2024-11-10',
  },
  {
    id: '8',
    name: 'Coolant - Extended Life',
    sku: 'CL-EXT-001',
    category: 'Fluids',
    stock: 48,
    minStock: 25,
    price: 22.99,
    supplier: 'LubeMaster',
    lastRestocked: '2024-11-28',
  },
];

// Service Bookings
export const serviceBookings = [
  {
    id: '1',
    customer: 'John Mitchell',
    email: 'john.mitchell@email.com',
    phone: '+1 (555) 123-4567',
    vehicle: '2023 Tesla Model 3',
    registration: 'CA-7XYZ-921',
    service: 'Full Service Inspection',
    date: '2024-12-07',
    time: '09:00 AM',
    status: 'confirmed' as const,
    technician: 'Mike Johnson',
    notes: 'Customer reported unusual brake noise',
    estimatedDuration: 120,
  },
  {
    id: '2',
    customer: 'Sarah Williams',
    email: 'sarah.w@email.com',
    phone: '+1 (555) 234-5678',
    vehicle: '2022 BMW X5',
    registration: 'CA-8ABC-123',
    service: 'Brake Pad Replacement',
    date: '2024-12-07',
    time: '10:30 AM',
    status: 'in-progress' as const,
    technician: 'David Chen',
    notes: 'Front and rear brake pads',
    estimatedDuration: 90,
  },
  {
    id: '3',
    customer: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '+1 (555) 345-6789',
    vehicle: '2021 Honda Accord',
    registration: 'CA-9DEF-456',
    service: 'Oil Change',
    date: '2024-12-07',
    time: '02:00 PM',
    status: 'pending' as const,
    technician: null,
    notes: 'Synthetic oil requested',
    estimatedDuration: 45,
  },
  {
    id: '4',
    customer: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1 (555) 456-7890',
    vehicle: '2024 Mercedes C-Class',
    registration: 'CA-1GHI-789',
    service: 'Tire Rotation',
    date: '2024-12-07',
    time: '03:30 PM',
    status: 'confirmed' as const,
    technician: 'Sarah Williams',
    notes: '',
    estimatedDuration: 60,
  },
  {
    id: '5',
    customer: 'Robert Johnson',
    email: 'rjohnson@email.com',
    phone: '+1 (555) 567-8901',
    vehicle: '2020 Ford F-150',
    registration: 'CA-2JKL-012',
    service: 'Engine Diagnostic',
    date: '2024-12-08',
    time: '09:00 AM',
    status: 'confirmed' as const,
    technician: 'Mike Johnson',
    notes: 'Check engine light on',
    estimatedDuration: 90,
  },
  {
    id: '6',
    customer: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '+1 (555) 678-9012',
    vehicle: '2023 Audi Q7',
    registration: 'CA-3MNO-345',
    service: 'Battery Replacement',
    date: '2024-12-08',
    time: '11:00 AM',
    status: 'pending' as const,
    technician: null,
    notes: 'Customer will wait',
    estimatedDuration: 60,
  },
  {
    id: '7',
    customer: 'James Wilson',
    email: 'jwilson@email.com',
    phone: '+1 (555) 789-0123',
    vehicle: '2022 Chevrolet Tahoe',
    registration: 'CA-4PQR-678',
    service: 'Full Service Inspection',
    date: '2024-12-09',
    time: '10:00 AM',
    status: 'confirmed' as const,
    technician: 'David Chen',
    notes: '60,000 mile service',
    estimatedDuration: 150,
  },
  {
    id: '8',
    customer: 'Amanda Martinez',
    email: 'amartinez@email.com',
    phone: '+1 (555) 890-1234',
    vehicle: '2021 Toyota Camry',
    registration: 'CA-5STU-901',
    service: 'Transmission Service',
    date: '2024-12-06',
    time: '09:00 AM',
    status: 'completed' as const,
    technician: 'Mike Johnson',
    notes: 'Fluid flush completed',
    estimatedDuration: 120,
  },
  {
    id: '9',
    customer: 'Christopher Lee',
    email: 'clee@email.com',
    phone: '+1 (555) 901-2345',
    vehicle: '2023 Lexus RX',
    registration: 'CA-6VWX-234',
    service: 'AC Service',
    date: '2024-12-06',
    time: '02:00 PM',
    status: 'completed' as const,
    technician: 'Sarah Williams',
    notes: 'Recharged AC system',
    estimatedDuration: 75,
  },
  {
    id: '10',
    customer: 'Jennifer Taylor',
    email: 'jtaylor@email.com',
    phone: '+1 (555) 012-3456',
    vehicle: '2022 Porsche Cayenne',
    registration: 'CA-7YZA-567',
    service: 'Brake Inspection',
    date: '2024-12-10',
    time: '09:30 AM',
    status: 'confirmed' as const,
    technician: 'David Chen',
    notes: 'Premium customer - priority service',
    estimatedDuration: 45,
  },
];

// Technicians
export const technicians = [
  {
    id: '1',
    name: 'Mike Johnson',
    role: 'Senior Technician',
    specializations: ['Engine', 'Transmission', 'Diagnostics'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    available: true,
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Lead Technician',
    specializations: ['Brakes', 'Suspension', 'Steering'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    available: true,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    role: 'Technician',
    specializations: ['Electrical', 'AC', 'Tires'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    available: true,
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    role: 'EV Specialist',
    specializations: ['Electric Vehicles', 'Battery', 'Software'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    available: false,
  },
];

// Get inventory status
export function getInventoryStatus(stock: number, minStock: number): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (stock === 0) return 'out-of-stock';
  if (stock < minStock) return 'low-stock';
  return 'in-stock';
}

// Get booking status color
export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed': return 'bg-success/10 text-success border-success/20';
    case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
    case 'completed': return 'bg-muted text-muted-foreground border-muted';
    case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
    default: return 'bg-muted text-muted-foreground border-muted';
  }
}

// ============= CHART DATA FOR DASHBOARDS =============

// Vehicle Health History (Last 6 Months)
export const healthTrendData = [
  { month: 'Jul', score: 92, engine: 95, brakes: 88, battery: 96 },
  { month: 'Aug', score: 90, engine: 94, brakes: 85, battery: 95 },
  { month: 'Sep', score: 88, engine: 93, brakes: 82, battery: 94 },
  { month: 'Oct', score: 89, engine: 93, brakes: 80, battery: 95 },
  { month: 'Nov', score: 86, engine: 92, brakes: 78, battery: 94 },
  { month: 'Dec', score: 87, engine: 92, brakes: 78, battery: 95 },
];

// Service Cost Comparison (Predicted vs Actual)
export const costComparisonData = [
  { service: 'Oil Change', predicted: 85, actual: 79 },
  { service: 'Brake Service', predicted: 450, actual: 480 },
  { service: 'Tire Rotation', predicted: 80, actual: 75 },
  { service: 'Battery Check', predicted: 50, actual: 0 },
  { service: 'Full Inspection', predicted: 320, actual: 299 },
];

// Maintenance Timeline Data
export const maintenanceTimeline = [
  { id: '1', date: '2024-06-10', service: 'Brake Pad Replacement', type: 'completed', cost: 450 },
  { id: '2', date: '2024-08-22', service: 'Tire Rotation', type: 'completed', cost: 90 },
  { id: '3', date: '2024-10-15', service: 'Full Inspection', type: 'completed', cost: 299 },
  { id: '4', date: '2024-12-28', service: 'Scheduled Maintenance', type: 'upcoming', cost: 200 },
  { id: '5', date: '2025-02-15', service: 'Battery Service', type: 'predicted', cost: 150 },
];

// Daily Booking Trends (Last 30 Days)
export const bookingTrendsData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    day: date.getDate(),
    bookings: Math.floor(Math.random() * 8) + 3,
    completed: Math.floor(Math.random() * 6) + 2,
  };
});

// Monthly Revenue Data
export const revenueData = [
  { month: 'Jul', revenue: 42500, target: 40000 },
  { month: 'Aug', revenue: 45200, target: 42000 },
  { month: 'Sep', revenue: 48900, target: 45000 },
  { month: 'Oct', revenue: 52300, target: 48000 },
  { month: 'Nov', revenue: 55800, target: 52000 },
  { month: 'Dec', revenue: 49200, target: 55000 },
];

// Service Type Distribution
export const serviceTypeData = [
  { name: 'Oil Change', value: 28, color: 'hsl(var(--chart-1))' },
  { name: 'Brake Service', value: 22, color: 'hsl(var(--chart-2))' },
  { name: 'Tire Service', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Inspection', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 17, color: 'hsl(var(--chart-5))' },
];

// Peak Hours Heatmap Data
export const peakHoursData = [
  { day: 'Mon', hours: [2, 4, 6, 8, 7, 5, 3, 2] },
  { day: 'Tue', hours: [3, 5, 7, 9, 8, 6, 4, 3] },
  { day: 'Wed', hours: [4, 6, 8, 9, 9, 7, 5, 4] },
  { day: 'Thu', hours: [3, 5, 7, 8, 8, 6, 4, 3] },
  { day: 'Fri', hours: [5, 7, 9, 10, 9, 7, 5, 4] },
  { day: 'Sat', hours: [6, 8, 9, 8, 6, 4, 2, 1] },
];

// Inventory by Category
export const inventoryCategoryData = [
  { category: 'Brakes', inStock: 45, lowStock: 12, outOfStock: 3 },
  { category: 'Fluids', inStock: 203, lowStock: 25, outOfStock: 5 },
  { category: 'Filters', inStock: 68, lowStock: 18, outOfStock: 8 },
  { category: 'Electrical', inStock: 42, lowStock: 10, outOfStock: 2 },
  { category: 'Engine', inStock: 35, lowStock: 15, outOfStock: 5 },
];
