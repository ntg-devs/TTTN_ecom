import { v4 as uuidv4 } from "uuid";
import db from "../models/index";
import paypal from "paypal-rest-sdk";
const { Op } = require("sequelize");
var querystring = require("qs");
var crypto = require("crypto");

require("dotenv").config();
import moment from "moment";
import localization from "moment/locale/vi";
import { EXCHANGE_RATES } from "../utils/constants";
moment.updateLocale("vi", localization);
paypal.configure({
  mode: "sandbox",
  client_id:
    "AaeuRt8WCq9SBliEVfEyXXQMosfJD-U9emlCflqe8Blz_KWZ3lnXh1piEMcXuo78MvWj0hBKgLN-FamT",
  client_secret:
    "ENWZDMzk17X3mHFJli7sFlS9RT1Vi_aocaLsrftWZ2tjHtBVFMzr4kPf5_9iIcsbFWsHf95vXVi6EADv",
});

import multiProductAttributionService from "./multiProductAttributionService";
import { getAffiliateAttribution } from "../middlewares/affiliateAttribution";

let createNewOrder = async (data) => {
  // Hàm thay thế để xử lý tham chiếu vòng trong JSON.stringify
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  };

  try {
    // Ghi log dữ liệu đầu vào một cách an toàn
    console.log("Input data:", data);

    // Kiểm tra các tham số bắt buộc
    if (!data.userId || !data.addressUserId || !data.typeShipId || !data.arrDataShopCart || data.arrDataShopCart.length === 0 || !data.isPaymentOnlien) {
      return {
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc!",
      };
    }

    // Kiểm tra payment_method_id tồn tại và đang hoạt động
    const paymentMethod = await db.PaymentMethod.findOne({
      where: {
        paymentMethodId: data.isPaymentOnlien,

      },
    });

    if (!paymentMethod) {
      return {
        errCode: 1,
        errMessage: `Phương thức thanh toán không hợp lệ: ID ${data.isPaymentOnlien} không tồn tại hoặc không hoạt động!`,
      };
    }

    // Tính tổng số tiền từ giỏ hàng
    const totalAmount = data.totalPrice

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      customerId: data.userId,
      shippingAddressId: data.addressUserId,
      shippingTypeId: data.typeShipId,
      voucherId: data.voucherId || null,
      paymentMethodId: data.isPaymentOnlien,
      status: 'pending',
      totalAmount: totalAmount,
      note: data.note || '',
    };

    // Tạo đơn hàng chính
    let order = await db.Orders.create(orderData);

    // Chuẩn bị chi tiết đơn hàng
    const orderItems = data.arrDataShopCart.map((item) => ({
      orderId: order.orderId,
      productSizeId: item.productSize?.productSizeId,
      quantity: item.quantity,
      price: item.product?.discountPrice,
      affiliateLinkId: data.affiliateAttribution?.linkId || null,
    }));

    // Tạo chi tiết đơn hàng
    const orderDetails = await db.OrderDetail.bulkCreate(orderItems);

    console.log("orderDetails:", JSON.stringify(orderDetails, getCircularReplacer(), 2));

    // Xử lý phân bổ liên kết (affiliate attribution)
    const affiliateAttribution = data.affiliateAttribution;
    if (affiliateAttribution && affiliateAttribution.kolId && affiliateAttribution.linkId) {
      const attributionResult = await multiProductAttributionService.processOrderAttribution({
        orderItems: orderItems.map((item, index) => ({
          ...item,
          orderDetailId: orderDetails[index].orderDetailId,
          orderId: order.orderId,
        })),
        affiliateAttribution,
        orderId: order.orderId,
      });

      if (attributionResult.errCode === 0) {
        console.log("Xử lý phân bổ đa sản phẩm thành công:", {
          orderId: order.orderId,
          totalItems: attributionResult.data.totalItems,
          attributedItems: attributionResult.data.attributedItems,
          totalCommissions: attributionResult.data.totalCommissions,
          kolsInvolved: attributionResult.data.kolsInvolved,
        });
      } else {
        console.error("Lỗi khi xử lý phân bổ đa sản phẩm:", attributionResult.errMessage);
      }
    } else {
      console.log("Không tìm thấy dữ liệu phân bổ liên kết hợp lệ");
    }

    // Xóa giỏ hàng
    let cart = await db.Cart.findOne({
      where: { customerId: data.userId },
    });
    if (cart) {
      await db.CartItem.destroy({
        where: { cartId: cart.cartId },
      });
      for (let item of data.arrDataShopCart) {
        let productDetailSize = await db.ProductSize.findOne({
          where: { productSizeId: item?.productSize?.productSizeId },
          raw: false,
        });
        if (productDetailSize) {
          productDetailSize.stock -= item.quantity;
          await productDetailSize.save();
        }
      }
    }

    // Cập nhật trạng thái voucher
    // if (data.voucherId && data.userId) {
    //   let voucherUsed = await db.VoucherUsed.findOne({
    //     where: { voucherId: data.voucherId, userId: data.userId },
    //     raw: false,
    //   });
    //   if (voucherUsed) {
    //     voucherUsed.status = 1;
    //     await voucherUsed.save();
    //   }
    // }

    return {
      errCode: 0,
      errMessage: "ok",
    };
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      sql: error.sql || 'N/A',
      parameters: error.parameters || 'N/A',
    });
    throw error;
  }
};
let getAllOrders = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const objectFilter = {
        include: [
          { model: db.Customer },                // khách hàng
          { model: db.ShippingAddress },         // địa chỉ giao hàng
          { model: db.Voucher },                 // voucher (có thể null)
          {                                       // chi tiết đơn hàng
            model: db.OrderDetail,
            include: [
              { model: db.ProductSize },         // kích cỡ/sản phẩm (nếu cần sâu hơn, bổ sung association khác)
              { model: db.AffiliateLink }        // link affiliate (có thể null)
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,  // rất quan trọng khi có hasMany để count chính xác
        raw: false,
      };

      // phân trang
      if (data.limit != null && data.offset != null) {
        objectFilter.limit = +data.limit;
        objectFilter.offset = +data.offset;
      }

      // lọc theo trạng thái (schema mới: cột 'status' dạng string)
      if (data.status && data.status !== 'ALL') {
        objectFilter.where = { ...(objectFilter.where || {}), status: data.status };
      }

      // (tuỳ chọn) lọc theo customerId nếu cần
      if (data.customerId) {
        objectFilter.where = { ...(objectFilter.where || {}), customerId: +data.customerId };
      }

      // (tuỳ chọn) lọc theo khoảng thời gian
      if (data.fromDate && data.toDate) {
        objectFilter.where = {
          ...(objectFilter.where || {}),
          orderDate: { [Op.between]: [new Date(data.fromDate), new Date(data.toDate)] },
        };
      }

      const res = await db.Orders.findAndCountAll(objectFilter);

      // Trả về JSON thuần
      const rows = res.rows.map(r => r.toJSON());

      resolve({
        errCode: 0,
        data: rows,
        count: res.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailOrderById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let order = await db.OrderProduct.findOne({
          where: { id: id },
          include: [
            { model: db.TypeShip, as: "typeShipData" },
            { model: db.Voucher, as: "voucherData" },
            { model: db.Allcode, as: "statusOrderData" },
          ],
          raw: true,
          nest: true,
        });
        if (order.image) {
          order.image = new Buffer(order.image, "base64").toString("binary");
        }
        order.voucherData.typeVoucherOfVoucherData =
          await db.TypeVoucher.findOne({
            where: { id: order.voucherData.typeVoucherId },
          });
        let orderDetail = await db.OrderDetail.findAll({
          where: { orderId: id },
        });
        let addressUser = await db.AddressUser.findOne({
          where: { id: order.addressUserId },
        });
        order.addressUser = addressUser;
        let user = await db.User.findOne({
          where: { id: addressUser.userId },
          attributes: {
            exclude: ["password", "image"],
          },
          raw: true,
          nest: true,
        });
        order.userData = user;
        for (let i = 0; i < orderDetail.length; i++) {
          orderDetail[i].productDetailSize = await db.ProductDetailSize.findOne(
            {
              where: { id: orderDetail[i].productId },
              include: [{ model: db.Allcode, as: "sizeData" }],
              raw: true,
              nest: true,
            }
          );
          orderDetail[i].productDetail = await db.ProductDetail.findOne({
            where: {
              id: orderDetail[i].productDetailSize.productdetailId,
            },
          });
          orderDetail[i].product = await db.Product.findOne({
            where: { id: orderDetail[i].productDetail.productId },
          });
          orderDetail[i].productImage = await db.ProductImage.findAll({
            where: {
              productdetailId: orderDetail[i].productDetail.id,
            },
          });
          for (let j = 0; j < orderDetail[i].productImage.length; j++) {
            orderDetail[i].productImage[j].image = new Buffer(
              orderDetail[i].productImage[j].image,
              "base64"
            ).toString("binary");
          }
        }

        order.orderDetail = orderDetail;

        resolve({
          errCode: 0,
          data: order,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// let updateStatusOrder = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.id || !data.statusId) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: "Missing required parameter !",
//                 });
//             } else {
//                 let order = await db.OrderProduct.findOne({
//                     where: { id: data.id },
//                     raw: false,
//                 });
//                 order.statusId = data.statusId;
//                 await order.save();
//                 // cong lai stock khi huy don
//                 if (
//                     data.statusId == "S7" &&
//                     data.dataOrder.orderDetail &&
//                     data.dataOrder.orderDetail.length > 0
//                 ) {
//                     for (
//                         let i = 0;
//                         i < data.dataOrder.orderDetail.length;
//                         i++
//                     ) {
//                         let productDetailSize =
//                             await db.ProductDetailSize.findOne({
//                                 where: {
//                                     id: data.dataOrder.orderDetail[i]
//                                         .productDetailSize.id,
//                                 },
//                                 raw: false,
//                             });
//                         productDetailSize.stock =
//                             productDetailSize.stock +
//                             data.dataOrder.orderDetail[i].quantity;
//                         await productDetailSize.save();
//                     }
//                 }

//                 resolve({
//                     errCode: 0,
//                     errMessage: "ok",
//                 });
//             }
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

let updateStatusOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.statusId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let order = await db.OrderProduct.findOne({
          where: { id: data.id },
          raw: false,
        });
        order.statusId = data.statusId;
        await order.save();

        if (data.statusId == "S6") {
          let affiliateOrder = await db.AffiliateOrders.findOne({
            where: { orderId: data.id },
            raw: false,
          });

          if (affiliateOrder) {
            affiliateOrder.status = "completed";
            await affiliateOrder.save();
          }
        }

        // cong lai stock khi huy don
        if (
          data.statusId == "S7" &&
          data.dataOrder.orderDetail &&
          data.dataOrder.orderDetail.length > 0
        ) {
          for (let i = 0; i < data.dataOrder.orderDetail.length; i++) {
            let productDetailSize = await db.ProductDetailSize.findOne({
              where: {
                id: data.dataOrder.orderDetail[i].productDetailSize.id,
              },
              raw: false,
            });
            productDetailSize.stock =
              productDetailSize.stock + data.dataOrder.orderDetail[i].quantity;
            await productDetailSize.save();
          }
        }

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllOrdersByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let addressUser = await db.AddressUser.findAll({
          where: { userId: userId },
        });
        for (let i = 0; i < addressUser.length; i++) {
          addressUser[i].order = await db.OrderProduct.findAll({
            where: { addressUserId: addressUser[i].id },
            include: [
              { model: db.TypeShip, as: "typeShipData" },
              { model: db.Voucher, as: "voucherData" },
              { model: db.Allcode, as: "statusOrderData" },
            ],
            raw: true,
            nest: true,
          });
          for (let j = 0; j < addressUser[i].order.length; j++) {
            addressUser[i].order[j].voucherData.typeVoucherOfVoucherData =
              await db.TypeVoucher.findOne({
                where: {
                  id: addressUser[i].order[j].voucherData.typeVoucherId,
                },
              });
            let orderDetail = await db.OrderDetail.findAll({
              where: { orderId: addressUser[i].order[j].id },
            });
            for (let k = 0; k < orderDetail.length; k++) {
              orderDetail[k].productDetailSize =
                await db.ProductDetailSize.findOne({
                  where: { id: orderDetail[k].productId },
                  include: [{ model: db.Allcode, as: "sizeData" }],
                  raw: true,
                  nest: true,
                });
              orderDetail[k].productDetail = await db.ProductDetail.findOne({
                where: {
                  id: orderDetail[k].productDetailSize.productdetailId,
                },
              });
              orderDetail[k].product = await db.Product.findOne({
                where: {
                  id: orderDetail[k].productDetail.productId,
                },
              });
              orderDetail[k].productImage = await db.ProductImage.findAll({
                where: {
                  productdetailId: orderDetail[k].productDetail.id,
                },
              });
              for (let f = 0; f < orderDetail[k].productImage.length; f++) {
                orderDetail[k].productImage[f].image = new Buffer(
                  orderDetail[k].productImage[f].image,
                  "base64"
                ).toString("binary");
              }
            }

            addressUser[i].order[j].orderDetail = orderDetail;
          }
        }

        resolve({
          errCode: 0,
          data: addressUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllOrdersByShipper = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data.shipperId);
      let objectFilter = {
        include: [
          { model: db.TypeShip, as: "typeShipData" },
          { model: db.Voucher, as: "voucherData" },
          { model: db.Allcode, as: "statusOrderData" },
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
        where: { shipperId: data.shipperId },
      };

      if (data.status && data.status == "working")
        objectFilter.where = { ...objectFilter.where, statusId: "S5" };
      if (data.status && data.status == "done")
        objectFilter.where = { ...objectFilter.where, statusId: "S6" };

      let res = await db.OrderProduct.findAll(objectFilter);

      for (let i = 0; i < res.length; i++) {
        let addressUser = await db.AddressUser.findOne({
          where: { id: res[i].addressUserId },
        });
        if (addressUser) {
          let user = await db.User.findOne({
            where: { id: addressUser.userId },
          });
          res[i].userData = user;
          res[i].addressUser = addressUser;
        }
      }

      resolve({
        errCode: 0,
        data: res,
      });

      resolve({
        errCode: 0,
        data: addressUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let paymentOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Data", data);
      let listItem = [];
      let totalPriceProduct = 0;
      for (let i = 0; i < data.result.length; i++) {
        data.result[i].productDetailSize = await db.ProductDetailSize.findOne({
          where: { id: data.result[i].productId },
          include: [{ model: db.Allcode, as: "sizeData" }],
          raw: true,
          nest: true,
        });
        data.result[i].productDetail = await db.ProductDetail.findOne({
          where: {
            id: data.result[i].productDetailSize.productdetailId,
          },
        });
        data.result[i].product = await db.Product.findOne({
          where: { id: data.result[i].productDetail.productId },
        });
        data.result[i].realPrice = parseFloat(
          (data.result[i].realPrice / EXCHANGE_RATES.USD).toFixed(2)
        );

        console.log(data.result[i].realPrice);
        console.log(data.total);
        listItem.push({
          name:
            data.result[i].product.name +
            " | " +
            data.result[i].productDetail.nameDetail +
            " | " +
            data.result[i].productDetailSize.sizeData.value,
          sku: data.result[i].productId + "",
          price: data.result[i].realPrice + "",
          currency: "USD",
          quantity: data.result[i].quantity,
        });
        totalPriceProduct += data.result[i].realPrice * data.result[i].quantity;
        console.log(data.total - totalPriceProduct);
      }
      listItem.push({
        name: "Phi ship + Voucher",
        sku: "1",
        price: parseFloat(data.total - totalPriceProduct).toFixed(2) + "",
        currency: "USD",
        quantity: 1,
      });

      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://localhost:5000/payment/success`,
          cancel_url: "http://localhost:5000/payment/cancel",
        },
        transactions: [
          {
            item_list: {
              items: listItem,
            },
            amount: {
              currency: "USD",
              total: data.total,
            },
            description: "This is the payment description.",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          resolve({
            errCode: -1,
            errMessage: error,
          });
        } else {
          resolve({
            errCode: 0,
            errMessage: "ok",
            link: payment.links[1].href,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
let paymentOrderSuccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("TEsjdkjflkj", data);
      if (!data.PayerID || !data.paymentId || !data.token) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        var execute_payment_json = {
          payer_id: data.PayerID,
          transactions: [
            {
              amount: {
                currency: "USD",
                total: data.total,
              },
            },
          ],
        };

        var paymentId = data.paymentId;

        paypal.payment.execute(
          paymentId,
          execute_payment_json,
          async function (error, payment) {
            if (error) {
              resolve({
                errCode: 0,
                errMessage: error,
              });
            } else {
              let product = await db.OrderProduct.create({
                addressUserId: data.addressUserId,
                isPaymentOnlien: data.isPaymentOnlien,
                statusId: "S3",
                typeShipId: data.typeShipId,
                voucherId: data.voucherId,
                note: data.note,
              });

              // Get affiliate attribution from request
              const affiliateAttribution = getAffiliateAttribution(data.req);

              // Prepare order items for multi-product attribution
              const orderItems = data.arrDataShopCart.map((item) => ({
                ...item,
                orderId: product.dataValues.id,
              }));

              // Create order details first
              const orderDetails = await db.OrderDetail.bulkCreate(orderItems);

              // Add orderDetailId to each item for attribution processing
              const itemsWithDetailIds = orderItems.map((item, index) => ({
                ...item,
                orderDetailId: orderDetails[index].id,
                orderId: product.dataValues.id, // Add main order ID
              }));

              // Process multi-product attribution using the new service
              if (
                affiliateAttribution &&
                affiliateAttribution.kolId &&
                affiliateAttribution.affiliateId
              ) {
                const attributionResult =
                  await multiProductAttributionService.processOrderAttribution({
                    orderItems: itemsWithDetailIds,
                    affiliateAttribution,
                    orderId: product.dataValues.id,
                  });

                if (attributionResult.errCode === 0) {
                  console.log(
                    "Multi-product attribution processed successfully for PayPal order:",
                    {
                      orderId: product.dataValues.id,
                      totalItems: attributionResult.data.totalItems,
                      attributedItems: attributionResult.data.attributedItems,
                      totalCommissions: attributionResult.data.totalCommissions,
                      kolsInvolved: attributionResult.data.kolsInvolved,
                    }
                  );
                } else {
                  console.error(
                    "Error processing multi-product attribution for PayPal order:",
                    attributionResult.errMessage
                  );
                }
              } else {
                console.log(
                  "No valid affiliate attribution data found for PayPal order"
                );
              }
              let res = await db.ShopCart.findOne({
                where: { userId: data.userId, statusId: 0 },
              });
              if (res) {
                await db.ShopCart.destroy({
                  where: { userId: data.userId },
                });
                for (let i = 0; i < data.arrDataShopCart.length; i++) {
                  let productDetailSize = await db.ProductDetailSize.findOne({
                    where: {
                      id: data.arrDataShopCart[i].productId,
                    },
                    raw: false,
                  });
                  productDetailSize.stock =
                    productDetailSize.stock - data.arrDataShopCart[i].quantity;
                  await productDetailSize.save();
                }
              }
              if (data.voucherId && data.userId) {
                let voucherUses = await db.VoucherUsed.findOne({
                  where: {
                    voucherId: data.voucherId,
                    userId: data.userId,
                  },
                  raw: false,
                });
                voucherUses.status = 1;
                await voucherUses.save();
              }
              resolve({
                errCode: 0,
                errMessage: "ok",
              });
            }
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};
let paymentOrderVnpaySuccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.OrderProduct.create({
        addressUserId: data.addressUserId,
        isPaymentOnlien: data.isPaymentOnlien,
        statusId: "S3",
        typeShipId: data.typeShipId,
        voucherId: data.voucherId,
        note: data.note,
      });

      // Get affiliate attribution from request
      const affiliateAttribution =
        data.affiliateAttribution || getAffiliateAttribution(data.req);

      // Prepare order items for multi-product attribution
      const orderItems = data.arrDataShopCart.map((item) => ({
        ...item,
        orderId: product.dataValues.id,
      }));

      // Create order details first
      const orderDetails = await db.OrderDetail.bulkCreate(orderItems);

      console.log("orderDetails", orderDetails);

      // Add orderDetailId to each item for attribution processing
      const itemsWithDetailIds = orderItems.map((item, index) => ({
        ...item,
        orderDetailId: orderDetails[index].id,
        orderId: product.dataValues.id, // Add main order ID
      }));

      console.log("affiliateAttribution:", affiliateAttribution);

      // Process multi-product attribution using the new service
      if (
        affiliateAttribution &&
        affiliateAttribution.kolId &&
        affiliateAttribution.affiliateId
      ) {
        const attributionResult =
          await multiProductAttributionService.processOrderAttribution({
            orderItems: itemsWithDetailIds,
            affiliateAttribution,
            orderId: product.dataValues.id,
          });

        if (attributionResult.errCode === 0) {
          console.log("Multi-product attribution processed successfully:", {
            orderId: product.dataValues.id,
            totalItems: attributionResult.data.totalItems,
            attributedItems: attributionResult.data.attributedItems,
            totalCommissions: attributionResult.data.totalCommissions,
            kolsInvolved: attributionResult.data.kolsInvolved,
          });
        } else {
          console.error(
            "Error processing multi-product attribution:",
            attributionResult.errMessage
          );
        }
      } else {
        console.log("No valid affiliate attribution data found");
      }

      data.arrDataShopCart = data.arrDataShopCart.map((item, index) => {
        item.orderId = product.dataValues.id;
        return item;
      });

      await db.OrderDetail.bulkCreate(data.arrDataShopCart);
      let res = await db.ShopCart.findOne({
        where: { userId: data.userId, statusId: 0 },
      });
      if (res) {
        await db.ShopCart.destroy({
          where: { userId: data.userId },
        });
        for (let i = 0; i < data.arrDataShopCart.length; i++) {
          let productDetailSize = await db.ProductDetailSize.findOne({
            where: { id: data.arrDataShopCart[i].productId },
            raw: false,
          });
          productDetailSize.stock =
            productDetailSize.stock - data.arrDataShopCart[i].quantity;
          await productDetailSize.save();
        }
      }
      if (data.voucherId && data.userId) {
        let voucherUses = await db.VoucherUsed.findOne({
          where: {
            voucherId: data.voucherId,
            userId: data.userId,
          },
          raw: false,
        });
        voucherUses.status = 1;
        await voucherUses.save();
      }
      resolve({
        errCode: 0,
        errMessage: "ok",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let confirmOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.shipperId || !data.orderId || !data.statusId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let orderProduct = await db.OrderProduct.findOne({
          where: { id: data.orderId },
          raw: false,
        });
        orderProduct.shipperId = data.shipperId;
        orderProduct.statusId = data.statusId;
        await orderProduct.save();

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let paymentOrderVnpay = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      var ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      var tmnCode = process.env.VNP_TMNCODE;
      var secretKey = process.env.VNP_HASHSECRET;
      var vnpUrl = process.env.VNP_URL;
      var returnUrl = process.env.VNP_RETURNURL;

      var createDate = process.env.DATE_VNPAYMENT;
      var orderId = uuidv4();

      console.log("createDate", createDate);
      console.log("orderId", orderId);
      var amount = req.body.amount;
      var bankCode = req.body.bankCode;

      var orderInfo = req.body.orderDescription;
      var orderType = req.body.orderType;
      var locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      var currCode = "VND";
      var vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      vnp_Params["vnp_OrderType"] = orderType;
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      var signData = querystring.stringify(vnp_Params, { encode: false });

      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      console.log(vnpUrl);
      resolve({
        errCode: 200,
        link: vnpUrl,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let confirmOrderVnpay = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      var vnp_Params = data;

      var secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      var tmnCode = process.env.VNP_TMNCODE;
      var secretKey = process.env.VNP_HASHSECRET;

      var signData = querystring.stringify(vnp_Params, { encode: false });

      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

      if (secureHash === signed) {
        resolve({
          errCode: 0,
          errMessage: "Success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "failed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
let updateImageOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.image) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let order = await db.OrderProduct.findOne({
          where: { id: data.id },
          raw: false,
        });
        order.image = data.image;
        await order.save();

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewOrder: createNewOrder,
  getAllOrders: getAllOrders,
  getDetailOrderById: getDetailOrderById,
  updateStatusOrder: updateStatusOrder,
  getAllOrdersByUser: getAllOrdersByUser,
  paymentOrder: paymentOrder,
  paymentOrderSuccess: paymentOrderSuccess,
  confirmOrder: confirmOrder,
  getAllOrdersByShipper: getAllOrdersByShipper,
  paymentOrderVnpay: paymentOrderVnpay,
  confirmOrderVnpay: confirmOrderVnpay,
  paymentOrderVnpaySuccess: paymentOrderVnpaySuccess,
  updateImageOrder: updateImageOrder,
};
