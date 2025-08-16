import express from "express";
import userController from '../controllers/userController';
import allcodeController from '../controllers/allcodeController';
import productController from '../controllers/productController';
import bannerController from '../controllers/bannerController';
import blogController from '../controllers/blogController';
import typeshipController from '../controllers/typeshipController';
import voucherController from '../controllers/voucherController';
import commentController from '../controllers/commentController';
import shopCartController from '../controllers/shopCartController';
import orderController from '../controllers/orderController';
import addressUserController from '../controllers/addressUserController';
import messageController from '../controllers/messageController';
import statisticController from '../controllers/statisticController';
//import middlewareControllers from '../middlewares/jwtVerify';
import supplierController from '../controllers/supplierController';
import receiptController from '../controllers/receiptController';
import kolController from '../controllers/kolController';
import kolTierController from '../controllers/kolTierController';
const affiliateController = require('../controllers/affiliateController');
const affiliateClickController = require('../controllers/affiliateClickController');
const affiliateLinkController = require('../controllers/affiliateLinkController');
const affiliateDashboardController = require('../controllers/affiliateDashboardController');
const affiliateAnalyticsController = require('../controllers/affiliateAnalyticsController');
const affiliateAttributionController = require('../controllers/affiliateAttributionController');

const dataExportController = require('../controllers/dataExportController');
const realtimeStatsService = require('../services/realtimeStatsService');
let router = express.Router();

let initwebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.send("hello")
    })
    //=====================API USER==========================//
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/update-user', userController.handleUpdateUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.post('/api/login', userController.handleLogin)
    router.post('/api/changepassword', userController.handleChangePassword)
    router.get('/api/get-all-user', userController.getAllUser)
    router.get('/api/get-detail-user-by-id', userController.getDetailUserById)
    router.post('/api/send-verify-email', userController.handleSendVerifyEmailUser)
    router.post('/api/verify-email', userController.handleVerifyEmailUser)
    router.post('/api/send-forgotpassword-email', userController.handleSendEmailForgotPassword)
    router.post('/api/forgotpassword-email', userController.handleForgotPassword)
    router.get('/api/check-phonenumber-email', userController.checkPhonenumberEmail)
    router.get('/api/get-detail-user-by-email', userController.getDetailUserByEmail)
    //===================API ALLCODE========================//
    router.post('/api/create-new-all-code', allcodeController.handleCreateNewAllCode)
    router.put('/api/update-all-code', allcodeController.handleUpdateAllCode)
    router.delete('/api/delete-all-code', allcodeController.handleDeleteAllCode)
    router.get('/api/get-all-code', allcodeController.getAllCodeService)
    router.get('/api/get-list-allcode', allcodeController.getListAllCodeService)
    router.get('/api/get-detail-all-code-by-id', allcodeController.getDetailAllCodeById)
    router.get('/api/get-all-category-blog', allcodeController.getAllCategoryBlog)

    //==================API PRODUCT=========================//
    router.post('/api/create-new-product', productController.createNewProduct)
    router.put('/api/update-product', productController.updateProduct)
    router.get('/api/get-all-product-admin', productController.getAllProductAdmin)
    router.get('/api/get-all-product-user', productController.getAllProductUser)
    router.post('/api/unactive-product', productController.UnactiveProduct)
    router.post('/api/active-product', productController.ActiveProduct)
    router.get('/api/get-detail-product-by-id', productController.getDetailProductById)
    router.get('/api/get-all-product-detail-by-id', productController.getAllProductDetailById)
    router.get('/api/get-all-product-detail-image-by-id', productController.getAllProductDetailImageById)
    router.post('/api/create-new-product-detail', productController.createNewProductDetail)
    router.put('/api/update-product-detail', productController.updateProductDetail)
    router.get('/api/get-product-detail-by-id', productController.getDetailProductDetailById)
    router.post('/api/create-product-detail-image', productController.createNewProductDetailImage)
    router.get('/api/get-product-detail-image-by-id', productController.getDetailProductImageById)
    router.put('/api/update-product-detail-image', productController.updateProductDetailImage)
    router.delete('/api/delete-product-detail-image', productController.deleteProductDetailImage)
    router.delete('/api/delete-product-detail', productController.deleteProductDetail)
    router.get('/api/get-all-product-detail-size-by-id', productController.getAllProductDetailSizeById)
    router.post('/api/create-product-detail-size', productController.createNewProductDetailSize)
    router.get('/api/get-detail-product-detail-size-by-id', productController.getDetailProductDetailSizeById)
    router.put('/api/update-product-detail-size', productController.updateProductDetailSize)
    router.delete('/api/delete-product-detail-size', productController.deleteProductDetailSize)
    router.get('/api/get-product-feature', productController.getProductFeature)
    router.get('/api/get-product-new', productController.getProductNew)
    router.get('/api/get-product-shopcart', productController.getProductShopCart)
    router.get('/api/get-product-recommend', productController.getProductRecommend)
    //==================API BANNER=============================//
    router.post('/api/create-new-banner', bannerController.createNewBanner)
    router.get('/api/get-detail-banner', bannerController.getDetailBanner)
    router.get('/api/get-all-banner', bannerController.getAllBanner)
    router.put('/api/update-banner', bannerController.updateBanner)
    router.delete('/api/delete-banner', bannerController.deleteBanner)

    //=================API BLOG===============================//
    router.post('/api/create-new-blog', blogController.createNewBlog)
    router.get('/api/get-detail-blog', blogController.getDetailBlogById)
    router.get('/api/get-all-blog', blogController.getAllBlog)
    router.put('/api/update-blog', blogController.updateBlog)
    router.delete('/api/delete-blog', blogController.deleteBlog)
    router.get('/api/get-feature-blog', blogController.getFeatureBlog)
    router.get('/api/get-new-blog', blogController.getNewBlog)
    //=================API TYPESHIP =======================//
    router.post('/api/create-new-typeship', typeshipController.createNewTypeShip)
    router.get('/api/get-detail-typeship', typeshipController.getDetailTypeshipById)
    router.get('/api/get-all-typeship', typeshipController.getAllTypeship)
    router.put('/api/update-typeship', typeshipController.updateTypeship)
    router.delete('/api/delete-typeship', typeshipController.deleteTypeship)

    //================API TYPEVOUCHER======================//
    router.post('/api/create-new-typevoucher', voucherController.createNewTypeVoucher)
    router.get('/api/get-detail-typevoucher', voucherController.getDetailTypeVoucherById)
    router.get('/api/get-all-typevoucher', voucherController.getAllTypeVoucher)
    router.put('/api/update-typevoucher', voucherController.updateTypeVoucher)
    router.delete('/api/delete-typevoucher', voucherController.deleteTypeVoucher)
    router.get('/api/get-select-typevoucher', voucherController.getSelectTypeVoucher)
    //=================API VOUCHER==========================//
    router.post('/api/create-new-voucher', voucherController.createNewVoucher)
    router.get('/api/get-detail-voucher', voucherController.getDetailVoucherById)
    router.get('/api/get-all-voucher', voucherController.getAllVoucher)
    router.put('/api/update-voucher', voucherController.updateVoucher)
    router.delete('/api/delete-voucher', voucherController.deleteVoucher)
    router.post('/api/save-user-voucher', voucherController.saveUserVoucher)
    router.get('/api/get-all-voucher-by-userid', voucherController.getAllVoucherByUserId)
    //=================API REVIEW=============================//
    router.post('/api/create-new-review', commentController.createNewReview)
    router.post('/api/reply-review', commentController.ReplyReview)
    router.get('/api/get-all-review-by-productId', commentController.getAllReviewByProductId)
    router.delete('/api/delete-review', commentController.deleteReview)

    //=================API SHOPCART==========================//
    router.post('/api/add-shopcart', shopCartController.addShopCart)
    router.get('/api/get-all-shopcart-by-userId', shopCartController.getAllShopCartByUserId)
    router.delete('/api/delete-item-shopcart', shopCartController.deleteItemShopCart)

    //=================API ORDER=============================//
    router.post('/api/create-new-order', orderController.createNewOrder)
    router.get('/api/get-all-order', orderController.getAllOrders)
    router.get('/api/get-detail-order', orderController.getDetailOrderById)
    router.put('/api/update-status-order', orderController.updateStatusOrder)
    router.get('/api/get-all-order-by-user', orderController.getAllOrdersByUser)
    router.post('/api/payment-order', orderController.paymentOrder)
    router.post('/api/payment-order-success', orderController.paymentOrderSuccess)
    router.post('/api/payment-order-vnpay-success', orderController.paymentOrderVnpaySuccess)
    router.put('/api/confirm-order', orderController.confirmOrder)
    router.get('/api/get-all-order-by-shipper', orderController.getAllOrdersByShipper)
    router.post('/api/payment-order-vnpay', orderController.paymentOrderVnpay)
    router.post('/api/vnpay_return', orderController.confirmOrderVnpay)
    router.put('/api/update-image-order', orderController.updateImageOrder)
    //=================API ADDRESS USER ======================//
    router.post('/api/create-new-address-user', addressUserController.createNewAddressUser)
    router.get('/api/get-all-address-user', addressUserController.getAllAddressUserByUserId)
    router.delete('/api/delete-address-user', addressUserController.deleteAddressUser)
    router.put('/api/edit-address-user', addressUserController.editAddressUser)
    router.get('/api/get-detail-address-user-by-id', addressUserController.getDetailAddressUserById)
    router.get("/api/choose-ship-address", addressUserController.chooseAddressForShip)
    //=================API MESSAGE============================//
    router.post('/api/create-new-room', messageController.createNewRoom)
    router.post('/api/sendMessage', messageController.sendMessage)
    router.get('/api/loadMessage', messageController.loadMessage)
    router.get('/api/listRoomOfUser', messageController.listRoomOfUser)
    router.get('/api/listRoomOfAdmin', messageController.listRoomOfAdmin)
    //==================API COMMENT============================//
    router.post('/api/create-new-comment', commentController.createNewComment)
    router.post('/api/reply-comment', commentController.ReplyComment)
    router.get('/api/get-all-comment-by-blogId', commentController.getAllCommentByBlogId)
    router.delete('/api/delete-comment', commentController.deleteComment)

    //=================API STATISTIC==============================//
    router.get('/api/get-count-card-statistic', statisticController.getCountCardStatistic)
    router.get('/api/get-count-status-order', statisticController.getCountStatusOrder)
    router.get('/api/get-statistic-by-month', statisticController.getStatisticByMonth)
    router.get('/api/get-statistic-by-day', statisticController.getStatisticByDay)
    router.get('/api/get-statistic-overturn', statisticController.getStatisticOverturn)
    router.get('/api/get-statistic-profit', statisticController.getStatisticProfit)
    router.get('/api/get-statistic-stock-product', statisticController.getStatisticStockProduct)
    //=================API SUPPLIER================================//
    router.post('/api/create-new-supplier', supplierController.createNewSupplier)
    router.get('/api/get-detail-supplier', supplierController.getDetailSupplierById)
    router.get('/api/get-all-supplier', supplierController.getAllSupplier)
    router.put('/api/update-supplier', supplierController.updateSupplier)
    router.delete('/api/delete-supplier', supplierController.deleteSupplier)

    //=================API RECEIPT================================//
    router.post('/api/create-new-receipt', receiptController.createNewReceipt)
    router.get('/api/get-detail-receipt', receiptController.getDetailReceiptById)
    router.get('/api/get-all-receipt', receiptController.getAllReceipt)
    router.put('/api/update-receipt', receiptController.updateReceipt)
    router.delete('/api/delete-receipt', receiptController.deleteReceipt)
    router.post('/api/create-new-detail-receipt', receiptController.createNewReceiptDetail)

    //=================API KOL====================================//
    router.post('/api/kol/register', kolController.handleKolRegistration)
    router.get('/api/kol/status', kolController.getApplicationStatus)
    router.get('/api/admin/kol/applications', kolController.getAllApplications)
    router.get('/api/admin/kol/applications/:id', kolController.getApplicationDetails)
    router.put('/api/admin/kol/applications/:id/approve', kolController.handleUpdateApplicationStatus)
    router.put('/api/admin/kol/applications/:id/reject', kolController.handleUpdateApplicationStatus)
    router.post('/api/kol/update-bank-info', kolController.handleUpdateUserBankInfo)
    router.post('/api/kol/get-bank-info', kolController.handleGetKolInfoWithCommission)
    router.post('/api/kol/create-draw', kolController.handleWithCreateDrawMoneyKOL)
    router.get('/api/kol/get-all-draw', kolController.handleGetAllDrawKOL)
    router.get('/api/kol/get-all-draw-by-kol', kolController.handleGetAllRequestDrawByKOL)

    //=================API KOL TIER MANAGEMENT===================//
    router.post('/api/admin/kol/tier/update', kolTierController.updateKolTier)
    router.post('/api/admin/kol/tier/recalculate-all', kolTierController.recalculateAllTiers)
    router.get('/api/admin/kol/tier/statistics', kolTierController.getTierStatistics)
    router.get('/api/admin/kol/tier/eligible-upgrades', kolTierController.getEligibleUpgrades)
    router.post('/api/admin/kol/tier/trigger-scheduled', kolTierController.triggerScheduledRecalculation)
    router.get('/api/admin/kol/tier/scheduler-status', kolTierController.getSchedulerStatus)
    router.get('/api/kol/tier/info/:kolId', kolTierController.getKolTierInfo)

    //=================API AFFILIATE================================//
    router.post('/api/affiliate/links', affiliateController.generateAffiliateLink)
    router.get('/api/affiliate/links', affiliateController.getAffiliateLinks)
    router.post('/api/affiliate/chart_admin', affiliateController.getDataForChartsAdmin);
    router.post('/api/affiliate/track', affiliateController.trackAffiliateClick)
    router.post('/api/affiliate/click', affiliateClickController.handleCreateAffiliateClick);
    router.get('/api/products', productController.getProductsForKOL)
    router.get('/api/aff/:shortCode', affiliateLinkController.handleRedirectAffiliateLink);
    router.get('/api/kol/dashboard', affiliateDashboardController.getKolDashboard);
    router.get('/api/kol/products', affiliateDashboardController.getProductsForKol);
    router.get('/api/kol/performance-stats', affiliateAnalyticsController.getKolPerformanceStats);
    router.get('/api/kol/earnings-report', affiliateAnalyticsController.getKolEarningsReport);
    router.post('/api/affiliate/multi-attribution', affiliateAttributionController.handleMultiProductAttribution);
    router.post('/api/affiliate/clear-attribution', affiliateAttributionController.clearAttributionAfterOrder);
    router.get('/api/affiliate/dashboard', affiliateController.getDashboard);
    router.get('/api/affiliate/export-performance', affiliateController.exportKolPerformanceData);
    router.get('/api/affiliate/orders/:orderId/attribution', affiliateController.getOrderAttributionSummary);
    router.get('/api/affiliate/export-data', dataExportController.exportAffiliateData);
    router.get('/api/affiliate/export-kol-performance', dataExportController.exportKolPerformance);
    router.get('/api/affiliate/realtime-stats', realtimeStatsService.getRealtimeUpdates);
    router.post('/api/affiliate/realtime_access', affiliateLinkController.handleAccessAffilateLink);


    return app.use("/", router);
}

module.exports = initwebRoutes;