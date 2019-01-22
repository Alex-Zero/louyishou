require("../../../utils/util.js");

var e = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        itemData: {},
        couponInfo: "",
        member_price: "",
        order_price: "",
        order_total: "",
        coupon: "",
        userId: 0,
        paytype: "weixin",
        remark: "",
        cartId: 0,
        addrId: 0,
        btnDisabled: !1,
        productData: [],
        address: {},
        total: 0,
        vprice: 0,
        vid: 0,
        addemt: 1,
        vou: []
    },
    onShow: function() {
        console.log("执行了");
        var e = wx.getStorageSync("userInfo"), t = e.user_id, a = wx.getStorageSync("carts"), o = wx.getStorageSync("couponInfo"), r = this, s = wx.getStorageSync("cartTotal"), n = wx.getStorageSync("cartCommonTotal");
        "" != o ? r.setData({
            order_total: (parseFloat(s) - parseFloat(o.sub_price)).toFixed(2),
            carts: a,
            alltotal: n,
            couponInfo: o,
            myo: (parseFloat(n) - parseFloat(s)).toFixed(2)
        }) : r.setData({
            order_total: s,
            carts: a,
            alltotal: n,
            couponInfo: "",
            myo: (parseFloat(n) - parseFloat(s)).toFixed(2)
        }), r.setData({
            userInfo: e,
            user_id: t
        }), this.getAddress(), this.getCoupon();
    },
    getAddress: function() {
        var a = this;
        t.util.request({
            url: e.GetAddress,
            data: {
                user_id: a.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                e.data.errno || a.setData({
                    address: e.data.data.address
                });
            }
        });
    },
    getCoupon: function() {
        var a = this;
        t.util.request({
            url: e.GetCoupon,
            data: {
                user_id: a.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                e.data.errno || a.setData({
                    coupon: e.data.data.coupon.nums
                });
            }
        });
    },
    onUnload: function() {
        wx.removeStorage({
            key: "couponInfo",
            success: function(e) {
                console.log("couponInfo已清除");
            }
        }), wx.removeStorage({
            key: "carts",
            success: function(e) {
                console.log("购物车缓存已清除");
            }
        }), wx.removeStorage({
            key: "cartTotal",
            success: function(e) {
                console.log("购物车缓存已清除");
            }
        }), wx.removeStorage({
            key: "cartCommonTotal",
            success: function(e) {
                console.log("购物车缓存已清除");
            }
        });
    },
    remarkInput: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    getvou: function() {
        wx.getStorageSync("userInfo").member;
        var e = wx.getStorageSync("cartTotal");
        wx.navigateTo({
            url: "/meike_mall/pages/ucenter/chooseCoupon/chooseCoupon?total=" + e
        });
    },
    addAddress: function() {
        wx.navigateTo({
            url: "/meike_mall/pages/ucenter/addressAdd/addressAdd?id=0",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    selectAddress: function() {
        wx.navigateTo({
            url: "/meike_mall/pages/ucenter/chooseAddress/chooseAddress"
        });
    },
    submitForm: function(a) {
        var o = this, r = wx.getStorageSync("userInfo"), s = r.user_id, n = r.openid, c = r.nickname, i = r.avatar, d = o.data.address, u = d.name, l = d.province_id, p = d.province, m = d.city_id, g = d.city, f = d.district_id, _ = d.district, y = d.address, S = d.mobile, v = o.data.order_total, x = wx.getStorageSync("carts").filter(function(e, t, a) {
            return 1 == e.checked;
        });
        x = x.map(function(e, t, a) {
            if (1 == e.checked) return e.id;
        });
        var I = a.detail.formId, n = r.openid;
        if ("" == o.data.couponInfo) var w = "", h = ""; else var w = o.data.couponInfo.coupon_id, h = o.data.couponInfo.sub_price;
        t.util.request({
            url: e.CartOrderSn,
            cachetime: 0,
            success: function(a) {
                console.log(a.data.data);
                var r = a.data.data;
                t.util.request({
                    url: e.CartOrderCopySubmit,
                    data: {
                        order_sn: r,
                        user_id: s,
                        consignee: u,
                        province: p,
                        province_id: l,
                        city_id: m,
                        city: g,
                        cartIds: x.join(","),
                        district_id: f,
                        district: _,
                        address: y,
                        mobile: S,
                        coupon_id: w,
                        coupon_price: h,
                        openid: n,
                        form_id: I,
                        actual_price: v
                    },
                    cachetime: 0,
                    success: function(a) {
                        console.log(a);
                        var n = t.siteInfo.siteroot, d = t.siteInfo.uniacid, u = o.data.userInfo.openid;
                        n = (n = n.split("/app")[0]) + "/addons/meike_mall/pay" + d + "/example/jsapi.php", 
                        wx.request({
                            url: n,
                            data: {
                                openid: u,
                                total: v,
                                ordersn: r,
                                title: "商品包裹"
                            },
                            header: {
                                "content-type": "application/json"
                            },
                            success: function(a) {
                                var o = a.data;
                                o.package.split("=")[1];
                                wx.requestPayment({
                                    timeStamp: o.timeStamp,
                                    nonceStr: o.nonceStr,
                                    package: o.package,
                                    signType: "MD5",
                                    paySign: o.paySign,
                                    success: function(a) {
                                        t.util.request({
                                            url: "entry/wxapp/PayLog",
                                            data: {
                                                user_id: s,
                                                oid: r,
                                                openid: u,
                                                nickname: c,
                                                avatar: i,
                                                desc: "商品包裹",
                                                total: v
                                            },
                                            cachetime: 0,
                                            success: function(e) {}
                                        }), t.util.request({
                                            url: e.CartPay,
                                            data: {
                                                order_sn: r,
                                                order_status: 1
                                            },
                                            cachetime: 0,
                                            success: function(e) {
                                                console.log(e), wx.redirectTo({
                                                    url: "/meike_mall/pages/cartPayResult/cartPayResult?status=1&orderId=" + r
                                                });
                                            }
                                        });
                                    },
                                    fail: function(e) {
                                        wx.redirectTo({
                                            url: "/meike_mall/pages/payResult/payResult?status=0&orderId=" + r
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});