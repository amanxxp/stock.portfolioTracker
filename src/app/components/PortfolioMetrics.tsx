import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  LineChart,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioCharts from "./PortfolioCharts";
import SmStockDialog from "./SmStockDialog";
interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}
interface PortfolioMetricsProps {
  metrics: {
    totalInvested: number;
    currentValue: number;
    totalProfit: number;
  };
  stocks: Stock[];
}
const PortfolioMetrics: React.FC<PortfolioMetricsProps> = ({
  metrics,
  stocks,
}) => {
  const percentageChange =
    ((metrics.currentValue - metrics.totalInvested) / metrics.totalInvested) *
    100;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="space-y-4 p-4 rounded-lg bg-background">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mt-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <LineChart className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Investment Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  percentageChange >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {percentageChange >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(percentageChange).toFixed(2)}%
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated{" "}
                {new Date().toLocaleTimeString("en-US", { hour12: false })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0 ">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Total Portfolio Value:</span>
          <span className="text-sm font-bold">
            ${metrics.currentValue.toFixed(2)}
          </span>
        </div>
      </div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium pb-4">
              Invested Value
            </CardTitle>
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalInvested.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium pb-4">
              Current Value
            </CardTitle>
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.currentValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium pb-4">
              Total Profit/Loss
            </CardTitle>
            {metrics.totalProfit >= 0 ? (
              <TrendingUp className="h-10 w-10 text-green-500" />
            ) : (
              <TrendingDown className="h-10 w-10 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.totalProfit >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${Math.abs(metrics.totalProfit).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-2 bg-card rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mt-2 ml-2">Additional Stats</h2>
          <Button
            size="lg"
            variant="stock"
            className=" mr-2"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            View Details
          </Button>
          <SmStockDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            stocks={stocks}
          />
        </div>
        <div className="p-6">
          <PortfolioCharts stocks={stocks} />
        </div>
      </Card>
    </div>
  );
};

export default PortfolioMetrics;
