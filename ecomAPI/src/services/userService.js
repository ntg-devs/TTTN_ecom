import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
import CommonUtils from '../utils/CommonUtils';
const { Op, where } = require("sequelize");
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);

let buildUrlEmail = (token, userId) => {

    let result = `${process.env.URL_REACT}/verify-email?token=${token}&userId=${userId}`;
    return result;
}

let hashUserPasswordFromBcrypt = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await db.Account.findAll({
                where: { email: userEmail },
                include: [{
                    model: db.AccountRole
                }]
            });
            const hasRole3 = accounts.some(acc =>
                Array.isArray(acc.AccountRoles) &&
                acc.AccountRoles.some(r => r.roleId === 3)
            );

            if (hasRole3) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.lastName) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Your email is already in used, Plz try another email!'
                    })
                } else {
                    let hashPassword = await hashUserPasswordFromBcrypt(data.password);
                    console.log("hashPassword", data)
                    const account = await db.Account.create({
                        email: data.email,
                        password: hashPassword,
                    })
                    if (data.roleId === "employee") {
                        await db.AccountRole.create({
                            accountId: account.accountId,
                            roleId: 2
                        })
                        await db.Employee.create({
                            accountId: account.accountId,
                            fullName: data.lastName,
                            dateOfBirth: data.dob,
                            idCard: data?.cccd,
                            gender: data.gender || null,
                            phone: data.phonenumber || null
                        })
                    } else {
                        await db.AccountRole.create({
                            accountId: account.accountId,
                            roleId: 3
                        })
                        console.log(account.accountId);
                        await db.Customer.create({
                            accountId: account.accountId,
                            fullName: data.lastName,
                            dateOfBirth: data.dob,
                            gender: data.gender || null,
                            phone: data.phonenumber || null
                        })
                    }

                    resolve({
                        errCode: 0,
                        message: 'OK'
                    })
                }

            }

        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: userId }
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `The user isn't exist`
                    })
                }
                await db.User.destroy({
                    where: { id: userId }
                })
                resolve({
                    errCode: 0,
                    message: `The user is deleted`
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}


//duy
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const accountId = Number(data.id);
            if (!accountId) throw new Error('accountId không hợp lệ');

            // Chuẩn hóa payload chung cho Customer/Employee
            const payload = {
                fullName: data.lastName || null,
                dateOfBirth: data.dob || null,              // YYYY-MM-DD (DATEONLY)
                gender: data.genderId || null,              // Ở model là string => "Nam"/"Nữ"
                phone: data.phonenumber || null
            };

            // Chọn bảng theo roleId
            let Model = null;
            if (data.roleId === 'employee') {
                Model = db.Employee;
            } else if (data.roleId === 'customer') {
                Model = db.Customer;
            } else {
                throw new Error('roleId không hợp lệ (chỉ nhận "employee" hoặc "customer")');
            }

            // Cập nhật theo accountId
            const [affected] = await Model.update(payload, {
                where: { accountId },
                transaction: t
            });

            if (!affected) {
                await t.rollback();
                return resolve({ errCode: 1, message: 'Không tìm thấy bản ghi để cập nhật' });
            }

            await t.commit();

            // Lấy lại bản ghi sau cập nhật, kèm Account + Roles
            const updated = await Model.findOne({
                where: { accountId },
                include: [{
                    model: db.Account,
                    attributes: ['accountId', 'email', 'isActive'],
                    where: { isActive: 1 },         // chỉ lấy khi account active
                    required: true,
                    include: [{
                        model: db.AccountRole,
                        attributes: ['roleId'],
                        required: false,
                        include: [{
                            model: db.Role,
                            attributes: ['roleId', 'roleName']
                        }]
                    }]
                }],
                raw: true,
                nest: true
            });

            return resolve({
                errCode: 0,
                message: 'OK',
                data: updated
            });
        } catch (error) {
            try { await t.rollback(); } catch (_) { }
            reject(error);
        }
    });
};

let handleLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("dtata", data)

            if (!data.email || !data.password) {
                resolve({
                    errCode: 4,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let userData = {};

                const accounts = await db.Account.findAll({
                    where: { email: data.email },
                });
                if (accounts) {
                    let check = await bcrypt.compareSync(data.password, accounts[0].password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';

                        delete accounts[0].password;


                        userData.accessToken = CommonUtils.encodeToken(accounts[0].accountId)
                    } else {
                        userData.errCode = 3;

                        userData.errMessage = 'Wrong password';
                    }
                }



                if (accounts[0].isActive === 0) {
                    resolve({
                        errCode: 5,
                        errMessage: 'Bi cam'
                    })
                }
                const role = await db.AccountRole.findAll({
                    where: { accountId: accounts[0].accountId },
                })


                console.log("accounts", role)

                for (let i = 0; i < role.length; i++) {

                    if (role[i].roleId === 3) {
                        userData.user = await db.Customer.findOne({
                            attributes: ['full_name', 'date_of_birth', 'gender', 'phone', 'customerId'],
                            where: { accountId: accounts[0].accountId },
                            raw: true
                        })
                        userData.user.roleId = role[i].roleId;
                    }
                    else if (role[i].roleId === 4) {
                        userData.user = await db.KolInfo.findOne({
                            attributes: ['full_name', 'date_of_birth', 'gender', 'phone'],
                            where: { accountId: accounts[0].accountId },
                            raw: true
                        })
                        userData.user.roleId = role[i].roleId;
                    }
                    else if (role[i].roleId === 1 || role[i].roleId === 2) {
                        userData.user = await db.Employee.findOne({
                            attributes: ['full_name', 'date_of_birth', 'gender', 'phone'],
                            where: { accountId: accounts[0].accountId },
                            raw: true
                        })
                        userData.user.roleId = role[i].roleId;
                    }
                }

                console.log("userData", userData)
                resolve(userData)
            }


        } catch (error) {
            reject(error)
        }
    })
}
let handleChangePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.password || !data.oldpassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (await bcrypt.compareSync(data.oldpassword, user.password)) {
                    if (user) {
                        user.password = await hashUserPasswordFromBcrypt(data.password);
                        await user.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mật khẩu cũ không chính xác'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const objectFilter = {
                where: {},   // điều kiện trên bảng customer
                include: [{
                    model: db.Account,
                    attributes: ['accountId', 'email', 'isActive'],
                    where: { isActive: 1 },          // hoặc true
                    required: true,                  // chỉ lấy customer có account active
                    include: [{
                        model: db.AccountRole,         // nối thêm account_role
                        attributes: ['roleId'],
                        where: { roleId: { [Op.in]: [2, 3] } }, // chỉ lấy role R1, R2, R3, R4
                        include: [{
                            model: db.Role,              // nếu cần tên/quyền
                            attributes: ['roleId', 'roleName'] // tuỳ field trong Role
                        }]
                    }]
                }],
                raw: true,
                nest: true,
                distinct: true                    // để count đúng khi có include
            };

            if (data.limit) objectFilter.limit = +data.limit;
            if (data.offset) objectFilter.offset = +data.offset;

            // Customer có field 'phone' (không phải 'phonenumber')
            if (data.keyword && data.keyword !== '') {
                objectFilter.where.phone = { [Op.substring]: data.keyword };
            }

            const resC = await db.Customer.findAndCountAll(objectFilter);
            const resE = await db.Employee.findAndCountAll(objectFilter);

            resolve({
                errCode: 0,
                data: [...resC.rows, ...resE.rows],
                count: resC.count + resE.count
            });
        } catch (error) {
            reject(error);
        }
    })
}
let getDetailUserById = (accountId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!accountId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                const objectFilter = {
                    where: {},
                    include: [{
                        model: db.Account,
                        attributes: ['accountId', 'email', 'isActive'],
                        where: { isActive: 1, accountId: accountId },          // hoặc true
                        required: true,                  // chỉ lấy customer có account active
                        include: [{
                            model: db.AccountRole,         // nối thêm account_role
                            attributes: ['roleId'],
                            where: { roleId: { [Op.in]: [2, 3] } }, // chỉ lấy role R1, R2, R3, R4
                            include: [{
                                model: db.Role,              // nếu cần tên/quyền
                                attributes: ['roleId', 'roleName'] // tuỳ field trong Role
                            }]
                        }]
                    }],
                    raw: true,
                    nest: true,
                };



                const resC = await db.Customer.findAndCountAll(objectFilter);
                const resE = await db.Employee.findAndCountAll(objectFilter);

                resolve({
                    errCode: 0,
                    data: [...resC.rows, ...resE.rows],
                    count: resC.count + resE.count
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let res = await db.User.findOne({
                    where: { id: userid, statusId: 'S1' },
                    attributes: ['password']

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
let handleSendVerifyEmailUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })

                if (user) {
                    let token = uuidv4();
                    user.usertoken = token;
                    await emailService.sendSimpleEmail({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        redirectLink: buildUrlEmail(token, user.id),
                        email: user.email,
                        type: 'verifyEmail'
                    })
                    await user.save();

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
let handleVerifyEmailUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                        usertoken: data.token
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })

                if (user) {
                    user.isActiveEmail = 1
                    user.usertoken = "";

                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'User not found!'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleSendEmailForgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let check = await checkUserEmail(email)
                if (check === true) {
                    let user = await db.User.findOne({
                        where: { email: email },
                        attributes: {
                            exclude: ['password']
                        },
                        raw: false
                    })

                    if (user) {
                        let token = uuidv4();
                        user.usertoken = token;
                        await emailService.sendSimpleEmail({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            redirectLink: `${process.env.URL_REACT}/verify-forgotpassword?token=${token}&userId=${user.id}`,
                            email: user.email,
                            type: 'forgotpassword'
                        })
                        await user.save();

                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Your's email isn't exist in your system. plz try other email`
                    })
                }



            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.token || !data.password) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                        usertoken: data.token
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })

                if (user) {
                    user.password = await hashUserPasswordFromBcrypt(data.password);
                    user.usertoken = "";

                    await user.save();

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
let checkPhonenumberEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let email = await db.Account.findOne({
            //     where: { email: data.email }
            // })
            // if (phone) {
            //     resolve({
            //         isCheck: true,
            //         errMessage: "Số điện thoại đã tồn tại"
            //     })
            // }
            // if (email) {
            //     resolve({
            //         isCheck: true,
            //         errMessage: "Email đã tồn tại"
            //     })
            // }

            resolve({
                isCheck: false,
                errMessage: "Hợp lệ"
            })

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    getAllUser: getAllUser,
    getDetailUserById: getDetailUserById,
    handleSendVerifyEmailUser: handleSendVerifyEmailUser,
    handleVerifyEmailUser: handleVerifyEmailUser,
    handleSendEmailForgotPassword: handleSendEmailForgotPassword,
    handleForgotPassword: handleForgotPassword,
    checkPhonenumberEmail: checkPhonenumberEmail
}