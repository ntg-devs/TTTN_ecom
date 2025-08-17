import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
    getSelectTypeVoucher,
    createNewVoucherService,
    getDetailVoucherByIdService,
    updateVoucherService,
} from "../../../services/userService";
import moment from "moment";

const AddVoucher = () => {
    const { id } = useParams();
    const [dataTypeVoucher, setDataTypeVoucher] = useState([]);
    const [inputValues, setInputValues] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        type: "percent",
        quantity: "",
        code: "",
        discountValue: "",
        minOrderValue: "",
        maxDiscount: "",
        isActionADD: true,
        fromDateUpdate: "",
        toDateUpdate: "",
    });

    useEffect(() => {
        const fetchTypeVoucher = async () => {
            let res = await getSelectTypeVoucher();
            if (res && res.errCode === 0) setDataTypeVoucher(res.data);
        };
        fetchTypeVoucher();

        if (id) {
            const fetchVoucher = async () => {
                let res = await getDetailVoucherByIdService(id);
                if (res && res.errCode === 0) {
                    const data = res.data;
                    setInputValues({
                        ...inputValues,
                        fromDate: new Date(data.startDate),
                        toDate: new Date(data.endDate),
                        type: data.type,
                        quantity: data.quantity,
                        code: data.code,
                        discountValue: data.discountValue,
                        minOrderValue: data.minOrderValue,
                        maxDiscount: data.maxDiscount,
                        isActionADD: false,
                        fromDateUpdate: data.startDate,
                        toDateUpdate: data.endDate,
                    });
                }
            };
            fetchVoucher();
        }
    }, [id]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSaveVoucher = async () => {
        const payload = {
            code: inputValues.code,
            type: inputValues.type,
            quantity: parseInt(inputValues.quantity),
            discountValue: parseFloat(inputValues.discountValue),
            minOrderValue: parseFloat(inputValues.minOrderValue || 0),
            maxDiscount: parseFloat(inputValues.maxDiscount || 0),
            startDate: new Date(inputValues.fromDate).getTime(),
            endDate: new Date(inputValues.toDate).getTime(),
        };

        if (inputValues.isActionADD) {
            const res = await createNewVoucherService(payload);
            if (res && res.errCode === 0) {
                toast.success("Tạo voucher thành công!");
                setInputValues({
                    ...inputValues,
                    fromDate: new Date(),
                    toDate: new Date(),
                    type: "percent",
                    quantity: "",
                    code: "",
                    discountValue: "",
                    minOrderValue: "",
                    maxDiscount: "",
                });
            } else toast.error(res.errMessage);
        } else {
            const res = await updateVoucherService({ ...payload, id });
            if (res && res.errCode === 0) toast.success("Cập nhật voucher thành công!");
            else toast.error(res.errMessage);
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">{inputValues.isActionADD ? "Thêm mới voucher" : "Cập nhật voucher"}</h1>
            <div className="card mb-4">
                <div className="card-header">Thông tin voucher</div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Ngày bắt đầu</label>
                                <DatePicker
                                    className="form-control"
                                    selected={inputValues.fromDate}
                                    onChange={(date) => setInputValues({ ...inputValues, fromDate: date })}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Ngày kết thúc</label>
                                <DatePicker
                                    className="form-control"
                                    selected={inputValues.toDate}
                                    onChange={(date) => setInputValues({ ...inputValues, toDate: date })}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Loại voucher</label>
                                <select
                                    className="form-control"
                                    name="type"
                                    value={inputValues.type}
                                    onChange={handleOnChange}
                                >
                                    <option value="percent">Phần trăm</option>
                                    <option value="amount">Số tiền</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label>Số lượng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    value={inputValues.quantity}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Mã voucher</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    value={inputValues.code}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Giá trị giảm</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="discountValue"
                                    value={inputValues.discountValue}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Giá trị tối thiểu đơn hàng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minOrderValue"
                                    value={inputValues.minOrderValue}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Giá trị tối đa</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxDiscount"
                                    value={inputValues.maxDiscount}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSaveVoucher}
                        >
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVoucher;
