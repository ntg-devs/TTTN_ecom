import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getKolApplicationDetails,
  approveKolApplication,
  rejectKolApplication,
} from "../../../services/adminKolService";
import { toast } from "react-toastify";
import moment from "moment";
import "./KolApplicationDetail.scss";

const KolApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [totalFollowers, setTotalFollowers] = useState("");
  const [displayTotalFollowers, setDisplayTotalFollowers] = useState("");

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const userInfo = JSON.parse(localStorage.getItem("userData") || "{}");

  console.log(userInfo.accountId);
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await getKolApplicationDetails(id);
      if (response && response.errCode === 0) {
        setApplication(response.data);
      } else {
        toast.error("Không thể lấy thông tin chi tiết hồ sơ KOL");
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Lỗi khi lấy thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvalReason.trim()) {
      toast.error("Vui lòng nhập lý do phê duyệt");
      return;
    }
    if (
      !totalFollowers ||
      isNaN(totalFollowers) ||
      parseInt(totalFollowers) <= 0
    ) {
      toast.error("Vui lòng nhập số lượng người theo dõi hợp lệ");
      return;
    }

    try {
      setProcessing(true);
      const response = await approveKolApplication(id, {
        reason: approvalReason,
        total_followers: parseInt(totalFollowers),
        reviewerId: userInfo.accountId,
        status: "approved",
        requestId: id,
      });

      if (response && response.errCode === 0) {
        toast.success("Phê duyệt thành công");
        setShowApproveModal(false);
        setApprovalReason("");
        setTotalFollowers("");
        setDisplayTotalFollowers("");
        fetchApplicationDetails();
      } else {
        toast.error(response.errMessage || "Phê duyệt thất bại");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Lỗi khi phê duyệt");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setProcessing(true);
      const response = await rejectKolApplication(id, {
        reason: rejectionReason,
        reviewerId: userInfo.accountId,
        status: "rejected",
        requestId: id,
      });

      if (response && response.errCode === 0) {
        toast.success("Từ chối thành công");
        setShowRejectModal(false);
        fetchApplicationDetails();
      } else {
        toast.error(response.errMessage || "Từ chối thất bại");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Lỗi khi từ chối");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format("DD/MM/YYYY HH:mm") : "N/A";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning text-dark";
      case "approved":
        return "badge bg-success";
      case "rejected":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const renderSocialMediaLinks = (links) => {
    if (!links) return <p>Không cung cấp liên kết mạng xã hội</p>;

    return (
      <ul className="list-group">
        {links.fb && (
          <li className="list-group-item">
            <i className="fab fa-facebook text-primary me-2"></i>
            <a href={links.fb} target="_blank" rel="noopener noreferrer">
              {links.fb}
            </a>
          </li>
        )}
        {links.instagram && (
          <li className="list-group-item">
            <i className="fab fa-instagram text-danger me-2"></i>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer">
              {links.instagram}
            </a>
          </li>
        )}
        {links.tiktok && (
          <li className="list-group-item">
            <i className="fab fa-tiktok text-dark me-2"></i>
            <a href={links.tiktok} target="_blank" rel="noopener noreferrer">
              {links.tiktok}
            </a>
          </li>
        )}
        {links.youtube && (
          <li className="list-group-item">
            <i className="fab fa-youtube text-danger me-2"></i>
            <a href={links.youtube} target="_blank" rel="noopener noreferrer">
              {links.youtube}
            </a>
          </li>
        )}
        {links.other && (
          <li className="list-group-item">
            <i className="fas fa-link text-secondary me-2"></i>
            <a href={links.other} target="_blank" rel="noopener noreferrer">
              {links.other}
            </a>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Chi tiết KOL</h1>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : !application ? (
        <div className="alert alert-danger">Không tìm thấy hồ sơ KOL.</div>
      ) : (
        <>
          {/* Buttons */}
          <div className="mb-4">
            <Link
              to="/admin/kol/applications"
              className="btn btn-secondary me-2"
            >
              <i className="fas fa-arrow-left me-1"></i> Quay lại
            </Link>
            {application.status === "pending" && (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={() => setShowApproveModal(true)}
                >
                  <i className="fas fa-check me-1"></i> Phê duyệt
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowRejectModal(true)}
                >
                  <i className="fas fa-times me-1"></i> Từ chối
                </button>
              </>
            )}
          </div>

          {/* Status */}
          <div className="card mb-4">
            <div className="card-header">Trạng thái hồ sơ</div>
            <div className="card-body">
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={getStatusBadgeClass(application.status)}>
                  {application.status}
                </span>
              </p>
              <p>
                <strong>Ngày nộp:</strong> {formatDate(application.createdAt)}
              </p>
              <p>
                <strong>Ngày xét duyệt:</strong>{" "}
                {application.status === "pending"
                  ? "Chưa xét duyệt"
                  : application.approvedAt
                  ? formatDate(application.approvedAt)
                  : "N/A"}
              </p>

              {application.status === "rejected" &&
                application.rejectReason && (
                  <div className="alert alert-danger mt-2">
                    <strong>Lý do:</strong> {application.rejectReason}
                  </div>
                )}
            </div>
          </div>

          {/* User */}
          {application.user && (
            <div className="card mb-4">
              <div className="card-header">Thông tin người dùng</div>
              <div className="card-body d-flex">
                {application.user.avatar ? (
                  <img
                    src={`data:image/png;base64,${application.user.avatar}`}
                    alt="avatar"
                    className="img-fluid rounded me-3"
                    style={{ maxWidth: "120px" }}
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <i className="fas fa-user fa-3x text-muted"></i>
                  </div>
                )}
                <div>
                  <h5>{application.user.fullName}</h5>
                  <p>
                    <strong>Email:</strong> {application.user.email}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong>{" "}
                    {application.user.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Giới tính:</strong>{" "}
                    {application.user.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong>{" "}
                    {application.user.dateOfBirth || "N/A"}
                  </p>
                  <p>
                    <strong>Trạng thái tài khoản:</strong>{" "}
                    {application.user.isActive
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social */}
          <div className="card mb-4">
            <div className="card-header">Liên kết MXH</div>
            <div className="card-body">
              {renderSocialMediaLinks(application.user.socialLinks)}
            </div>
          </div>
        </>
      )}

      {showApproveModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Phê duyệt hồ sơ KOL</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApproveModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Lý do phê duyệt</label>
                    <textarea
                      className="form-control"
                      value={approvalReason}
                      onChange={(e) => setApprovalReason(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tổng số followers</label>
                    <input
                      type="number"
                      className="form-control"
                      value={totalFollowers}
                      onChange={(e) => setTotalFollowers(e.target.value)}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Mức hoa hồng (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Nhập % hoa hồng"
                    />
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowApproveModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    {processing ? "Đang xử lý..." : "Xác nhận phê duyệt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showRejectModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Từ chối hồ sơ KOL</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Lý do từ chối</label>
                    <textarea
                      className="form-control"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleReject}
                    disabled={processing}
                  >
                    {processing ? "Đang xử lý..." : "Xác nhận từ chối"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default KolApplicationDetail;
