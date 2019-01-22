require("../../../utils/util.js");

var e = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        itemData: {},
        orderInfo: {},
        sysinfo: {},
        couponInfo: "",
        member_price: "",
        order_price: "",
        order_total: "",
        rap_price: "",
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
        makePrice: "0.00",
        vou: []
    },
    onShow: function() {
        console.log("执行了");
        var r = this, a = wx.getStorageSync("userInfo"), s = a.user_id, o = wx.getStorageSync("ordersn");
        t.util.request({
            url: e.Index,
            data: {
                user_id: s
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || r.setData({
                    sysinfo: e.data.data.sysinfo
                });
            }
        }), r.setData({
            userInfo: a,
            order_sn: o,
            user_id: s
        }), this.getAddress(), this.getOrdersnInfo(o);
    },
    getOrdersnInfo: function(r) {
        var a = this;
        wx.getStorageSync("userInfo");
        t.util.request({
            url: e.GetGiftOrdersnInfo,
            data: {
                order_sn: r
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || a.setData({
                    orderInfo: e.data.data.orderInfo
                });
            }
        });
    },
    getAddress: function() {
        var r = this;
        t.util.request({
            url: e.GetAddress,
            data: {
                user_id: r.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                e.data.errno || r.setData({
                    address: e.data.data.address
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
            key: "rap_price",
            success: function(e) {
                console.log("rap_price已清除");
            }
        });
    },
    remarkInput: function(e) {
        this.setData({
            remark: e.detail.value
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
    submitForm: function(r) {
        var a = this, s = wx.getStorageSync("userInfo"), o = s.user_id, n = s.openid, i = s.nickname, d = s.avatar, c = a.data.address, u = c.name, l = c.province_id, p = c.province, f = c.city_id, g = c.city, m = c.district_id, _ = c.district, I = c.address, y = c.mobile, v = a.data.order_sn, S = a.data.orderInfo.actual_price, h = a.data.orderInfo.name + "+默认x1", x = r.detail.formId;
        t.util.request({
            url: e.UpgradeGiftOrderSubmit,
            data: {
                order_sn: v,
                consignee: u,
                province: p,
                province_id: l,
                city_id: f,
                city: g,
                district_id: m,
                district: _,
                address: I,
                mobile: y,
                openid: n,
                form_id: x
            },
            cachetime: 0,
            success: function(r) {
                console.log(r);
                var s = t.siteInfo.siteroot, n = t.siteInfo.uniacid, c = a.data.userInfo.openid;
                s = (s = s.split("/app/index")[0]) + "/addons/meike_mall/pay" + n + "/example/jsapi.php", 
                wx.request({
                    url: s,
                    data: {
                        openid: c,
                        total: S,
                        ordersn: v,
                        title: h
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(r) {
                        var a = r.data;
                        a.package.split("=")[1];
                        wx.requestPayment({
                            timeStamp: a.timeStamp,
                            nonceStr: a.nonceStr,
                            package: a.package,
                            signType: "MD5",
                            paySign: a.paySign,
                            success: function(r) {
                                t.util.request({
                                    url: e.InsertGiftOrder,
                                    data: {
                                        order_sn: v,
                                        order_status: 1
                                    },
                                    cachetime: 0,
                                    success: function(e) {
                                        console.log(e), wx.setStorageSync("userInfo", e.data.data), wx.redirectTo({
                                            url: "../giftOrder/giftOrder?order_sn=" + v
                                        });
                                    }
                                }), t.util.request({
                                    url: "entry/wxapp/PayLog",
                                    data: {
                                        user_id: o,
                                        oid: v,
                                        openid: c,
                                        nickname: i,
                                        avatar: d,
                                        desc: h,
                                        total: S
                                    },
                                    cachetime: 0,
                                    success: function(e) {}
                                });
                            },
                            fail: function(e) {
                                console.log("支付失败");
                            }
                        });
                    }
                });
            }
        });
    }
});