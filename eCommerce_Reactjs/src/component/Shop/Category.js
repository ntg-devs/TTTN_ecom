import React, { useState, useEffect } from "react";
import { getAllCodeService } from "../../services/userService";
function Category(props) {
    const [arrCategory, setarrCategory] = useState([]);
    const [activeLinkId, setactiveLinkId] = useState(0);

    useEffect(() => {
        let fetchCategory = async () => {
            let arrData = await getAllCodeService("CATEGORY");
            //console.log("arrData", arrData);
            if (arrData && arrData.errCode === 0) {
                arrData.data.unshift({
                    createdAt: null,
                    categoryId: 0,
                    type: "CATEGORY",
                    categoryName: "Tất cả",
                });

                setarrCategory(arrData.data);
            }
        };
        fetchCategory();
    }, []);
    let handleClickCategory = (code) => {
        props.handleRecevieDataCategory(code);
        setactiveLinkId(code);
    };

    return (
        <aside className="left_widgets p_filter_widgets">
            <div className="l_w_title">
                <h3>Các danh mục</h3>
            </div>
            <div className="widgets_inner">
                <ul className="list">
                    {arrCategory &&
                        arrCategory.length > 0 &&
                        arrCategory.map((item, index) => {
                            return (
                                <li

                                    className={
                                        item.categoryId === activeLinkId
                                            ? "active"
                                            : ""
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleClickCategory(item.categoryId)
                                    }
                                    key={index}
                                >
                                    <a>{item.categoryName}</a>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </aside>
    );
}

export default Category;
