require("../../utils/util.js");

var e = require("../../config/api.js"), a = getApp();

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
        var t = this, o = wx.getStorageSync("userInfo"), r = o.user_id, s = wx.getStorageSync("ordersn"), d = wx.getStorageSync("couponInfo"), i = wx.getStorageSync("rap_price");
        a.util.request({
            url: e.Index,
            data: {
                user_id: r
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || t.setData({
                    sysinfo: e.data.data.sysinfo
                });
            }
        }), i > 0 ? t.setData({
            makePrice: parseFloat(i).toFixed(2)
        }) : t.setData({
            makePrice: "0.00"
        }), "" != d ? this.setData({
            couponInfo: d
        }) : this.setData({
            couponInfo: ""
        }), t.setData({
            userInfo: o,
            order_sn: s,
            user_id: r,
            rap_price: i
        }), this.getAddress(), this.getCoupon(), this.getRapSum(), this.getOrdersnInfo(s);
    },
    raphelp: function() {
        wx.navigateTo({
            url: "../rapAbout/rapAbout"
        });
    },
    getOrdersnInfo: function(t) {
        var o = this, r = wx.getStorageSync("userInfo");
        a.util.request({
            url: e.GetOrdersnInfo,
            data: {
                order_sn: t
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || o.setData({
                    orderInfo: e.data.data.orderInfo,
                    myo: (e.data.data.orderInfo.order_price - e.data.data.orderInfo.member_price).toFixed(2)
                }), "1" == r.member ? "" == o.data.couponInfo ? o.setData({
                    order_total: (parseFloat(e.data.data.orderInfo.member_price) + parseFloat(e.data.data.orderInfo.freight_price)).toFixed(2)
                }) : o.setData({
                    order_total: (parseFloat(e.data.data.orderInfo.member_price) + parseFloat(e.data.data.orderInfo.freight_price) - parseFloat(o.data.couponInfo.sub_price)).toFixed(2)
                }) : "" == o.data.couponInfo ? o.setData({
                    order_total: (parseFloat(e.data.data.orderInfo.order_price) + parseFloat(e.data.data.orderInfo.freight_price)).toFixed(2)
                }) : o.setData({
                    order_total: (parseFloat(e.data.data.orderInfo.order_price) + parseFloat(e.data.data.orderInfo.freight_price) - parseFloat(o.data.couponInfo.sub_price)).toFixed(2)
                });
            }
        });
    },
    getAddress: function() {
        var t = this;
        a.util.request({
            url: e.GetAddress,
            data: {
                user_id: t.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                e.data.errno || t.setData({
                    address: e.data.data.address
                });
            }
        });
    },
    getCoupon: function() {
        var t = this;
        a.util.request({
            url: e.GetCoupon,
            data: {
                user_id: t.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                e.data.errno || t.setData({
                    coupon: e.data.data.coupon.nums
                });
            }
        });
    },
    getRapSum: function() {
        var t = this;
        a.util.request({
            url: e.GetRapSum,
            data: {
                user_id: t.data.user_id
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), "" != e.data && t.setData({
                    rapSum: e.data.data.rapSum || "0.00"
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
    rapChange: function(e) {
        var a = this, t = e.detail.value, o = a.data.order_total, r = a.data.order_total / 2;
        if (a.setData({
            openStatus: t
        }), 1 == t) {
            if (console.log(a.data.rapSum), console.log(r), console.log(a.data.makePrice), r < a.data.rapSum) {
                console.log("抵扣金额大于半价，使用抵扣金为商品价格一半");
                s = r;
                a.setData({
                    use_rap_total: s,
                    order_total1: o,
                    order_total: (o - s).toFixed(2)
                });
            } else if (r >= a.data.rapSum) {
                console.log("抵扣金额小于或等于商品半价，抵扣金为钱包所有余额");
                var s = a.data.rapSum;
                a.setData({
                    use_rap_total: s,
                    order_total1: o,
                    order_total: (o - s).toFixed(2)
                });
            }
            console.log(a.data.use_rap_total), console.log(a.data.makePrice);
            var d = a.data.makePrice, i = a.data.use_rap_total, n = a.data.makePrice / 2;
            i < n ? (console.log("抵扣金额小于赚取金额的一半，实际赚取金额为原赚取金额-抵扣金额"), a.setData({
                makePrice1: d,
                makePrice: (d - i).toFixed(2)
            })) : i > n && (console.log("2"), a.setData({
                makePrice1: d,
                makePrice: parseFloat(n).toFixed(2)
            }));
        } else a.setData({
            order_total: a.data.order_total1,
            makePrice: a.data.makePrice1
        });
    },
    remarkInput: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    getvou: function() {
        wx.getStorageSync("userInfo").member < 1 ? wx.navigateTo({
            url: "/meike_mall/pages/ucenter/chooseCoupon/chooseCoupon?total=" + this.data.orderInfo.order_price
        }) : wx.navigateTo({
            url: "/meike_mall/pages/ucenter/chooseCoupon/chooseCoupon?total=" + this.data.orderInfo.member_price
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
    submitForm: function(t) {
        var o = this, r = wx.getStorageSync("userInfo"), s = o.data.makePrice, d = (r.red_status, 
        r.red_price), i = (parseFloat(s) + parseFloat(d)).toFixed(2), n = r.user_id, c = r.openid, u = r.nickname, p = r.avatar, l = o.data.address, _ = l.name, f = l.province_id, m = l.province, g = l.city_id, I = l.city, h = l.district_id, S = l.district, v = l.address, x = l.mobile, y = o.data.order_sn, k = o.data.order_total, F = wx.getStorageSync("goods_specifition_ids"), D = t.detail.formId, c = r.openid, w = o.data.orderInfo.pay_name + "+" + o.data.orderInfo.pay_attr + "x" + o.data.orderInfo.pay_num;
        if ("" == o.data.couponInfo) var b = "", P = ""; else var b = o.data.couponInfo.coupon_id, P = o.data.couponInfo.sub_price;
        a.util.request({
            url: e.UpgradeOrderSubmit,
            data: {
                order_sn: y,
                consignee: _,
                province: m,
                province_id: f,
                city_id: g,
                city: I,
                district_id: h,
                district: S,
                address: v,
                mobile: x,
                coupon_id: b,
                coupon_price: P,
                openid: c,
                form_id: D,
                actual_price: k,
                rap_price: i
            },
            cachetime: 0,
            success: function(t) {
                console.log(t);
                var r = a.siteInfo.siteroot, d = a.siteInfo.uniacid, c = o.data.userInfo.openid;
                r = (r = r.split("/app")[0]) + "/addons/meike_mall/pay" + d + "/example/jsapi.php", 
                wx.request({
                    url: r,
                    data: {
                        openid: c,
                        total: k,
                        ordersn: y,
                        title: w
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(t) {
                        var r = t.data;
                        r.package.split("=")[1];
                        wx.requestPayment({
                            timeStamp: r.timeStamp,
                            nonceStr: r.nonceStr,
                            package: r.package,
                            signType: "MD5",
                            paySign: r.paySign,
                            success: function(t) {
                                a.util.request({
                                    url: e.InsertOrder,
                                    data: {
                                        order_sn: y,
                                        goods_specifition_ids: F,
                                        order_status: 1
                                    },
                                    cachetime: 0,
                                    success: function(e) {
                                        wx.redirectTo({
                                            url: "../payResult/payResult?status=1&orderId=" + y + "&rap_price=" + i
                                        });
                                    }
                                }), s > 0 && a.util.request({
                                    url: e.RapOrder,
                                    data: {
                                        ordersn: y,
                                        nickname: u,
                                        avatar: p,
                                        user_id: n,
                                        rap_price: i,
                                        make_price: o.data.use_rap_total,
                                        status: 1
                                    },
                                    cachetime: 0,
                                    success: function(e) {}
                                }), a.util.request({
                                    url: "entry/wxapp/PayLog",
                                    data: {
                                        user_id: n,
                                        oid: y,
                                        openid: c,
                                        nickname: u,
                                        avatar: p,
                                        desc: w,
                                        total: k
                                    },
                                    cachetime: 0,
                                    success: function(e) {}
                                });
                            },
                            fail: function(t) {
                                a.util.request({
                                    url: e.InsertOrder,
                                    data: {
                                        order_sn: y,
                                        goods_specifition_ids: F,
                                        order_status: 0
                                    },
                                    cachetime: 0,
                                    success: function(e) {
                                        console.log(e);
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