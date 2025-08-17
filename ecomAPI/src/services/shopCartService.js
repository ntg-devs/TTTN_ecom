import db from "../models/index";

// Helper: Buffer BLOB -> data:image/*;base64,...
function toDataUrl(imgBufOrString, fallbackMime = 'image/jpeg') {
  if (!imgBufOrString) return null;
  if (typeof imgBufOrString === 'string') {
    // đã là data URL hoặc base64 string
    if (imgBufOrString.startsWith('data:')) return imgBufOrString;
    // nếu là chuỗi base64 thuần (ít gặp), bọc lại:
    return `data:${fallbackMime};base64,${imgBufOrString}`;
  }
  if (Buffer.isBuffer(imgBufOrString)) {
    return `data:${fallbackMime};base64,${imgBufOrString.toString('base64')}`;
  }
  // trường hợp { type:'Buffer', data:[...] } từ JSON hóa
  if (imgBufOrString && imgBufOrString.type === 'Buffer' && Array.isArray(imgBufOrString.data)) {
    return `data:${fallbackMime};base64,${Buffer.from(imgBufOrString.data).toString('base64')}`;
  }
  return null;
}


let addShopCart = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // mapping cũ -> mới
      const customerId = data.customerId ?? data.userId;
      const productSizeId = data.productSizeId ?? data.productdetailsizeId;
      const { quantity, type } = data;

      if (!customerId || !productSizeId || !quantity) {
        return resolve({ errCode: 1, errMessage: 'Missing required parameter !' });
      }

      await db.sequelize.transaction(async (t) => {
        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty <= 0) {
          const e = new Error('INVALID_QTY'); throw e;
        }

        // lock dòng product size
        const productSize = await db.ProductSize.findByPk(productSizeId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!productSize) {
          const e = new Error('NOT_FOUND_PS'); throw e;
        }
        const stock = Number(productSize.stock) || 0;

        // helper: lấy/ tạo cart (có fallback nếu DB chưa có cột status)
        const getOrCreateActiveCart = async () => {
          try {
            // TH1: DB có cột status
            let cart = await db.Cart.findOne({
              where: { customerId, },
              attributes: ['cartId', 'customerId'], // tránh select 'status' nếu DB không có
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
            if (cart) return cart;
            // tạo cart active
            return await db.Cart.create(
              { customerId, },
              { transaction: t }
            );
          } catch (err) {
            // Fallback khi lỗi do thiếu cột 'status'
            if (err?.original?.code === 'ER_BAD_FIELD_ERROR') {
              // TH2: DB chưa có cột status -> bỏ status khỏi WHERE/INSERT
              let cart = await db.Cart.findOne({
                where: { customerId },

                attributes: ['cartId', 'customerId',],
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              if (cart) return cart;
              // tạo cart không set status
              return await db.Cart.create(
                { customerId },
                { transaction: t }
              );
            }
            throw err;
          }
        };

        const cart = await getOrCreateActiveCart();

        // tìm cart item và khoá
        let item = await db.CartItem.findOne({
          where: { cartId: cart.cartId, productSizeId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        let newQty = (type === 'UPDATE_QUANTITY')
          ? qty
          : (item ? Number(item.quantity) : 0) + qty;

        if (newQty > stock) {
          const e = new Error('OUT_OF_STOCK'); e.stock = stock; throw e;
        }
        if (item) {
          await db.CartItem.update(
            { quantity: newQty },
            {
              where: { cartId: cart.cartId, productSizeId },
              transaction: t,
            }
          );
        } else {
          await db.CartItem.create(
            { cartId: cart.cartId, productSizeId, quantity: newQty },
            { transaction: t }
          );
        }
      });

      return resolve({ errCode: 0, errMessage: 'ok' });
    } catch (error) {
      if (error.message === 'OUT_OF_STOCK') {
        return resolve({
          errCode: 2,
          errMessage: `Chỉ còn ${error.stock} sản phẩm`,
          quantity: error.stock,
        });
      }
      if (error.message === 'NOT_FOUND_PS') {
        return resolve({ errCode: 3, errMessage: 'Product size not found' });
      }
      if (error.message === 'INVALID_QTY') {
        return resolve({ errCode: 4, errMessage: 'Số lượng không hợp lệ' });
      }
      return reject(error);
    }
  });
};

let getAllShopCartByUserId = (customerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!customerId) {
        return resolve({ errCode: 1, errMessage: 'Thiếu tham số bắt buộc!' });
      }

      // B1: Lấy cart mới nhất của customer
      const cart = await db.Cart.findOne({
        where: { customerId: Number(customerId) },
        order: [['cartId', 'DESC']],
        raw: true
      });

      if (!cart) {
        return resolve({ errCode: 0, data: [] });
      }

      // B2: Lấy cart items + liên kết
      const items = await db.CartItem.findAll({
        where: { cartId: cart.cartId },
        attributes: ['cartItemId', 'quantity'],
        include: [
          {
            model: db.ProductSize,
            attributes: ['productSizeId', 'stock'],
            required: true,
            include: [
              {
                model: db.Size,
                attributes: ['sizeId', 'name'], // Lấy cột 'name' từ bảng Size
                required: false
              },
              {
                model: db.Product,
                attributes: [
                  'productId', 'name', 'description',
                  'originalPrice', 'discountPrice', 'madeBy', 'material', 'categoryId'
                ],
                required: true,
                include: [
                  { model: db.Category, attributes: ['categoryId', 'categoryName'], required: false },
                  {
                    model: db.ProductImage,
                    attributes: ['image', 'description'],
                    required: false,
                    separate: true,
                    order: [['imageId', 'ASC']],
                  }
                ]
              }
            ]
          }
        ],
        raw: false
      });

      // Chuẩn hóa dữ liệu cho FE
      const data = items.map(row => {
        const ci = row.get({ plain: true });
        const ps = ci.ProductSize || {};
        const prod = ps.Product || {};

        const price =
          prod.discountPrice != null ? Number(prod.discountPrice)
            : (prod.originalPrice != null ? Number(prod.originalPrice) : null);

        const images = Array.isArray(prod.ProductImages)
          ? prod.ProductImages.map(im => ({
            image: toDataUrl(im.image),
            description: im.description || null
          })).filter(x => !!x.image)
          : [];

        return {
          cartItemId: ci.cartItemId,
          quantity: ci.quantity,
          productSize: {
            productSizeId: ps.productSizeId,
            stock: ps.stock,
            size: ps.Size ? { sizeId: ps.Size.sizeId, sizeName: ps.Size.name || null } : null // Sử dụng 'name'
          },
          product: {
            productId: prod.productId,
            name: prod.name,
            description: prod.description,
            madeBy: prod.madeBy,
            material: prod.material,
            category: prod.Category || null,
            originalPrice: prod.originalPrice != null ? Number(prod.originalPrice) : null,
            discountPrice: prod.discountPrice != null ? Number(prod.discountPrice) : null,
            price,
            images
          }
        };
      });

      return resolve({ errCode: 0, data });
    } catch (error) {
      return reject(error);
    }
  });
};

let deleteItemShopCart = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter !'
        })
      } else {
        let res = await db.ShopCart.findOne({ where: { id: data.id, statusId: 0 } })
        if (res) {
          await db.ShopCart.destroy({
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
module.exports = {
  addShopCart: addShopCart,
  getAllShopCartByUserId: getAllShopCartByUserId,
  deleteItemShopCart: deleteItemShopCart
}