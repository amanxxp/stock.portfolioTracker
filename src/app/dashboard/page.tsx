"use client";

import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster, toast } from 'sonner';
import { DollarSign, TrendingUp, TrendingDown, Pencil, Trash2, Plus } from 'lucide-react';

// Type definitions

interface Stock {
  id: number;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface FormData {
  name: string;
  ticker: string;
  quantity: string;
  buyPrice: string;
}

const PortfolioDashboard: React.FC = () => {
  // State
  const [stocks, setStocks] = useState<Stock[]>([
    { id: 1, name: 'Apple Inc', ticker: 'AAPL', quantity: 10, buyPrice: 150, currentPrice: 175 },
    { id: 2, name: 'Microsoft', ticker: 'MSFT', quantity: 5, buyPrice: 280, currentPrice: 310 }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    ticker: '',
    quantity: '',
    buyPrice: ''
  });

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
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newStock: Stock = {
      id: editingStock ? editingStock.id : Date.now(),
      ...formData,
      quantity: Number(formData.quantity),
      buyPrice: Number(formData.buyPrice),
      currentPrice: Number(formData.buyPrice) // In a real app, fetch current price from API
    };

    if (editingStock) {
      setStocks(stocks.map(stock => 
        stock.id === editingStock.id ? newStock : stock
      ));
      toast.success('Stock updated successfully');
    } else {
      setStocks([...stocks, newStock]);
      toast.success('Stock added successfully');
    }

    setIsDialogOpen(false);
    setEditingStock(null);
    setFormData({ name: '', ticker: '', quantity: '', buyPrice: '' });
  };

  // Edit stock handler
  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setFormData({
      name: stock.name,
      ticker: stock.ticker,
      quantity: stock.quantity.toString(),
      buyPrice: stock.buyPrice.toString()
    });
    setIsDialogOpen(true);
  };

  // Delete stock handler
  const handleDelete = (stockId: number) => {
    setStocks(stocks.filter(stock => stock.id !== stockId));
    toast.success('Stock deleted successfully');
  };

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
        setFormData({ name: '', ticker: '', quantity: '', buyPrice: '' });
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
                    <TableCell>{stock.name}</TableCell>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(stock.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ticker Symbol</label>
              <Input
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                placeholder="Enter ticker symbol"
                required
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
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingStock ? 'Update Stock' : 'Add Stock'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioDashboard;