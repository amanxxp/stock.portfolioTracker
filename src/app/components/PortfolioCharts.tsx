import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];
interface Stock {
  id: number;
  stockName: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface PortfolioChartsProps {
  stocks: Stock[];
}

const PortfolioCharts: React.FC<PortfolioChartsProps> = ({ stocks }) => {
  const [compositionChartType, setCompositionChartType] = useState("pie");
  const [performanceChartType, setPerformanceChartType] = useState("area");

  // Prepare data for composition chart
  const compositionData = stocks.map((stock, index) => ({
    name: stock.stockName,
    value: stock.quantity * stock.buyPrice,
    qty: stock.quantity,
    color: COLORS[index % COLORS.length],
  }));

  // Prepare data for performance chart (simulated historical data)
  const performanceData = stocks.map((stock) => {
    const currentValue = stock.quantity * stock.buyPrice;
    const totalValue = currentValue * 1.5; //TODO

    return {
      name: stock.stockName,
      investment: currentValue,
      currentValue: currentValue * 1.5, // Simulate current value
      profit: currentValue * (Math.random() * 0.3), // Simulate profit
      strokeColor: totalValue < currentValue ? "#FF0000" : "#82ca9d",
    };
  });

  const renderCompositionChart = () => {
    switch (compositionChartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={compositionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {compositionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "radial":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={compositionData}
            >
              <RadialBar
                label={{ position: "insideStart", fill: "#fff" }}
                background
                dataKey="value"
              />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderPerformanceChart = () => {
    switch (performanceChartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="investment"
                stackId="1"
                stroke="#0062FF"
                fill="#0062FF"
              />
              <Area
                type="monotone"
                dataKey="currentValue"
                stackId="2"
                stroke={
                  performanceData.some((data) => data.strokeColor === "#FF0000")
                    ? "#FF0000"
                    : "#37E05C"
                }
                fill={
                  performanceData.some((data) => data.strokeColor === "#FF0000")
                    ? "#FF0000"
                    : "#37E05C"
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="investment" fill="#1FA2D4" />
              <Bar
                dataKey="currentValue"
                fill={
                  performanceData.some((data) => data.strokeColor === "#FF0000")
                    ? "#D42712"
                    : "#37E05C"
                }
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="investment" stroke="#1FA2D4" />
              <Line
                type="monotone"
                dataKey="currentValue"
                stroke={
                  performanceData.some((data) => data.strokeColor === "#FF0000")
                    ? "#D42712"
                    : "#37E05C"
                }
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Portfolio Composition Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Portfolio Composition
          </CardTitle>
          <Select
            value={compositionChartType}
            onValueChange={setCompositionChartType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="radial">Radial Chart</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>{renderCompositionChart()}</CardContent>
      </Card>

      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Portfolio Performance
          </CardTitle>
          <Select
            value={performanceChartType}
            onValueChange={setPerformanceChartType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>{renderPerformanceChart()}</CardContent>
      </Card>
    </div>
  );
};

export default PortfolioCharts;
