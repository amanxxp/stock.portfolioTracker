"use client";

import React, { useState, FormEvent, useEffect } from "react";
import StockTable from "@/app/components/StockTable";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import StockDialog from "@/app/components/StockDialog";
import PortfolioMetrics from "../../components/PortfolioMetrics";

interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

const PortfolioDashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getToken = () => sessionStorage.getItem("token");
  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      const token = getToken(); // Fetch token from sessionStorage
      const response = await fetch("/api/stocks", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to Authorization header
        },
      });
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(data.stocks);
    } catch (error) {
      toast.error("Failed to load stocks");
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
          totalProfit: acc.totalProfit + profit,
        };
      },
      { totalInvested: 0, currentValue: 0, totalProfit: 0 }
    );
  };

  const metrics = calculateMetrics();

  // Form submit handler

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* <Header/> */}
      <div className="px-6 -mt-[70px] max-w-[1450px] mx-auto space-y-6">
        <Toaster position="top-center" expand={true} richColors />

        {/* Portfolio Metrics */}
        <PortfolioMetrics stocks={stocks} metrics={metrics} />
      </div>
    </>
  );
};

export default PortfolioDashboard;
