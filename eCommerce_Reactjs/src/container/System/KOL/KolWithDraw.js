import React, { useEffect, useState } from "react";
import { handleGetAllDrawKOL } from "../../../services/kolService";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Đang chờ xử lý" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "completed", label: "Hoàn thành" },
];

function KolWithDraw() {
  const [drawList, setDrawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Giả sử updateDrawKOLStatus đã được import, hoặc bạn thay thế bằng API phù hợp
  const updateDrawKOLStatus = async (id, data) => {
    // TODO: gọi API update status
    // Ví dụ trả về { errCode: 0 } khi thành công
    console.log("Gửi cập nhật cho ID:", id, data);
    return { errCode: 0 }; // tạm thời giả lập thành công
  };

  useEffect(() => {
    fetchDrawList();
  }, []);

  async function fetchDrawList() {
    setLoading(true);
    setError("");
    try {
      const response = await handleGetAllDrawKOL();
      if (response.errCode === 0) {
        setDrawList(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setError(response.errMessage || "Không thể tải dữ liệu");
        setDrawList([]);
      }
    } catch (err) {
      setError("Lỗi kết nối hoặc server");
      setDrawList([]);
    }
    setLoading(false);
  }

  const groupByStatus = (list) => {
    if (!Array.isArray(list)) return {};
    return list.reduce((acc, item) => {
      const key = item.status || "pending";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  };

  const groupedDraws = groupByStatus(drawList);
  const filteredData = selectedStatus === "all" ? drawList : groupedDraws[selectedStatus] || [];

  const handleApproveClick = (id) => {
    setEditingId(id);
    setNote("");
    setImageFile(null);
  };

  const handleRejectClick = async (id) => {
    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu này?")) return;
    try {
      setSubmitting(true);
      const res = await updateDrawKOLStatus(id, { status: "rejected" });
      if (res.errCode === 0) {
        alert("Đã từ chối yêu cầu thành công");
        await fetchDrawList();
      } else {
        alert("Lỗi: " + res.errMessage);
      }
    } catch {
      alert("Lỗi server, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApproval = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Vui lòng chọn ảnh xác nhận thanh toán");
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("status", "approved");
      formData.append("note", note);
      formData.append("image_bank", imageFile);

      const res = await updateDrawKOLStatus(editingId, formData);
      if (res.errCode === 0) {
        alert("Cập nhật trạng thái thành công");
        setEditingId(null);
        setNote("");
        setImageFile(null);
        await fetchDrawList();
      } else {
        alert("Lỗi: " + res.errMessage);
      }
    } catch {
      alert("Lỗi server, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Danh sách yêu cầu rút tiền từ KOL</h2>

      <div className="mb-4" style={{ maxWidth: 300 }}>
        <label htmlFor="statusFilter" className="form-label fw-semibold">
          Lọc theo trạng thái:
        </label>
        <select
          id="statusFilter"
          className="form-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={submitting}
        >
          {STATUS_OPTIONS.map((opt) => (    
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <div className="alert alert-info text-center">Chưa có yêu cầu rút tiền nào.</div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div
          className="table-responsive shadow-sm rounded"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>ID</th>
                <th>KOL</th>
                <th>Số tiền (đ)</th>
                <th>Ngân hàng</th>
                <th>Số tài khoản</th>
                <th>Tên chủ tài khoản</th>
                <th>Chi nhánh</th>
                <th>Ngày yêu cầu</th>
                <th>Ngày rút</th>
                <th>Người duyệt</th>
                <th>Ghi chú</th>
                <th style={{ minWidth: "180px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td>{item.id}</td>
                    <td>
                      {item.kol
                        ? `${item.kol.firstName || ""} ${item.kol.lastName || ""}`
                        : "N/A"}
                    </td>
                    <td>{Number(item.amount).toLocaleString()}</td>
                    <td>{item.bank_name}</td>
                    <td>{item.bank_account_number}</td>
                    <td>{item.bank_account_name}</td>
                    <td>{item.bank_branch || "-"}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      {item.withdrawAt
                        ? new Date(item.withdrawAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {item.reviewedBy
                        ? `${item.reviewedBy.firstName || ""} ${
                            item.reviewedBy.lastName || ""
                          }`
                        : "-"}
                    </td>
                    <td>{item.note || "-"}</td>
                    <td>
                      {item.status === "pending" && editingId !== item.id && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm flex-grow-1"
                            onClick={() => handleApproveClick(item.id)}
                            disabled={submitting}
                          >
                            Đồng ý
                          </button>
                          <button
                            className="btn btn-danger btn-sm flex-grow-1"
                            onClick={() => handleRejectClick(item.id)}
                            disabled={submitting}
                          >
                            Không đồng ý
                          </button>
                        </div>
                      )}

                      {item.status === "pending" && editingId === item.id && (
                        <form
                          onSubmit={handleSubmitApproval}
                          className="mt-3 p-3 border rounded bg-light"
                        >
                          <div className="mb-3">
                            <label
                              className="form-label fw-semibold"
                              htmlFor={`image_bank_${item.id}`}
                            >
                              Ảnh xác nhận thanh toán:
                            </label>
                            <input
                              type="file"
                              id={`image_bank_${item.id}`}
                              accept="image/*"
                              className="form-control"
                              onChange={(e) => setImageFile(e.target.files[0])}
                              disabled={submitting}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Ghi chú:</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              disabled={submitting}
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm flex-grow-1"
                              disabled={submitting}
                            >
                              Gửi duyệt
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm flex-grow-1"
                              onClick={() => setEditingId(null)}
                              disabled={submitting}
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default KolWithDraw;
