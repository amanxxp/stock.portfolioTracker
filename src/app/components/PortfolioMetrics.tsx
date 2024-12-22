import React from "react";
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

  return (
    <div className="space-y-4 p-4 bg-background">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
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

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
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
            <CardTitle className="text-2xl font-medium">
              Total Invested
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalInvested.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium">
              Current Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.currentValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Profit/Loss
            </CardTitle>
            {metrics.totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
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

      {/* Card with additional information (example of improving design) */}
      <Card className="p-4 bg-card rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Additional Stats</h2>
          <Button size="sm" variant="outline" className="text-primary">
            {/*TODO pop up dialog box of all the stock person have*/}
            View Details
          </Button>
        </div>
        <div className="p-8 ">
          {/* Add some extra stats or information here */}
          <PortfolioCharts stocks={stocks} />
        </div>
      </Card>
    </div>
  );
};

export default PortfolioMetrics;
