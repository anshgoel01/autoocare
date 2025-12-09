import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InventoryItem {
  id: string;
  service_center_id: string;
  name: string;
  sku: string | null;
  category: string | null;
  quantity: number;
  min_stock: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export function useInventory(serviceCenterId: string | undefined) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    if (!serviceCenterId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('service_center_id', serviceCenterId)
        .order('name', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  }, [serviceCenterId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'service_center_id' | 'created_at' | 'updated_at'>) => {
    if (!serviceCenterId) return { error: new Error('No service center ID') };

    const { error } = await supabase
      .from('inventory')
      .insert({
        service_center_id: serviceCenterId,
        ...item,
      });

    if (!error) {
      fetchInventory();
    }

    return { error };
  };

  const updateItem = async (itemId: string, updates: Partial<InventoryItem>) => {
    const { error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', itemId);

    if (!error) {
      fetchInventory();
    }

    return { error };
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemId);

    if (!error) {
      fetchInventory();
    }

    return { error };
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.min_stock);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  return { 
    inventory, 
    isLoading, 
    addItem, 
    updateItem, 
    deleteItem,
    lowStockItems,
    outOfStockItems,
    refetch: fetchInventory,
  };
}

export function getInventoryStatus(quantity: number, minStock: number): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= minStock) return 'low-stock';
  return 'in-stock';
}