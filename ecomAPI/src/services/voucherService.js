import db from "../models/index";
require('dotenv').config();
const { Op } = require("sequelize");
//==================TYPE VOUCHER====================//
let createNewTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.typeVoucher || !data.value || !data.maxValue || !data.minValue) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                await db.TypeVoucher.create({
                    typeVoucher: data.typeVoucher,
                    value: data.value,
                    maxValue: data.maxValue,
                    minValue: data.minValue
                })
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
let getDetailTypeVoucherById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.TypeVoucher.findOne({
                    where: { id: id },
                    include: [
                        { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'code'] },

                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {
                raw: true,
                nest: true

            }
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            let res = await db.Voucher.findAndCountAll(objectFilter)

            if (res && res.rows.length) {
                for (let i = 0; i < res.rows.length; i++) {
                    // Đếm số đơn đã dùng voucher
                    let countUsed = await db.Orders.count({
                        where: {
                            voucherId: res.rows[i].voucherId
                        }
                    });
                    // Gán số lượng đã dùng vào object voucher
                    res.rows[i].usedAmount = countUsed;
                }
            }
            console.log(res)

            resolve({
                errCode: 0,
                data: res.rows,
                count: res.count
            })



        } catch (error) {
            reject(error)
        }
    })
}
let updateTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.typeVoucher || !data.value || !data.maxValue || !data.minValue) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let typevoucher = await db.TypeVoucher.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (typevoucher) {
                    typevoucher.typeVoucher = data.typeVoucher;
                    typevoucher.value = data.value;
                    typevoucher.maxValue = data.maxValue;
                    typevoucher.minValue = data.minValue;
                    await typevoucher.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let deleteTypeVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let typevoucher = await db.TypeVoucher.findOne({
                    where: { id: data.id }
                })
                if (typevoucher) {
                    await db.TypeVoucher.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getSelectTypeVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let res = await db.TypeVoucher.findAll({
                include: [
                    { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'code'] },

                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: res

            })



        } catch (error) {
            reject(error)
        }
    })
}
//=======================VOUCHER===================
let createNewVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các tham số bắt buộc
            if (
                !data.code ||
                !data.type ||
                !data.quantity ||
                !data.discountValue ||
                !data.startDate ||
                !data.endDate
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
                return;
            }

            await db.Voucher.create({
                code: data.code,
                type: data.type,
                quantity: data.quantity,
                discountValue: data.discountValue,
                minOrderValue: data.minOrderValue || 0,
                maxDiscount: data.maxDiscount || 0,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            });

            resolve({
                errCode: 0,
                errMessage: 'Create voucher successfully!'
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailVoucherById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.Voucher.findOne({
                    where: { voucherId: id },
                })
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error)
        }   
    })
}
let getAllVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {
                raw: true,
                nest: true

            }
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            let res = await db.Voucher.findAndCountAll(objectFilter)

            if (res && res.rows.length) {
                for (let i = 0; i < res.rows.length; i++) {
                    // Đếm số đơn đã dùng voucher
                    let countUsed = await db.Orders.count({
                        where: {
                            voucherId: res.rows[i].voucherId
                        }
                    });
                    // Gán số lượng đã dùng vào object voucher
                    res.rows[i].usedAmount = countUsed;
                }
            }
            console.log(res)

            resolve({
                errCode: 0,
                data: res.rows,
                count: res.count
            })



        } catch (error) {
            reject(error)
        }
    })
}
let updateVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các tham số bắt buộc
            if (
                !data.id ||
                !data.startDate ||
                !data.endDate ||
                !data.type ||
                !data.quantity ||
                !data.code ||
                !data.discountValue
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                });
                return;
            }

            // Tìm voucher theo id
            let voucher = await db.Voucher.findOne({
                where: { voucherId: data.id },
                raw: false
            });

            if (voucher) {
                voucher.startDate = data.startDate;
                voucher.endDate = data.endDate;
                voucher.type = data.type;
                voucher.quantity = data.quantity;
                voucher.code = data.code;
                voucher.discountValue = data.discountValue;
                voucher.minOrderValue = data.minOrderValue || 0;
                voucher.maxDiscount = data.maxDiscount || 0;

                await voucher.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update voucher successfully!'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Voucher not found'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let voucher = await db.Voucher.findOne({
                    where: { voucherId: data.id }
                })
                if (voucher) {
                    await db.Voucher.destroy({
                        where: { voucherId: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let saveUserVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.voucherId || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let voucherused = await db.VoucherUsed.findOne({
                    where: { voucherId: data.voucherId, userId: data.userId },
                    raw: false
                })
                if (voucherused) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Đã lưu voucher này trong kho!'
                    })
                } else {
                    await db.VoucherUsed.create({
                        voucherId: data.voucherId,
                        userId: data.userId
                    })
                    let voucher = await db.Voucher.findOne({ where: { id: data.voucherId }, raw: false })

                    await voucher.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllVoucherByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let objectFilter = {
                    where: { userId: data.id, status: 0 },
                }
                if (data.limit && data.offset) {
                    objectFilter.limit = +data.limit
                    objectFilter.offset = +data.offset
                }

                let res = await db.VoucherUsed.findAndCountAll(objectFilter)
                for (let i = 0; i < res.rows.length; i++) {
                    res.rows[i].voucherData = await db.Voucher.findOne({
                        where: { id: res.rows[i].voucherId },
                        include: [
                            {
                                model: db.TypeVoucher, as: 'typeVoucherOfVoucherData',
                                include: [
                                    { model: db.Allcode, as: 'typeVoucherData', attributes: ['value', 'code'] },

                                ],
                            },

                        ],
                        raw: true,
                        nest: true
                    }
                    )
                    let voucherUsedCount = await db.VoucherUsed.findAll({
                        where: {
                            voucherId: res.rows[i].voucherData.id,
                            status: 1
                        }
                    })
                    res.rows[i].voucherData.usedAmount = voucherUsedCount.length
                }
                resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count
                })
            }


        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewTypeVoucher: createNewTypeVoucher,
    getDetailTypeVoucherById: getDetailTypeVoucherById,
    getAllTypeVoucher: getAllTypeVoucher,
    updateTypeVoucher: updateTypeVoucher,
    deleteTypeVoucher: deleteTypeVoucher,
    createNewVoucher: createNewVoucher,
    getDetailVoucherById: getDetailVoucherById,
    getAllVoucher: getAllVoucher,
    updateVoucher: updateVoucher,
    deleteVoucher: deleteVoucher,
    getSelectTypeVoucher: getSelectTypeVoucher,
    saveUserVoucher: saveUserVoucher,
    getAllVoucherByUserId: getAllVoucherByUserId
}