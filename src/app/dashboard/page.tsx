"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import StockTable from '@/app/components/StockTable';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import StockDialog from '@/app/components/StockDialog';
import PortfolioMetrics from '../components/PortfolioMetrics';

interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface FormData {
  stockName: string;
  ticker: string;
  quantity: string;
  buyPrice: string;
}

const PortfolioDashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingStockId, setDeletingStockId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    stockName: '',
    ticker: '',
    quantity: '',
    buyPrice: ''
  });

  const getToken = () => sessionStorage.getItem("token");
  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      const token = getToken(); // Fetch token from sessionStorage
    const response = await fetch('/api/stocks', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token to Authorization header
      },
    });
      if (!response.ok) throw new Error('Failed to fetch stocks');
      const data = await response.json();
      setStocks(data.stocks);
    } catch (error) {
      toast.error('Failed to load stocks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    return stocks.reduce(
      (acc, stock) => {
        const invested = stock.quantity * stock.buyPrice;
        const current = stock.quantity * stock.currentPrice;
        const profit = current - invested;

        return {
          totalInvested: acc.totalInvested + invested,
          currentValue: acc.currentValue + current,
          totalProfit: acc.totalProfit + profit
        };
      },
      { totalInvested: 0, currentValue: 0, totalProfit: 0 }
    );
  };

  const metrics = calculateMetrics();

  // Form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getToken();
      const stockData = {
        stockName: formData.stockName,
        ticker: formData.ticker,
        quantity: Number(formData.quantity),
        buyPrice: Number(formData.buyPrice),
        currentPrice: Number(formData.buyPrice) // In a real app, fetch current price from API
      };

      let response;
      
      if (editingStock) {
        // Update existing stock
        response = await fetch(`/api/stocks/${editingStock.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach token
          },
          body: JSON.stringify(stockData)
        });
      } else {
        // Add new stock
        response = await fetch('/api/stocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach token
          },
          body: JSON.stringify(stockData)
        });
      }

      if (!response.ok) throw new Error('Failed to save stock');

      toast.success(editingStock ? 'Stock updated successfully' : 'Stock added successfully');
      await fetchStocks(); // Refresh stocks list
      setIsDialogOpen(false);
      setEditingStock(null);
      setFormData({ stockName: '', ticker: '', quantity: '', buyPrice: '' });

    } catch (error) {
      toast.error('Failed to save stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit stock handler
  const handleEdit = async (stock: Stock) => {
    try {
      setEditingStock(stock);
      setFormData({
        stockName: stock.stockName,
        ticker: stock.ticker,
        quantity: stock.quantity.toString(),
        buyPrice: stock.buyPrice.toString()
      });
      setIsDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load stock details');
    }
  };

  // Delete stock handler
  const handleDelete = async (stockId: number) => {
    try {
      setDeletingStockId(stockId);
      const token = getToken(); // Fetch token from localStorage
    const response = await fetch(`/api/stocks/${stockId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });
      
      if (!response.ok) throw new Error('Failed to delete stock');
      
      toast.success('Stock deleted successfully');
      await fetchStocks(); // Refresh stocks list
    } catch (error) {
      toast.error('Failed to delete stock');
    }finally{
      setDeletingStockId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Portfolio Metrics */}
      <PortfolioMetrics metrics={metrics} />

      {/* Add Stock Button */}
      <Button onClick={() => {
        setEditingStock(null);
        setFormData({ stockName: '', ticker: '', quantity: '', buyPrice: '' });
        setIsDialogOpen(true);
      }}>
        <Plus className="h-4 w-4 mr-2" />
        Add Stock
      </Button>

      {/* Stocks Table */}
    <StockTable  
      stocks={stocks}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      deletingStockId={deletingStockId}
    />

      {/* Add/Edit Stock Dialog */}
      <StockDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        editingStock={editingStock}
      />
    </div>
  );
};

export default PortfolioDashboard;