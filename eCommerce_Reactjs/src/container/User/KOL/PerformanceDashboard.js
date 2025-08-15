import React, { useState, useEffect } from "react";
import { getDashboardData } from "../../../services/affiliateService";
import CommonUtils from "../../../utils/CommonUtils";
import useRealtimeStats from "../../../hooks/useRealtimeStats";
import "./PerformanceDashboard.scss";
import DashboardCharts from "./DashboardCharts";

/**
 * Performance Dashboard Component
 * Displays KOL performance metrics with visualizations and filtering
 */
const PerformanceDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30"); // Default to last 30 days
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customDateRange, setCustomDateRange] = useState(false);

  // Get user info for real-time stats
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const kolId = userInfo.id;
  const token = localStorage.getItem("token");

  // Real-time stats hook
  const {
    stats: realtimeStats,
    isConnected: isRealtimeConnected,
    isConnecting: isRealtimeConnecting,
    error: realtimeError,
    lastUpdate,
    connect: connectRealtime,
    disconnect: disconnectRealtime,
    refreshStats,
  } = useRealtimeStats({
    kolId,
    token,
    autoConnect: true,
  });

  // Calculate date range based on selection
  const getDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(days));

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDashboardData(params);

      if (response.errCode === 0) {
        setDashboardData(response.data);
      } else {
        setError(response.errMessage || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const { startDate: start, endDate: end } = getDateRange(dateRange);
    fetchDashboardData({ startDate: start, endDate: end });
  }, []);

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCustomDateRange(false);

    if (range !== "custom") {
      const { startDate: start, endDate: end } = getDateRange(range);
      fetchDashboardData({ startDate: start, endDate: end });
    }
  };

  // Handle custom date range
  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      setCustomDateRange(true);
      setDateRange("custom");
      fetchDashboardData({ startDate, endDate });
    }
  };

  // Calculate conversion rate
  const getConversionRate = (clicks, conversions) => {
    if (!clicks || clicks === 0) return 0;
    return ((conversions / clicks) * 100).toFixed(2);
  };

  // Get performance trend indicator
  const getTrendIndicator = (current, previous) => {
    if (!previous || previous === 0) return { trend: "neutral", percentage: 0 };

    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      percentage: Math.abs(change).toFixed(1),
    };
  };

  if (loading) {
    return (
      <div className="performance-dashboard">
        <div className="dashboard-loading">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-dashboard">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const data = dashboardData || {};
  const summary = data.overview || {}; // API returns 'overview' not 'summary'
  const topLinks = data.topPerformingLinks || []; // API returns 'topPerformingLinks' not 'topLinks'
  const recentActivity = data.recentActivity || [];

  console.log(dashboardData)

  return (
    <div className="performance-dashboard">
        
      <div className="dashboard-header">
        <h3>Bảng thông tin hiệu suất</h3>
        <p>
          Theo dõi hiệu suất tiếp thị liên kết và tối ưu hóa chiến lược của bạn.
        </p>

        {/* Real-time Stats Status */}
        <div className="realtime-status">
          <div
            className={`status-indicator ${
              isRealtimeConnected ? "connected" : "disconnected"
            }`}
          >
            {/* <i className={`fa ${isRealtimeConnected ? 'fa-circle' : 'fa-circle-o'}`}></i> */}
            {/* <span>
                            {isRealtimeConnecting ? 'Connecting...' : 
                             isRealtimeConnected ? 'Live Updates Active' : 'Cập nhật trực tiếp ngoại tuyến'}
                        </span> */}
            {lastUpdate && (
              <small className="last-update">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </small>
            )}
          </div>
          {!isRealtimeConnected && !isRealtimeConnecting && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={connectRealtime}
            >
              <i className="fa fa-refresh"></i> Reconnect
            </button>
          )}
          {realtimeError && (
            <div className="alert alert-warning alert-sm">
              <i className="fa fa-exclamation-triangle"></i>
              Real-time updates unavailable. Using polling fallback.
            </div>
          )}
        </div>
      </div>

      {/* Real-time Stats Section */}
      {realtimeStats && (
        <div className="realtime-stats-section">
          <h4>
            <i className="fa fa-bolt text-warning"></i>
            Live Statistics
          </h4>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div className="realtime-card">
                <h5>Last Hour</h5>
                <div className="realtime-metrics">
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.realtime?.clicks || 0}
                    </span>
                    <span className="metric-label">Clicks</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.realtime?.conversions || 0}
                    </span>
                    <span className="metric-label">Conversions</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.realtime?.conversionRate || 0}%
                    </span>
                    <span className="metric-label">Conv. Rate</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {CommonUtils.formatter.format(
                        realtimeStats.realtime?.commissionAmount || 0
                      )}
                    </span>
                    <span className="metric-label">Commission</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="realtime-card">
                <h5>Today</h5>
                <div className="realtime-metrics">
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.today?.clicks || 0}
                    </span>
                    <span className="metric-label">Clicks</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.today?.conversions || 0}
                    </span>
                    <span className="metric-label">Conversions</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {realtimeStats.today?.conversionRate || 0}%
                    </span>
                    <span className="metric-label">Conv. Rate</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      {CommonUtils.formatter.format(
                        realtimeStats.today?.commissionAmount || 0
                      )}
                    </span>
                    <span className="metric-label">Commission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {realtimeStats.pending && (
            <div className="pending-stats">
              <div className="alert alert-info">
                <i className="fa fa-clock-o"></i>
                <strong>Pending Commissions:</strong>{" "}
                {realtimeStats.pending.commissionCount || 0} transactions (
                {CommonUtils.formatter.format(
                  realtimeStats.pending.commissionAmount || 0
                )}
                )
              </div>
            </div>
          )}
        </div>
      )}

      {/* Date Range Filter */}
      <div className="date-filter-section">
        <div className="row align-items-end">
          <div className="col-md-6">
            <label className="form-label">Phạm vi ngày</label>
            <select
              className="form-select"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
            >
              <option value="7">7 ngày gần nhất</option>
              <option value="30">Tháng vừa qua</option>
              <option value="90">3 Tháng gần nhất</option>
              <option value="365">Năm gần nhất</option>
              <option value="custom">Cài đặt ngày</option>
            </select>
          </div>
          {dateRange === "custom" && (
            <>
              <div className="col-md-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCustomDateRange}
                  disabled={!startDate || !endDate}
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fa fa-mouse-pointer"></i>
              </div>
              <div className="card-content">
                <h3>{summary.totalClicks || 0}</h3>
                <p>Tổng lượt nhấp</p>
                {summary.previousClicks !== undefined && (
                  <div
                    className={`trend ${
                      getTrendIndicator(
                        summary.totalClicks,
                        summary.previousClicks
                      ).trend
                    }`}
                  >
                    <i
                      className={`fa fa-arrow-${
                        getTrendIndicator(
                          summary.totalClicks,
                          summary.previousClicks
                        ).trend === "up"
                          ? "up"
                          : "down"
                      }`}
                    ></i>
                    {
                      getTrendIndicator(
                        summary.totalClicks,
                        summary.previousClicks
                      ).percentage
                    }
                    %
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fa fa-shopping-cart"></i>
              </div>
              <div className="card-content">
                <h3>{summary.totalConversions || 0}</h3>
                <p>Chuyển đổi</p>
                {summary.previousConversions !== undefined && (
                  <div
                    className={`trend ${
                      getTrendIndicator(
                        summary.totalConversions,
                        summary.previousConversions
                      ).trend
                    }`}
                  >
                    <i
                      className={`fa fa-arrow-${
                        getTrendIndicator(
                          summary.totalConversions,
                          summary.previousConversions
                        ).trend === "up"
                          ? "up"
                          : "down"
                      }`}
                    ></i>
                    {
                      getTrendIndicator(
                        summary.totalConversions,
                        summary.previousConversions
                      ).percentage
                    }
                    %
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fa fa-percentage"></i>
              </div>
              <div className="card-content">
                <h3>
                  {getConversionRate(
                    summary.totalClicks,
                    summary.totalConversions
                  )}
                  %
                </h3>
                <p>Tỉ lệ chuyển đổi</p>
                <div className="trend neutral">
                  <i className="fa fa-info-circle"></i>
                  Avg: {summary.averageConversionRate || "0.00"}%
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="summary-card">
              <div className="card-icon">
                <i className="fa fa-dollar-sign"></i>
              </div>
              <div className="card-content">
                <h3>
                  {CommonUtils.formatter.format(summary.totalCommission || 0)}
                </h3>
                <p>Tổng hoa hồng</p>
                {summary.previousCommission !== undefined && (
                  <div
                    className={`trend ${
                      getTrendIndicator(
                        summary.totalCommission,
                        summary.previousCommission
                      ).trend
                    }`}
                  >
                    <i
                      className={`fa fa-arrow-${
                        getTrendIndicator(
                          summary.totalCommission,
                          summary.previousCommission
                        ).trend === "up"
                          ? "up"
                          : "down"
                      }`}
                    ></i>
                    {
                      getTrendIndicator(
                        summary.totalCommission,
                        summary.previousCommission
                      ).percentage
                    }
                    %
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Information */}
      {data.tierInfo && (
        // <div className="tier-info-section mb-4">
        //     <div className="row">
        //         <div className="col-lg-6">
        //             <div className="tier-card">
        //                 <div className="tier-header">
        //                     <h5>
        //                         <i className="fa fa-star text-warning"></i>
        //                         Cấp độ hiện tại: {data.tierInfo.currentTier === 'high' ? 'Hiệu suất cao' : 'Cơ bản'}
        //                     </h5>
        //                 </div>
        //                 <div className="tier-details">
        //                     <div className="tier-metric">
        //                         <span className="metric-label">Tỷ lệ hoa hồng:</span>
        //                         <span className="metric-value">{data.tierInfo.currentRate}%</span>
        //                     </div>
        //                     <div className="tier-metric">
        //                         <span className="metric-label">Tổng doanh thu:</span>
        //                         <span className="metric-value">{CommonUtils.formatter.format(data.tierInfo.totalSales)}</span>
        //                     </div>
        //                     {data.tierInfo.nextTierThreshold && (
        //                         <div className="tier-metric">
        //                             <span className="metric-label">Bán hàng cho cấp tiếp theo:</span>
        //                             <span className="metric-value">{CommonUtils.formatter.format(data.tierInfo.salesUntilNextTier)}</span>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="col-lg-6">
        //             <div className="commission-breakdown-card">
        //                 <h5>
        //                     <i className="fa fa-chart-pie text-info"></i>
        //                     Phân tích hoa hồng
        //                 </h5>
        //                 <div className="commission-stats">
        //                     <div className="commission-stat">
        //                         <span className="stat-label">Chưa giải quyết</span>
        //                         <span className="stat-value">{data.commissions?.pending?.count || 0}</span>
        //                         <span className="stat-amount">{CommonUtils.formatter.format(data.commissions?.pending?.amount || 0)}</span>
        //                     </div>
        //                     <div className="commission-stat">
        //                         <span className="stat-label">Hoàn thành</span>
        //                         <span className="stat-value">{data.commissions?.completed?.count || 0}</span>
        //                         <span className="stat-amount">{CommonUtils.formatter.format(data.commissions?.completed?.amount || 0)}</span>
        //                     </div>
        //                     <div className="commission-stat">
        //                         <span className="stat-label">Hoãn đơn</span>
        //                         <span className="stat-value">{data.commissions?.cancelled?.count || 0}</span>
        //                         <span className="stat-amount">{CommonUtils.formatter.format(data.commissions?.cancelled?.amount || 0)}</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="tier-info-section mb-4">
          <div className="row g-4">
            {/* Card Cấp độ hiện tại */}
            <div className="col-lg-6">
              <div className="card shadow border-0 rounded-4 h-100 overflow-hidden">
                <div className="card-header bg-light border-0 d-flex align-items-center py-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="fa fa-star text-warning fs-5"></i>
                  </div>
                  <h5 className="mb-0 fw-bold">
                    Cấp độ hiện tại:{" "}
                    <span
                      className={
                        data.tierInfo.currentTier === "high"
                          ? "text-success"
                          : "text-secondary"
                      }
                    >
                      {data.tierInfo.currentTier === "high"
                        ? "Hiệu suất cao"
                        : "Cơ bản"}
                    </span>
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-4">
                    <small className="text-muted d-block mb-1">
                      Tỷ lệ hoa hồng
                    </small>
                    <span className="fw-bold fs-4 text-success">
                      {data.tierInfo.currentRate}%
                    </span>
                  </div>
                  <div className="mb-4">
                    <small className="text-muted d-block mb-1">
                      Tổng doanh thu
                    </small>
                    <span className="fw-bold fs-4 text-primary">
                      {CommonUtils.formatter.format(data.tierInfo.totalSales)}
                    </span>
                  </div>
                  {data.tierInfo.nextTierThreshold && (
                    <div>
                      <small className="text-muted d-block mb-1">
                        Bán hàng cho cấp tiếp theo
                      </small>
                      <span className="fw-bold fs-6 text-info">
                        {CommonUtils.formatter.format(
                          data.tierInfo.salesUntilNextTier
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Phân tích hoa hồng */}
            <div className="col-lg-6">
              <div className="card shadow border-0 rounded-4 h-100 overflow-hidden">
                <div className="card-header bg-light border-0 d-flex align-items-center py-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="fa fa-chart-pie text-info fs-5"></i>
                  </div>
                  <h5 className="mb-0 fw-bold">Phân tích hoa hồng</h5>
                </div>
                <div className="card-body p-4">
                  {[
                    {
                      label: "Chưa giải quyết",
                      data: data.commissions?.pending,
                      color: "text-warning",
                    },
                    {
                      label: "Hoàn thành",
                      data: data.commissions?.completed,
                      color: "text-success",
                    },
                    {
                      label: "Hoãn đơn",
                      data: data.commissions?.cancelled,
                      color: "text-danger",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-center py-3 border-bottom"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <div className="fw-semibold">{item.label}</div>
                      <div
                        className="d-flex gap-3"
                        style={{
                          minWidth: "150px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <span
                          className={`fw-bold ${item.color}`}
                          style={{ minWidth: "20px", textAlign: "right" }}
                        >
                          {item.data?.count || 0}
                        </span>
                        <span
                          className="text-muted"
                          style={{ minWidth: "80px", textAlign: "right" }}
                        >
                          {CommonUtils.formatter.format(item.data?.amount || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performing Links */}
      <div className="top-links-section">
        <h4>Liên kết hoạt động hàng đầu</h4>
        {topLinks.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Lượt nhấp</th>
                  <th>Chuyển đổi</th>
                  <th>Tỷ lệ chuyển đổi</th>
                  <th>Thu nhập</th>
                </tr>
              </thead>
              <tbody>
                {topLinks.map((link, index) => (
                  <tr key={link.id || index}>
                    <td>
                      <div className="product-info">
                        <img
                          src={link.product?.image || "/default-product.jpg"}
                          alt={link.product?.name || "Product"}
                          className="product-thumb"
                        />
                        <span>{link.product?.name || "Unknown Product"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="metric-value">{link.clicks || 0}</span>
                    </td>
                    <td>
                      <span className="metric-value">
                        {link.conversions || 0}
                      </span>
                    </td>
                    <td>
                      <span className="conversion-rate">
                        {getConversionRate(link.clicks, link.conversions)}%
                      </span>
                    </td>
                    <td>
                      <span className="earnings">
                        {CommonUtils.formatter.format(link.commission || 0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <i className="fa fa-chart-line fa-2x text-muted mb-3"></i>
            <p>Không có dữ liệu hiệu suất cho khoảng thời gian đã chọn</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {/* <div className="recent-activity-section">
        <h4>Hoạt động gần đây</h4>
        {recentActivity.length > 0 ? (
          <div className="activity-list">
            {recentActivity.map((activity, index) => {
              const activityType = activity.converted ? "conversion" : "click";
              return (
                <div key={activity.id || index} className="activity-item">
                  <div className="activity-icon">
                    <i
                      className={`fa ${
                        activityType === "click"
                          ? "fa-mouse-pointer"
                          : "fa-shopping-cart"
                      }`}
                    ></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activityType === "click"
                        ? "Đã nhấp vào liên kết"
                        : "Đơn hàng đã chuyển đổi "}
                    </div>
                    <div className="activity-description">
                      {activity.product?.name || "Unknown Product"}
                      {activityType === "conversion" && activity.commission && (
                        <span className="activity-amount">
                          - {CommonUtils.formatter.format(activity.commission)}
                        </span>
                      )}
                    </div>
                    <div className="activity-time">
                      {new Date(activity.clickedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data">
            <i className="fa fa-clock fa-2x text-muted mb-3"></i>
            <p>No recent activity to display.</p>
          </div>
        )}
      </div> */}
      <div className="recent-activity-section">
        <h4>Hoạt động gần đây</h4>
        {recentActivity.length > 0 ? (
          <div
            className="activity-list border rounded p-2"
            style={{
              maxHeight: "300px", // chiều cao tối đa trước khi cuộn
              overflowY: "auto",
              scrollbarWidth: "thin", // Firefox
            }}
          >
            {recentActivity.map((activity, index) => {
              const activityType = activity.converted ? "conversion" : "click";
              return (
                <div
                  key={activity.id || index}
                  className="activity-item d-flex border-bottom py-2"
                >
                  {/* Icon */}
                  <div
                    className="activity-icon me-3 text-center"
                    style={{ width: "40px" }}
                  >
                    <i
                      className={`fa ${
                        activityType === "click"
                          ? "fa-mouse-pointer text-primary"
                          : "fa-shopping-cart text-success"
                      } fs-5`}
                    ></i>
                  </div>

                  {/* Nội dung */}
                  <div className="activity-content flex-grow-1">
                    <div className="fw-bold">
                      {activityType === "click"
                        ? "Đã nhấp vào liên kết"
                        : "Đơn hàng đã chuyển đổi"}
                    </div>
                    <div className="activity-description small text-muted">
                      {activity.product?.name || "Unknown Product"}{" "}
                      {activityType === "conversion" && activity.commission && (
                        <span className="text-success ms-1">
                          - {CommonUtils.formatter.format(activity.commission)}
                        </span>
                      )}
                    </div>
                    <div className="activity-time small text-secondary">
                      {new Date(activity.clickedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data text-center py-4">
            <i className="fa fa-clock fa-2x text-muted mb-3"></i>
            <p className="text-muted">No recent activity to display.</p>
          </div>
        )}
      </div>

      {/* Daily Performance Chart */}
      {data.dailyStats && data.dailyStats.length > 0 && (
        <div className="daily-stats-section">
          <h4>Hiệu suất hàng ngày</h4>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Lượt nhấp</th>
                  <th>Số lượt chuyển đổi</th>
                  <th>Tỉ lệ lượt chuyển đổi</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyStats.map((day, index) => (
                  <tr key={index}>
                    <td>{new Date(day.date).toLocaleDateString()}</td>
                    <td>{day.clicks || 0}</td>
                    <td>{day.conversions || 0}</td>
                    <td>
                      {day.clicks > 0
                        ? (
                            (parseFloat(day.conversions) / day.clicks) *
                            100
                          ).toFixed(2)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
