import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function KolStatsChart({ stats }) {
  const [selectedKol, setSelectedKol] = useState("all");

  const dateChartData = Array.isArray(stats?.byDate)
    ? stats.byDate.map((item) => ({
        date: item.date,
        revenue: parseFloat(item.totalRevenue),
        commission: parseFloat(item.totalCommission),
        completedOrders: parseInt(item.completedOrders, 10),
        orders: item.totalOrders,
      }))
    : [];

  const kolChartData =
    selectedKol === "all" || !Array.isArray(stats?.byKOLAndProduct)
      ? []
      : stats.byKOLAndProduct
          .filter((item) => String(item.kolId) === selectedKol)
          .map((item) => ({
            product: item.productName || `Sản phẩm #${item.productId}`,
            revenue: parseFloat(item.totalRevenue),
            commission: parseFloat(item.totalCommission),
            completedOrders: parseInt(item.completedOrders, 10),
            orders: item.totalOrders,
          }));

  const kolRevenueData = Array.isArray(stats?.byKOL)
    ? stats.byKOL.map((kol) => ({
        name: kol.kolFirstName
          ? `${kol.kolFirstName} ${kol.kolLastName}`
          : kol.kolLastName,
        revenue: parseFloat(kol.totalRevenue),
        commission: parseFloat(kol.totalCommission),
        completedOrders: parseInt(kol.completedOrders, 10),
        totalOrders: kol.totalOrders,
      }))
    : [];

  return (
    <div className="container mt-4">
      {/* Tổng quan */}
      <div className="row mb-4 text-white">
        <div className="col-md-3">
          <div className="card p-3 text-center bg-primary text-white">
            <h6 style={{ color: "white" }}>Tổng KOL</h6>
            <h4 style={{ color: "white" }}>{stats?.overall.totalKOLs}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center bg-success text-white">
            <h6 style={{ color: "white" }}>Sản phẩm</h6>
            <h4 style={{ color: "white" }}>{stats?.overall.totalProducts}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center bg-danger text-white">
            <h6 style={{ color: "white" }}>Doanh thu</h6>
            <h4 style={{ color: "white" }}>{Number(stats?.overall.totalRevenue).toLocaleString()} đ</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center bg-warning text-white">
            <h6 style={{ color: "white" }}>Hoa hồng</h6>
            <h4 style={{ color: "white" }}>{Number(stats?.overall.totalCommission).toLocaleString()} đ</h4>
          </div>
        </div>
      </div>

      {/* Chart tổng thể theo thời gian */}
      <div className="card p-3 mb-4">
        <h5>Doanh thu & Hoa hồng theo thời gian</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dateChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" /> {/* trục Y trái (mặc định) */}
            <YAxis yAxisId="right" orientation="right" /> {/* trục Y phải */}
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Doanh thu"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="commission"
              stroke="#82ca9d"
              name="Hoa hồng"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="completedOrders"
              stroke="#ff7300"
              name="Đơn hàng hoàn thành"
              activeDot={{ r: 8 }}
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart doanh thu & hoa hồng theo từng KOL */}
      <div className="card p-3 mb-4">
        <h5>So sánh Doanh thu & Hoa hồng theo KOL</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kolRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
            <Bar dataKey="commission" fill="#82ca9d" name="Hoa hồng" />
            <Bar
              dataKey="completedOrders"
              fill="#ff7300"
              name="Đơn hàng hoàn thành"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chọn KOL */}
      <div className="mb-3">
        <label className="form-label">Chọn KOL:</label>
        <select
          className="form-select"
          value={selectedKol}
          onChange={(e) => setSelectedKol(e.target.value)}
        >
          <option value="all">Tất cả</option>
          {stats?.byKOL.map((kol) => (
            <option key={kol.kolId} value={kol.kolId}>
              {kol.kolFirstName
                ? `${kol.kolFirstName} ${kol.kolLastName}`
                : kol.kolLastName}
            </option>
          ))}
        </select>
      </div>

      {/* Chart theo sản phẩm (chỉ khi chọn KOL cụ thể) */}
      {selectedKol !== "all" && (
        <div className="card p-3">
          <h5>Doanh thu & Hoa hồng theo sản phẩm của KOL</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kolChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              <Bar dataKey="commission" fill="#82ca9d" name="Hoa hồng" />
              <Bar
                dataKey="completedOrders"
                fill="#ff7300"
                name="Đơn hàng hoàn thành"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
