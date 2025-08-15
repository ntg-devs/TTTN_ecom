

import React from "react";
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const currencyFormat = (value) =>
  value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const DashboardCharts = ({ dashboardData }) => {
  if (!dashboardData) return null;

  const { dailyStats, topPerformingLinks, commissions, overview } = dashboardData;

  // 1. AreaChart: clicks & conversions theo ngày
  const lineData = dailyStats?.map((item) => ({
    date: item.date,
    clicks: item.clicks,
    conversions: Number(item.conversions) || 0,
  })) || [];

  // 2. BarChart: Top Performing Links
  const barData = topPerformingLinks?.map((link) => ({
    product: link.product?.name || "N/A",
    clicks: link.clicks,
    conversions: link.conversions,
  })) || [];

  // 3. PieChart: Phân tích hoa hồng
  const pieData = [
    { name: "Chưa giải quyết", value: commissions?.pending?.amount || 0 },
    { name: "Hoàn thành", value: commissions?.completed?.amount || 0 },
    { name: "Hoãn đơn", value: commissions?.cancelled?.amount || 0 },
  ];

  // 4. RadialBarChart: Tỷ lệ chuyển đổi
  const conversionRate = Number(overview?.conversionRate) || 0;
  const radialData = [
    { name: "Tỷ lệ chuyển đổi", value: conversionRate, fill: "#82ca9d" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Area Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-bold mb-4">Xu hướng Clicks & Conversions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="clicks" stroke="#8884d8" fillOpacity={1} fill="url(#colorClicks)" />
            <Area type="monotone" dataKey="conversions" stroke="#82ca9d" fillOpacity={1} fill="url(#colorConversions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-bold mb-4">Top Performing Links</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
            <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-bold mb-4">Phân tích hoa hồng</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, value }) => `${name}: ${currencyFormat(value)}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => currencyFormat(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Radial Bar Chart */}
      <div className="bg-white p-4 rounded-2xl shadow relative">
        <h3 className="text-lg font-bold mb-4">Tỷ lệ chuyển đổi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={radialData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Tooltip formatter={(value) => `${value}%`} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold">{conversionRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
