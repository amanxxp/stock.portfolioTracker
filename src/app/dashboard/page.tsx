"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster, toast } from 'sonner';
import { DollarSign, TrendingUp, TrendingDown, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';

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
      console.log(data)
      setStocks(data.stocks);
      console.log(stocks);
    } catch (error) {
      toast.error('Failed to load stocks');
    } finally {
      setIsLoading(false);
    }
  };
  console.log(stocks);

  useEffect(() => {
    fetchStocks();
  }, []);
  console.log(stocks);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalInvested.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.currentValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            {metrics.totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(metrics.totalProfit).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

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
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {stocks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No stocks in your portfolio. Add some stocks to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Buy Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const profit = (stock.currentPrice - stock.buyPrice) * stock.quantity;
                  return (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.stockName}</TableCell>
                      <TableCell>{stock.ticker}</TableCell>
                      <TableCell className="text-right">{stock.quantity}</TableCell>
                      <TableCell className="text-right">${stock.buyPrice}</TableCell>
                      <TableCell className="text-right">${stock.currentPrice}</TableCell>
                      <TableCell className={`text-right ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${profit.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(stock)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm"  disabled={deletingStockId===stock.id} onClick={() => handleDelete(stock.id)}>
                        {deletingStockId===stock.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" /> 
                           ) : (
                           <Trash2 className="h-4 w-4" /> 
                           )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Stock Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStock ? 'Edit Stock' : 'Add Stock'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={formData.stockName}
                onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                placeholder="Enter company name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ticker Symbol</label>
              <Input
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                placeholder="Enter ticker symbol"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Buy Price</label>
              <Input
                type="number"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                placeholder="Enter buy price"
                required
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingStock ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingStock ? 'Update Stock' : 'Add Stock'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioDashboard;