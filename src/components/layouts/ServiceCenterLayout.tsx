import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Wrench,
  LayoutDashboard,
  Package,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronRight,
  Bell,
} from 'lucide-react';
import NotificationDropdown from '@/components/shared/NotificationDropdown';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const serviceCenterNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/service-center-dashboard', icon: LayoutDashboard },
  { label: 'Inventory', href: '/service-center-dashboard/inventory', icon: Package },
  { label: 'Bookings', href: '/service-center-dashboard/bookings', icon: CalendarDays },
  { label: 'Customers', href: '/service-center-dashboard/customers', icon: Users },
];

export default function ServiceCenterLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 hidden lg:flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/service-center-dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center shadow-glow-accent">
              <Wrench className="w-5 h-5 text-accent-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-sidebar-foreground">Service Hub</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {serviceCenterNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'sidebar-item-active'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors',
                !sidebarOpen && 'justify-center'
              )}>
                <Avatar className="w-9 h-9 border-2 border-sidebar-accent">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                    {user?.name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      Service Center
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Service Center</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/service-center-dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 gradient-accent rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-bold text-lg">Service Hub</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-16">
          <nav className="p-4 space-y-1">
            {serviceCenterNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20',
          'pt-16 lg:pt-0'
        )}
      >
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-between px-6 bg-card border-b border-border">
          <div>
            <h1 className="text-lg font-semibold">
              {serviceCenterNavItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
