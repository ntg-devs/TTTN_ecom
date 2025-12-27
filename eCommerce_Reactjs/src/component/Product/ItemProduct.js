import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemCartStart } from '../../action/ShopCartAction';
import CommonUtils from '../../utils/CommonUtils';
import './ItemProduct.scss';
// độ phân giải ảnh có thể làm vỡ layout
function ItemProduct(props) {

    function bufferToSrc(img) {
        if (!img) return '';

        // Trường hợp backend đã trả đúng dataURL dưới dạng bytes: "data:image/jpeg;base64,...."
        if (img.type === 'Buffer' && Array.isArray(img.data)) {
            const bytes = new Uint8Array(img.data);
            const text = new TextDecoder().decode(bytes);
            if (text.startsWith('data:')) return text; // dùng luôn

            // Còn nếu là bytes ảnh “thô”, encode base64 và thêm prefix (giả sử JPEG)
            const base64 = btoa(String.fromCharCode(...bytes));
            return `data:image/jpeg;base64,${base64}`;
        }

        // Nếu đã là string (URL hoặc dataURL) thì trả thẳng
        if (typeof img === 'string') return img;

        return '';
    }

    return (
        <div className={props.type}>
            <div style={{ cursor: 'pointer' }} className="single-product">
                <Link to={`/detail-product/${props.id}`}>
                    <div style={{ width: props.width, height: props.height }} className="product-img">
                        <img className="img-fluid w-100" src={bufferToSrc(props.img)} alt="" />
                        <div className="p_icon">
                            <a >
                                <i className="ti-eye" />
                            </a>
                            <a >
                                <i className="ti-shopping-cart" />
                            </a>
                        </div>
                    </div>
                    <div style={{ width: props.width, height: '99px' }} className="product-btm">
                        <a className="d-block">
                            <h4 >{props.name}</h4>
                        </a>
                        <div className="mt-3">
                            <span className="mr-4">{CommonUtils.formatter.format(props.discountPrice)}</span>
                            <del>{CommonUtils.formatter.format(props.price)}</del>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}

export default ItemProduct;