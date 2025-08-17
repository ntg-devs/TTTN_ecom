import React, { useEffect, useState } from 'react';
import { getAllVoucher, deleteVoucherService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";

const ManageVoucher = () => {
    const [dataVoucher, setDataVoucher] = useState([]);
    const [count, setCount] = useState(0);
    const [numberPage, setNumberPage] = useState(0);

    const fetchVouchers = async (page = 0) => {
        try {
            let res = await getAllVoucher({
                limit: PAGINATION.pagerow,
                offset: page * PAGINATION.pagerow
            });
            if (res && res.errCode === 0) {
                setDataVoucher(res.data);
                setCount(Math.ceil(res.count / PAGINATION.pagerow));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleDeleteVoucher = async (id) => {
        let res = await deleteVoucherService({ data: { id } });
        if (res && res.errCode === 0) {
            toast.success("Xóa voucher thành công");
            fetchVouchers(numberPage);
        } else {
            toast.error("Xóa voucher thất bại");
        }
    };

    const handleChangePage = (number) => {
        setNumberPage(number.selected);
        fetchVouchers(number.selected);
    };

    const handleExport = async () => {
        let res = await getAllVoucher({ limit: '', offset: '' });
        if (res && res.errCode === 0) {
            let exportData = res.data.map(item => ({
                "Mã voucher": item.code,
                "Loại voucher": item.type,
                "Số lượng": item.quantity,
                "Đã sử dụng": item.usedAmount,
                "Giá trị giảm": item.discountValue,
                "Giá trị tối đa": item.maxDiscount,
                "Giá trị tối thiểu đơn hàng": item.minOrderValue,
                "Ngày bắt đầu": moment(item.startDate).format('DD/MM/YYYY'),
                "Ngày kết thúc": moment(item.endDate).format('DD/MM/YYYY')
            }));
            await CommonUtils.exportExcel(exportData, "Danh sách voucher", "ListVoucher");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý mã voucher</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách mã voucher
                    <button className="btn btn-success" style={{ float: 'right' }} onClick={handleExport}>
                        Xuất excel <i className="fa-solid fa-file-excel"></i>
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã voucher</th>
                                    <th>Loại voucher</th>
                                    <th>Số lượng</th>
                                    <th>Đã sử dụng</th>
                                    <th>Giá trị giảm</th>
                                    <th>Giá trị tối đa</th>
                                    <th>Giá trị tối thiểu đơn hàng</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Ngày kết thúc</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataVoucher.length > 0 ? dataVoucher.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.usedAmount}</td>
                                        <td>{item.discountValue}</td>
                                        <td>{item.maxDiscount}</td>
                                        <td>{item.minOrderValue}</td>
                                        <td>{moment(item.startDate).format('DD/MM/YYYY')}</td>
                                        <td>{moment(item.endDate).format('DD/MM/YYYY')}</td>
                                        <td>
                                            <Link to={`/admin/edit-voucher/${item.voucherId}`}>Edit</Link>
                                            &nbsp;|&nbsp;
                                            <span
                                                style={{ color: '#0E6DFE', cursor: 'pointer' }}
                                                onClick={() => handleDeleteVoucher(item.voucherId)}
                                            >
                                                Delete
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={11} style={{ textAlign: 'center' }}>Chưa có voucher</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ReactPaginate
                previousLabel={'Quay lại'}
                nextLabel={'Tiếp'}
                breakLabel={'...'}
                pageCount={count}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={handleChangePage}
            />
        </div>
    );
};

export default ManageVoucher;
