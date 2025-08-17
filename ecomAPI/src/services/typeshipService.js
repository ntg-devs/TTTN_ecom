import db from "../models/index";
require('dotenv').config();
const { Op } = require("sequelize");

let createNewTypeShip = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.price) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                await db.ShippingType.create({
                    name: data.name,
                    cost: data.cost
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
let getDetailTypeshipById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShippingType.findOne({
                    where: { shippingTypeId: id },
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
let getAllTypeship = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data)
        try {
            let objectFilter = {}
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            if(data.keyword !=='') objectFilter.where = {...objectFilter.where, name: {[Op.substring]: data.keyword  } }
            let res = await db.ShippingType.findAndCountAll(objectFilter)

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
let updateTypeship = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.cost) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let typeship = await db.ShippingType.findOne({
                    where: { shippingTypeId: data.id },
                    raw: false
                })
                if (typeship) {
                    typeship.name = data.name;
                    typeship.cost = data.cost;
                    await typeship.save()
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
let deleteTypeship = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let typeship = await db.ShippingType.findOne({
                    where: { shippingTypeId: data.id }
                })
                if (typeship) {
                    await db.ShippingType.destroy({
                        where: { shippingTypeId: data.id }
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
module.exports = {
    createNewTypeShip: createNewTypeShip,
    getDetailTypeshipById: getDetailTypeshipById,
    getAllTypeship: getAllTypeship,
    updateTypeship: updateTypeship,
    deleteTypeship: deleteTypeship
}