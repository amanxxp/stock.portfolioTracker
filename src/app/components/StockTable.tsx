import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}
interface StockTableProps {
  stocks: Stock[];
  handleEdit: (stock: Stock) => void;
  handleDelete: (id: number) => void;
  deletingStockId: number | null;
}
const stockTable:React.FC<StockTableProps>  = ({ stocks, handleEdit, handleDelete, deletingStockId }) => {
  return (
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
  )
}

export default stockTable