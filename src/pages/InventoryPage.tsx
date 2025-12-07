import { useState } from 'react';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { inventoryItems, getInventoryStatus } from '@/data/mockData';
import { Search, Plus, Edit2, Package, AlertTriangle, Filter, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type InventoryItem = typeof inventoryItems[0];

export default function InventoryPage() {
  const [items, setItems] = useState(inventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    stock: 0,
    minStock: 10,
    price: 0,
    supplier: '',
  });
  const { toast } = useToast();

  const categories = [...new Set(items.map(i => i.category))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const status = getInventoryStatus(item.stock, item.minStock);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleReorder = (item: InventoryItem) => {
    toast({
      title: 'Reorder Initiated',
      description: `Reorder request for ${item.name} has been sent to ${item.supplier}.`,
    });
  };

  const handleSaveEdit = () => {
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? editItem : i));
      toast({
        title: 'Item Updated',
        description: `${editItem.name} has been updated successfully.`,
      });
      setEditItem(null);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const item: InventoryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    setItems(prev => [...prev, item]);
    toast({
      title: 'Item Added',
      description: `${item.name} has been added to inventory.`,
    });
    setAddDialogOpen(false);
    setNewItem({
      name: '',
      sku: '',
      category: '',
      stock: 0,
      minStock: 10,
      price: 0,
      supplier: '',
    });
  };

  const lowStockCount = items.filter(i => getInventoryStatus(i.stock, i.minStock) !== 'in-stock').length;

  return (
    <ServiceCenterLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">Manage parts, supplies, and stock levels</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-sm">
              <span className="font-semibold">{lowStockCount} items</span> need attention - low stock or out of stock
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Part Name</th>
                    <th className="pb-3 font-medium text-muted-foreground">SKU</th>
                    <th className="pb-3 font-medium text-muted-foreground">Category</th>
                    <th className="pb-3 font-medium text-muted-foreground text-center">Stock</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Price</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const status = getInventoryStatus(item.stock, item.minStock);
                    return (
                      <tr key={item.id} className="border-b border-border/50 table-row-hover">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.supplier}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground font-mono">{item.sku}</td>
                        <td className="py-4">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="py-4 text-center">
                          <span className={cn(
                            'font-semibold',
                            status === 'in-stock' && 'text-success',
                            status === 'low-stock' && 'text-warning',
                            status === 'out-of-stock' && 'text-critical'
                          )}>
                            {item.stock}
                          </span>
                          <span className="text-muted-foreground text-sm"> / {item.minStock}</span>
                        </td>
                        <td className="py-4">
                          <Badge className={cn(
                            status === 'in-stock' && 'inventory-status-in-stock',
                            status === 'low-stock' && 'inventory-status-low-stock',
                            status === 'out-of-stock' && 'inventory-status-out-of-stock'
                          )}>
                            {status === 'in-stock' ? 'In Stock' : 
                             status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="py-4 text-right font-medium">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditItem(item)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            {status !== 'in-stock' && (
                              <Button 
                                variant="warning" 
                                size="sm"
                                onClick={() => handleReorder(item)}
                              >
                                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                Reorder
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>Update item details and stock levels</DialogDescription>
            </DialogHeader>
            {editItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Part Name</Label>
                    <Input
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={editItem.sku}
                      onChange={(e) => setEditItem({ ...editItem, sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      value={editItem.stock}
                      onChange={(e) => setEditItem({ ...editItem, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Stock</Label>
                    <Input
                      type="number"
                      value={editItem.minStock}
                      onChange={(e) => setEditItem({ ...editItem, minStock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input
                      value={editItem.supplier}
                      onChange={(e) => setEditItem({ ...editItem, supplier: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setEditItem(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Add a new part to inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Part Name *</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Brake Pads"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU *</Label>
                  <Input
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    placeholder="BP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Stock</Label>
                  <Input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Stock</Label>
                  <Input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 10 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Supplier</Label>
                  <Input
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddItem}>
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ServiceCenterLayout>
  );
}
