import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface StockDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  stocks: Stock[];
}
const StockDialog: React.FC<StockDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  stocks,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock Detail</DialogTitle>
        </DialogHeader>

        <Card>
        <CardContent>
          {stocks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No stocks in your portfolio. Add some stocks to get started!
            </div>
          ) : (
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Buy Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
