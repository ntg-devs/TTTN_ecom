import React, { useEffect, useState } from 'react';
import { getAllProductAdmin, getDetailReceiptByIdService, createNewReceiptDetailService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CommonUtils from '../../../utils/CommonUtils';
import moment from 'moment';

const DetailReceipt = () => {
    const { id } = useParams();
    const [dataProduct, setdataProduct] = useState([]);
    const [dataProductDetail, setdataProductDetail] = useState([]);
    const [dataProductDetailSize, setdataProductDetailSize] = useState([]);
    const [productDetailSizeId, setproductDetailSizeId] = useState('');
    const [dataReceiptDetail, setdataReceiptDetail] = useState(null);
    const [inputValues, setInputValues] = useState({
        quantity: '', price: '', productId: ''
    });

    useEffect(() => {
        loadProduct();
        loadReceiptDetail(id);
    }, [id]);

    let loadReceiptDetail = async (id) => {
        let res = await getDetailReceiptByIdService(id);
        console.log("Receipt detail:", res);
        if (res && res.errCode === 0) {
            setdataReceiptDetail(res.data); // Lưu toàn bộ object
        }
    };

    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data);
        }
    };

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleSaveReceiptDetail = async () => {
        let res = await createNewReceiptDetailService({
            receiptId: id,
            productDetailSizeId: productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price
        });
        if (res && res.errCode === 0) {
            toast.success("Thêm nhập chi tiết hàng thành công");
            setInputValues({ ...inputValues, quantity: '', price: '' });
            loadReceiptDetail(id);
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage);
        }
        else toast.error("Thêm nhập hàng thất bại");
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Chi tiết nhập hàng</h1>

            {dataReceiptDetail && (
                <div className="mb-4">
                    <h5>📌 Thông tin phiếu nhập</h5>
                    <p><b>Mã đơn:</b> {dataReceiptDetail.purchaseOrderId}</p>
                    <p><b>Nhà cung cấp:</b> {dataReceiptDetail.supplier?.name} - {dataReceiptDetail.supplier?.phone}</p>
                    <p><b>Nhân viên phụ trách:</b> {dataReceiptDetail.employee?.fullName} - {dataReceiptDetail.employee?.phone}</p>
                    <p><b>Ngày nhập:</b> {moment(dataReceiptDetail.orderDate).format("DD/MM/YYYY")}</p>
                    <p><b>Tổng tiền:</b> {CommonUtils.formatter.format(dataReceiptDetail.totalAmount)}</p>
                    <p><b>Ghi chú:</b> {dataReceiptDetail.note}</p>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết sản phẩm
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Sản phẩm</th>
                                    <th>Size</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataReceiptDetail?.details && dataReceiptDetail.details.length > 0 ? (
                                    dataReceiptDetail.details.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.product ? item.product.name : "N/A"}</td>
                                            <td>{item.size ? item.size.name : "N/A"}</td>
                                            <td>{item.quantity}</td>
                                            <td>{CommonUtils.formatter.format(item.price)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Chưa có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailReceipt;
