import db from "../models/index";


let createNewAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("data", data);
            if (!data.userId || !data.shipName || !data.shipPhonenumber || !data.shipAdress) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                await db.ShippingAddress.create({
                    customerId: data.userId,
                    receiverName: data.shipName,
                    receiverPhone: data.shipPhonenumber,
                    addressText: data.shipAdress,
                    isDefault: true
                });
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getAllAddressUserByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShippingAddress.findAll({
                    where: { customerId: userId }

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
let deleteAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let addressUser = await db.AddressUser.findOne({
                    where: {
                        id: data.id
                    }
                })
                if (addressUser) {
                    await db.AddressUser.destroy({
                        where: {
                            id: data.id
                        }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Địa chỉ user không tìm thấy'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let editAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.shipName || !data.shipAdress || !data.shipEmail || !data.shipPhonenumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let addressUser = await db.AddressUser.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false
                })
                if (addressUser) {
                    addressUser.shipName = data.shipName
                    addressUser.shipPhonenumber = data.shipPhonenumber
                    addressUser.shipAdress = data.shipAdress
                    addressUser.shipEmail = data.shipEmail

                    await addressUser.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Địa chỉ người dùng không tồn tại'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailAddressUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.AddressUser.findOne({
                    where: { id: id }
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

let chooseAddressForShip = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let addressUser = await db.AddressUser.findOne({
                    where: { id: id },
                    raw: false
                })

                if (addressUser) {
                    addressUser.shipChoose = true
                }
                await addressUser.save()
                resolve({
                    errCode: 0,
                    data: addressUser
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewAddressUser: createNewAddressUser,
    getAllAddressUserByUserId: getAllAddressUserByUserId,
    deleteAddressUser: deleteAddressUser,
    editAddressUser: editAddressUser,
    getDetailAddressUserById: getDetailAddressUserById,
    chooseAddressForShip: chooseAddressForShip
}