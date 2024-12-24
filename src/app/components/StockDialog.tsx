import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
interface FormData {
  stockName: string;
  ticker: string;
  quantity: string;
  buyPrice: string;
}
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
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingStock: Stock | null;
}
const StockDialog: React.FC<StockDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
  editingStock,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingStock ? "Edit Stock" : "Add Stock"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={formData.stockName}
              onChange={(e) =>
                setFormData({ ...formData, stockName: e.target.value })
              }
              placeholder="Enter company name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ticker Symbol</label>
            <Input
              value={formData.ticker}
              onChange={(e) =>
                setFormData({ ...formData, ticker: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, buyPrice: e.target.value })
              }
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
                  {editingStock ? "Updating..." : "Adding..."}
                </>
              ) : editingStock ? (
                "Update Stock"
              ) : (
                "Add Stock"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
