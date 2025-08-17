import React, { useEffect, useState } from 'react';
import { createNewTypeShipService, getDetailTypeShipByIdService, updateTypeShipService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const AddTypeShip = () => {
    const [isActionADD, setIsActionADD] = useState(true);
    const { id } = useParams();

    // Đổi key từ type → name, price → cost
    const [inputValues, setInputValues] = useState({
        name: '', 
        cost: ''
    });

    useEffect(() => {
        if (id) {
            const fetchDetailTypeShip = async () => {
                setIsActionADD(false);
                let typeship = await getDetailTypeShipByIdService(id);
                if (typeship && typeship.errCode === 0) {
                    setInputValues({
                        name: typeship.data.name,
                        cost: typeship.data.cost
                    });
                }
            };
            fetchDetailTypeShip();
        }
    }, [id]);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSaveTypeShip = async () => {
        if (isActionADD) {
            let res = await createNewTypeShipService({
                name: inputValues.name,
                cost: inputValues.cost,
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm loại ship thành công");
                setInputValues({ name: '', cost: '' });
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Thêm loại ship thất bại");
            }
        } else {
            let res = await updateTypeShipService({
                name: inputValues.name,
                cost: inputValues.cost,
                id: id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật loại ship thành công");
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Cập nhật loại ship thất bại");
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại ship</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới loại ship' : 'Cập nhật thông tin loại ship'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputName">Tên loại ship</label>
                                <input
                                    type="text"
                                    value={inputValues.name}
                                    name="name"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputName"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputCost">Giá tiền</label>
                                <input
                                    type="text"
                                    value={inputValues.cost}
                                    name="cost"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputCost"
                                />
                            </div>
                        </div>
                        <button type="button" onClick={handleSaveTypeShip} className="btn btn-primary">
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTypeShip;
