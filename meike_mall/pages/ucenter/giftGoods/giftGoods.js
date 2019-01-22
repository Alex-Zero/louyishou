var t = getApp(), e = require("../../../lib/wxParse/wxParse.js"), a = (require("../../../utils/util.js"), 
require("../../../config/api.js"));

Page(function(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}({
    data: {
        isPopping: !0,
        animPlus: {},
        animCollect: {},
        animTranspond: {},
        animInput: {},
        id: 0,
        sysinfo: {},
        goods: {},
        instr: [],
        userInfo: {},
        label: "",
        attribute: [],
        issueList: [],
        comment: {},
        open_type: "",
        brand: {},
        specificationList: [],
        checkedProduct: [],
        productList: [],
        relatedGoods: [],
        cartGoodsCount: 0,
        userHasCollect: 0,
        windowWidth: "",
        windowHeight: "",
        thumb: "",
        mch_id: "",
        number: 1,
        autoplay: !0,
        videoauto: !1,
        dots: !0,
        hide: !0,
        videosrc: "",
        checkedSpecText: "请选择规格数量",
        openAttr: !1,
        noCollectImage: "../../resource/images/icon_collect.png",
        hasCollectImage: "../../resource/images/icon_collect_checked.png",
        collectBackImage: "../../resource/images/icon_collect.png"
    },
    plus: function() {
        this.data.isPopping ? (this.popp(), this.setData({
            isPopping: !1
        })) : this.data.isPopping || (this.takeback(), this.setData({
            isPopping: !0
        }));
    },
    input: function() {
        console.log("input");
    },
    transpond: function() {
        console.log("transpond");
    },
    collect: function() {
        console.log("生成海报"), wx.showToast({
            title: "正在生成，请稍候",
            icon: "none"
        }), setTimeout(function() {
            wx.hideToast();
        }, 3e3);
        var e = this, i = e.data.userInfo;
        t.util.request({
            url: a.CreatGiftPoster,
            data: {
                goodsCode: e.data.goodsCode,
                nickname: i.nickname,
                avatar: i.avatar,
                goodsImg: e.data.goods.list_pic_url[0],
                goodsId: e.data.goods.id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), wx.previewImage({
                    current: t.data.data,
                    urls: [ t.data.data ]
                });
            }
        }), this.takeback(), this.setData({
            isPopping: !0
        });
    },
    popp: function() {
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), e = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), a = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), i = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        });
        t.rotateZ(135).step(), e.translate(0, -60).rotateZ(0).opacity(1).step(), a.translate(-60, 0).rotateZ(0).opacity(1).step(), 
        i.translate(-100, 100).rotateZ(0).opacity(1).step(), this.setData({
            animPlus: t.export(),
            animCollect: e.export(),
            animTranspond: a.export(),
            animInput: i.export()
        });
    },
    takeback: function() {
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), e = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), a = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), i = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        });
        t.rotateZ(0).step(), e.translate(0, 0).rotateZ(0).opacity(0).step(), a.translate(0, 0).rotateZ(0).opacity(0).step(), 
        i.translate(0, 0).rotateZ(0).opacity(0).step(), this.setData({
            animPlus: t.export(),
            animCollect: e.export(),
            animTranspond: a.export(),
            animInput: i.export()
        });
    },
    onLoad: function(e) {
        wx.hideShareMenu(), console.log(e);
        var i = this, o = wx.getStorageSync("userInfo"), n = o.user_id, s = wx.getSystemInfoSync(), r = t.siteInfo.uniacid;
        i.setData({
            windowWidth: s.windowWidth,
            windowHeight: s.windowHeight,
            userInfo: o,
            open_type: e.type || "",
            id: parseInt(e.id),
            share_user_id: e.share_user_id || ""
        }), t.util.request({
            url: a.CreatGiftGoodsCode,
            data: {
                goodsId: parseInt(e.id),
                user_id: n,
                uniacid: r
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), i.setData({
                    goodsCode: t.data.data.img
                });
            }
        }), t.util.request({
            url: a.Index,
            data: {
                user_id: n
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || i.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), this.getGoodsInfo();
    },
    onShow: function() {
        var t = wx.getStorageSync("userInfo"), e = t.user_id;
        if (this.setData({
            user_id: e
        }), "0" == t.login_state) wx.navigateTo({
            url: "../auth/index/index"
        }); else {
            if (e == this.data.share_user_id) return !1;
            this.data.share_user_id && e != this.data.share_user_id && "" == t.inviter && this.getFansInfo(e);
        }
    },
    index: function() {
        wx.reLaunch({
            url: "/meike_mall/pages/index/index"
        });
    },
    getVideosrc: function() {
        var e = this, i = e.data.goods.video_url;
        t.util.request({
            url: a.GetVideoInfo,
            data: {
                videosrc: i
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), "" == t.data ? wx.showToast({
                    title: "视频解析失败",
                    icon: "loading",
                    duration: 2e3
                }) : e.setData({
                    videosrc: t.data
                });
            }
        });
    },
    vplay: function(t) {
        var e = this;
        "1" == e.data.goods.choose ? e.getVideosrc() : e.setData({
            videosrc: e.data.goods.video_url
        }), wx.createVideoContext("video").play(), this.setData({
            hide: !1,
            dots: !1,
            autoplay: !1,
            videoauto: !0
        });
    },
    close: function(t) {
        wx.createVideoContext("video").pause(), this.setData({
            hide: !0,
            dots: !0,
            autoplay: !0
        });
    },
    formSubmit: function(e) {
        var i = e.detail.formId, o = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: a.FormID,
            data: {
                user_id: o,
                form_id: i
            },
            cachetime: 0,
            success: function(t) {
                console.log("form_id添加成功");
            }
        });
    },
    preventD: function() {},
    getFansInfo: function(e) {
        var i = this;
        t.util.request({
            url: a.FansBind,
            data: {
                inviter_id: i.data.share_user_id,
                user_id: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), "errno" != e.data.message && (wx.setStorageSync("userInfo", e.data.data), 
                t.util.request({
                    url: a.SendMessageNew,
                    data: {
                        inviter_id: e.data.data.inviter_id,
                        user_id: e.data.data.user_id,
                        nickname: e.data.data.nickname,
                        open_type: i.data.open_type
                    },
                    cachetime: 0,
                    success: function(t) {
                        console.log("发送成功");
                    }
                }));
            }
        });
    },
    getGoodsInfo: function() {
        var i = this;
        wx.getStorageSync("userInfo").store_id;
        t.util.request({
            url: a.GiftGoodsDetail,
            data: {
                id: i.data.id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (i.setData({
                    goods: t.data.data.info
                }), e.wxParse("goodsDetail", "html", t.data.data.info.goods_desc, i), wx.setNavigationBarTitle({
                    title: t.data.data.info.name
                }));
            }
        });
    },
    pay: function() {
        var e = this, i = wx.getStorageSync("userInfo").user_id, o = e.data.goods.id, n = e.data.goods.name, s = e.data.goods.price, r = e.data.goods.envelope, d = e.data.goods.primary_pic_url;
        t.util.request({
            url: a.GiftOrderSubmit,
            data: {
                user_id: i,
                order_status: "0",
                pay_status: "0",
                pay_name: n,
                goods_image: d,
                pay_id: o,
                envelope: r,
                price: s
            },
            cachetime: 0,
            success: function(t) {
                var e = t.data.data.order_sn;
                wx.setStorageSync("ordersn", e), wx.navigateTo({
                    url: "../giftPay/giftPay"
                });
            }
        });
    },
    onShareAppMessage: function(t) {
        return t.from, {
            title: this.data.goods.name,
            path: "/meike_mall/pages/ucenter/giftGoods/giftGoods?id=" + this.data.id + "&share_user_id=" + this.data.user_id + "&type=link"
        };
    }
}, "preventD", function() {}));