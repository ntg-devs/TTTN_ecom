import React, { useState, useEffect } from "react";
import {
  updateKolBankInfo,
  getKolBankInfo,
  handleWithCreateDrawMoneyKOL,
  handleGetAllRequestDrawByKOL
} from "../../../services/kolService";
import axios from "axios";

function Payment() {
  const [formData, setFormData] = useState({
    user_id: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_branch: "",
  });

  const [bankInfo, setBankInfo] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");
  const [maxWithdraw, setMaxWithdraw] = useState(0);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [listRequest, setListRequest] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (user && user.id) {
        setFormData((prev) => ({
          ...prev,
          user_id: user.id,
        }));

        try {
          const resInfo = await getKolBankInfo(user.id);
          const resListRequest = await handleGetAllRequestDrawByKOL(user.id);
          setListRequest(resListRequest?.data);
          console.log(resListRequest.data)
          setBankInfo(resInfo?.data);
          if (resInfo && resInfo.data) {
            setFormData((prev) => ({
              ...prev,
              bank_name: resInfo?.data.user.bank_name || "",
              bank_account_number: resInfo?.data.user.bank_account_number || "",
              bank_account_name: resInfo?.data.user.bank_account_name || "",
              bank_branch: resInfo?.data.user.bank_branch || "",
            }));
          }

          const balanceRes = await axios.get(`/api/kol/${user.id}/balance`);
          setMaxWithdraw(balanceRes.data.balance || 0);

          const historyRes = await axios.get(
            `/api/kol/${user.id}/withdraw-history`
          );
          setWithdrawHistory(historyRes.data.history || []);
        } catch (error) {
          console.error("Error fetching data:", error);
          setMaxWithdraw(0);
          setWithdrawHistory([]);
        }
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (!isEditing) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWithdrawChange = (e) => {
    setWithdrawAmount(e.target.value);
    setWithdrawMessage("");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await updateKolBankInfo(formData);
      if (res.data.errCode === 0) {
        setMessage("Cập nhật thông tin ngân hàng thành công!");
        setIsEditing(false);
      } else {
        setMessage(`Lỗi: ${res.data.errMessage}`);
      }
    } catch (error) {
      setMessage("Lỗi server, vui lòng thử lại sau.");
      console.error(error);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);

    // if (!amount || amount < 100000) {
    //   setWithdrawMessage("Số tiền tối thiểu phải là 100.000 đồng.");
    //   return;
    // }
    // if (amount > maxWithdraw) {
    //   setWithdrawMessage(
    //     `Số tiền tối đa bạn có thể rút là ${maxWithdraw.toLocaleString()} đồng.`
    //   );
    //   return;
    // }

    setWithdrawMessage("");
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (!user || !user.id) {
        setWithdrawMessage(
          "Bạn chưa đăng nhập hoặc thông tin người dùng không hợp lệ."
        );
        return;
      }

      // Gọi service với dữ liệu cần thiết
      const response = await handleWithCreateDrawMoneyKOL({
        kolId: user.id,
        bank_account_name: formData.bank_account_name,
        bank_account_number: formData.bank_account_number,
        bank_name: formData.bank_name,
        bank_branch: formData.bank_branch,
        amount: amount,
        // Nếu có ảnh hóa đơn thì truyền vào image_bank, hiện tại bỏ trống hoặc null
        image_bank: null,
        note: null,
      });

      // if (response.errCode === 0) {
      //   setMessage("Yêu cầu rút tiền đã được gửi thành công!");
      //   setWithdrawAmount("");
      //   // Có thể bạn muốn refresh lịch sử rút tiền hoặc số dư tại đây
      //   // Ví dụ: gọi lại API lấy lịch sử mới
      //   const historyRes = await axios.get(
      //     `/api/kol/${user.id}/withdraw-history`
      //   );
      //   setWithdrawHistory(historyRes.data.history || []);
      //   // Cập nhật lại số dư
      //   const balanceRes = await axios.get(`/api/kol/${user.id}/balance`);
      //   setMaxWithdraw(balanceRes.data.balance || 0);
      // } else {
      //   setWithdrawMessage(
      //     response.errMessage || "Lỗi khi gửi yêu cầu rút tiền."
      //   );
      // }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu rút tiền:", error);
      setWithdrawMessage("Lỗi server, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 text-center">Quản lý Thanh toán</h2>

      <div
        className="d-flex"
        style={{ gap: "40px", justifyContent: "space-between" }}
      >
        {/* Bên trái - Form Thông tin ngân hàng */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4>Thông tin ngân hàng</h4>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="user_id" value={formData.user_id} />
            <div className="mb-3">
              <label htmlFor="bank_name" className="form-label">
                Tên ngân hàng
              </label>
              <input
                type="text"
                className="form-control"
                id="bank_name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                required
                placeholder="Nhập tên ngân hàng"
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bank_account_number" className="form-label">
                Số tài khoản
              </label>
              <input
                type="text"
                className="form-control"
                id="bank_account_number"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
                required
                placeholder="Nhập số tài khoản"
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bank_account_name" className="form-label">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                className="form-control"
                id="bank_account_name"
                name="bank_account_name"
                value={formData.bank_account_name}
                onChange={handleChange}
                required
                placeholder="Nhập tên chủ tài khoản"
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bank_branch" className="form-label">
                Chi nhánh
              </label>
              <input
                type="text"
                className="form-control"
                id="bank_branch"
                name="bank_branch"
                value={formData.bank_branch}
                onChange={handleChange}
                required
                placeholder="Nhập chi nhánh ngân hàng"
                disabled={!isEditing}
              />
            </div>

            {!isEditing ? (
              <button
                type="button"
                className="btn btn-secondary w-100 mb-4"
                onClick={handleEditClick}
              >
                Chỉnh sửa
              </button>
            ) : (
              <button type="submit" className="btn btn-primary w-100 mb-4">
                Cập nhật
              </button>
            )}

            {message && (
              <div className="alert alert-info" role="alert">
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Bên phải - Số dư + rút tiền + lịch sử */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4>Số dư khả dụng để rút</h4>
          <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {bankInfo?.totalCommission
              ? bankInfo.totalCommission.toLocaleString() + " đ"
              : "0 đ"}
          </p>

          <form onSubmit={handleWithdrawSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="withdrawAmount" className="form-label">
                Nhập số tiền muốn rút (tối thiểu 100.000 đồng)
              </label>
              <input
                type="number"
                className="form-control"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={handleWithdrawChange}
                placeholder="Nhập số tiền"
                // min={100000}
                // max={maxWithdraw}
                required
              />
            </div>
            {withdrawMessage && (
              <div className="alert alert-danger" role="alert">
                {withdrawMessage}
              </div>
            )}
            <button type="submit" className="btn btn-success w-100">
              Yêu cầu rút tiền
            </button>
          </form>

          <hr />

          <h4>Lịch sử rút tiền</h4>
          {withdrawHistory.length === 0 ? (
            <p>Chưa có lịch sử rút tiền.</p>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Ngày</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.amount.toLocaleString()} đ</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;
