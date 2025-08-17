import db from "../models/index";
const { Op } = require("sequelize");
let handleCreateNewAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (data.type && data.type === "CATEGORY") {
                    let res = await db.Category.findOne({
                        where: { category_id: data.code }
                    })

                    if (res) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Mã code đã tồn tại !'
                        })
                    } else {
                        await db.Category.create({
                            categoryName: data.value,
                            category_id: data.code
                        })
                    }

                }


                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (typeInput === "CATEGORY") {
                    let allCategory = await db.Category.findAll();
                    resolve({
                        errCode: 0,
                        data: allCategory
                    })
                }

                resolve({
                    errCode: 0,
                    data: allcode
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdateAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value || !data.code || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                console.log(data)
                if (data.type && data.type === "CATEGORY") {
                    let res = await db.Category.findOne({
                        where: {
                            category_id: data.id
                        },
                        raw: false
                    })
                    if (res) {
                        res.categoryName = data.value
                        await res.save();
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailAllCodeById = (id, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let data
                if (type && type === "CATEGORY") {
                    data = await db.Category.findOne({
                        where: { category_id: id }
                    })
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleDeleteAllCode = (allcodeId, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("allcodeId", allcodeId, "type", type)
            if (!allcodeId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                if (type && type === "CATEGORY") {
                    let foundAllCode = await db.Category.findOne({
                        where: { category_id: allcodeId }
                    })
                    console.log("foundAllCode", foundAllCode)
                    if (!foundAllCode) {
                        resolve({
                            errCode: 2,
                            errMessage: `The allCode isn't exist`
                        })
                    }
                    await db.Category.destroy({
                        where: { category_id: allcodeId }
                    })
                }

                resolve({
                    errCode: 0,
                    message: `The allCode is deleted`
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

//duy
let getListAllCodeService = (data = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { type, limit, offset, keyword } = data;
            const isCategory = String(type || '').toUpperCase() === 'CATEGORY';

            if (isCategory) {
                // LẤY DỮ LIỆU TỪ BẢNG CATEGORY
                const where = {};
                if (keyword && keyword !== '') {
                    where.categoryName = { [Op.substring]: keyword };
                }

                const options = {
                    where,
                    order: [['categoryName', 'ASC']],
                };
                if (limit != null && offset != null) {
                    options.limit = +limit;
                    options.offset = +offset;
                }

                const res = await db.Category.findAndCountAll(options);
                return resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count,
                });

            }
            return resolve({
                errCode: 0,

            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCategoryBlog = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                for (let i = 0; i < allcode.length; i++) {
                    let blog = await db.Blog.findAll({ where: { subjectId: allcode[i].code } })
                    if (blog)
                        allcode[i].countPost = blog.length
                }


                resolve({
                    errCode: 0,
                    data: allcode
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewAllCode: handleCreateNewAllCode,
    getAllCodeService: getAllCodeService,
    handleUpdateAllCode: handleUpdateAllCode,
    getDetailAllCodeById: getDetailAllCodeById,
    handleDeleteAllCode: handleDeleteAllCode,
    getListAllCodeService: getListAllCodeService,
    getAllCategoryBlog: getAllCategoryBlog
}