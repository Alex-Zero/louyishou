function a(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

require("../../utils/util.js");

var e, t = require("../../config/api.js"), o = (require("../../services/user.js"), 
getApp());

Page({
    data: (e = {
        comments: [],
        curIdx: 0,
        useriInfo: {},
        mch_info: {},
        rapshow: !0,
        helpTa: !0,
        user_id: "",
        share_user_id: "",
        rap_avatar: "",
        itr: "",
        htr: "",
        need_price: "",
        random: "",
        allFloorGoods: [],
        floorGoods: [],
        page: 1,
        size: 50,
        hongbao: !0,
        backRed: !0,
        newC: !0,
        sysinfo: {}
    }, a(e, "mch_info", {}), a(e, "goodsCount", {}), a(e, "newCoupon", []), a(e, "newGoods", []), 
    a(e, "hotGoods", []), a(e, "news", []), a(e, "topics", []), a(e, "brand", []), a(e, "span", [ "30天无忧退货", "48小时快速退款", "假一赔十" ]), 
    a(e, "slide", []), a(e, "channel", []), a(e, "noData", !0), e),
    setTabBar: function() {
        var a = wx.getStorageSync("tabbar"), e = wx.getStorageSync("tabColor"), t = this;
        a || setTimeout(function() {
            t.setTabBar();
        }, 200), this.setData({
            tabbar: a,
            tabColor: e
        });
    },
    onLoad: function(a) {
        console.log(a);
        var e = this;
        e.setTabBar(), wx.hideShareMenu();
        var s = wx.getSystemInfoSync();
        console.log(s);
        var r = wx.getStorageSync("userInfo"), i = r.user_id || "";
        r.is_people, r.store_id;
        e.setData({
            userInfo: r,
            user_id: i,
            share_user_id: a.share_user_id || "",
            open_type: a.type || "",
            orderId: a.orderId || "",
            windowWidth: s.screenWidth,
            windowHeight: s.screenHeight
        }), "" == i && wx.login({
            success: function(a) {
                a.code && o.util.request({
                    url: t.CheckNew,
                    data: {
                        code: a.code,
                        m: "meike_mall"
                    },
                    cachetime: 0,
                    success: function(a) {
                        console.log(a), 1 == a.data.data.is_new && e.setData({
                            newC: !1
                        });
                    }
                });
            }
        }), "" != r.store_id && "2" != r.is_people && o.util.request({
            url: t.FootPrint,
            data: {
                user_id: i,
                mch_id: r.store_id,
                goods_id: ""
            },
            cachetime: 0,
            success: function(a) {}
        }), wx, e.getIndexData(), e.getfloorGoods();
    },
    helpTa: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id, s = a.data.orderId;
        a.setData({
            helpTa: !0
        }), o.util.request({
            url: t.HelpTa,
            data: {
                user_id: e,
                orderId: s
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), a.setData({
                    backRed: !1,
                    need_price: e.data.data.need_price,
                    random: e.data.data.random_red
                });
            }
        });
    },
    onShow: function() {
        var a = this, e = wx.getStorageSync("userInfo"), s = e.user_id || "", r = e.is_get_coupon, i = a.data.orderId;
        if ("" != i && o.util.request({
            url: t.CheckHelpOrder,
            data: {
                orderId: i,
                user_id: s
            },
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var t = e.data.data.status;
                1 == t && a.setData({
                    helpTa: !1,
                    status: t,
                    rap_avatar: e.data.data.rap_avatar,
                    itr: (e.data.data.rap_price - e.data.data.help_price).toFixed(2),
                    rap_price: e.data.data.rap_price,
                    htr: e.data.data.help_price,
                    progress: e.data.data.help_price / e.data.data.rap_price * 100
                });
            }
        }), "" != s) {
            if (s == a.data.share_user_id) return !1;
            a.data.share_user_id && s != a.data.share_user_id && "" == e.inviter && "" != s && this.getFansInfo(s);
        }
        "" != s && "0" == r && a.setData({
            hongbao: !1
        });
    },
    saveRed: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.TheRelay,
            data: {
                user_id: e,
                random_red: a.data.random
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), a.setData({
                    backRed: !0
                });
            }
        });
    },
    closeRap: function() {
        this.setData({
            helpTa: !0,
            backRed: !0
        });
    },
    formSubmit: function(a) {
        var e = a.detail.formId, s = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.FormID,
            data: {
                user_id: s,
                form_id: e
            },
            cachetime: 0,
            success: function(a) {
                console.log("form_id添加成功");
            }
        });
    },
    formSubmitAI: function(a) {
        var e = a.detail.formId, s = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.FormID,
            data: {
                user_id: s,
                form_id: e
            },
            cachetime: 0,
            success: function(a) {
                console.log("form_id添加成功"), wx.navigateTo({
                    url: "/meike_mall/pages/ai/ai"
                });
            }
        });
    },
    onShareAppMessage: function() {
        var a = wx.getStorageSync("userInfo").user_id;
        return {
            title: this.data.sysinfo.title,
            path: "/meike_mall/pages/index/index?type=link&share_user_id=" + a,
            imageUrl: this.data.sysinfo.share_image
        };
    },
    getFansInfo: function(a) {
        console.log("getFansInfo");
        var e = this;
        o.util.request({
            url: t.FansBind,
            data: {
                inviter_id: e.data.share_user_id,
                user_id: a
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), wx.setStorageSync("userInfo", a.data.data), o.util.request({
                    url: t.SendMessageNew,
                    data: {
                        inviter_id: a.data.data.inviter_id,
                        user_id: a.data.data.user_id,
                        nickname: a.data.data.nickname,
                        open_type: e.data.open_type
                    },
                    cachetime: 0,
                    success: function(a) {
                        console.log("发送成功");
                    }
                });
            }
        });
    },
    getIndexData: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.Index,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || a.setData({
                    goodsCount: e.data.data.goodsCount,
                    news: e.data.data.news,
                    newGoods: e.data.data.newGoodsList,
                    hotGoods: e.data.data.hotGoodsList,
                    topics: e.data.data.topicList,
                    brand: e.data.data.brandList,
                    sysinfo: e.data.data.sysinfo,
                    newCoupon: e.data.data.newStamps,
                    slide: e.data.data.slide,
                    channel: e.data.data.channel
                }), wx.setNavigationBarTitle({
                    title: e.data.data.sysinfo.name
                });
            }
        });
    },
    getfloorGoods: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.FloorGoodsList,
            data: {
                user_id: e,
                page: a.data.page,
                size: a.data.size
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), "" == e.data.data.floorGoods && "" == a.data.floorGoods ? a.setData({
                    floorGoods: []
                }) : a.setData({
                    allFloorGoods: a.data.allFloorGoods.concat(e.data.data.floorGoods),
                    page: e.data.data.currentPage,
                    floorGoods: a.data.allFloorGoods.concat(e.data.data.floorGoods)
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            allFloorGoods: []
        }), this.getIndexData(), this.getfloorGoods(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        console.log("onPullDownRefresh");
        var a = this;
        if (this.data.goodsCount.nums / this.data.size < this.data.page) return a.setData({
            noData: !1
        }), !1;
        this.setData({
            page: this.data.page + 1
        }), this.getfloorGoods();
    },
    close: function() {
        var a = this;
        o.util.request({
            url: t.FansBind,
            data: {
                inviter_id: a.data.share_user_id,
                user_id: user_id
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), wx.setStorageSync("userInfo", a.data.data);
            }
        }), a.setData({
            hongbao: !0
        });
    },
    mina: function(a) {
        var e = a.target.dataset.index, t = this.data.slide[e].appid, o = this.data.slide[e].appPath;
        wx.navigateToMiniProgram({
            appId: t,
            path: o,
            success: function(a) {
                console.log("跳转成功" + t);
            }
        });
    },
    know: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.CouponConfirm,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), wx.setStorageSync("userInfo", a.data.data);
            }
        }), a.setData({
            hongbao: !0
        });
    },
    goCatalog: function() {
        wx.switchTab({
            url: "/maker_mall/pages/catalog/catalog"
        });
    },
    goLogin: function() {
        this.setData({
            newC: !0
        }), wx.navigateTo({
            url: "../auth/index/index"
        });
    },
    preventD: function() {}
});