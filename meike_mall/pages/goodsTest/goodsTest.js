var t = getApp();

Page({
    firstIndex: -1,
    data: {
        bannerApp: !0,
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        productId: 0,
        itemData: {},
        bannerItem: [],
        newGoods: [],
        buynum: 1,
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        firstIndex: -1,
        commodityAttr: [],
        attrValueList: []
    },
    toCar: function() {
        wx.switchTab({
            url: "/pages/cart/cart"
        });
    },
    setModalStatus: function(t) {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = a, a.translateY(300).step(), this.setData({
            animationData: a.export()
        }), 1 == t.currentTarget.dataset.status && this.setData({
            showModalStatus: !0
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a
            }), 0 == t.currentTarget.dataset.status && this.setData({
                showModalStatus: !1
            });
        }.bind(this), 200);
    },
    changeNum: function(t) {
        0 == t.target.dataset.alphaBeta ? this.data.buynum <= 1 || this.setData({
            buynum: this.data.buynum - 1
        }) : this.setData({
            buynum: this.data.buynum + 1
        });
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            productId: t.productId
        }), a.loadProductDetail();
    },
    loadProductDetail: function() {
        var a = this;
        wx.request({
            url: t.d.ceshiUrl + "/Api/Product/index",
            method: "post",
            data: {
                pro_id: a.data.productId
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                if (1 == t.data.status) {
                    var e = t.data.pro, r = e.content;
                    t.data.newGoods;
                    WxParse.wxParse("content", "html", r, a, 3), a.setData({
                        itemData: e,
                        bannerItem: e.img_arr,
                        commodityAttr: t.data.commodityAttr,
                        attrValueList: t.data.attrValueList,
                        newGoods: t.data.newGoods
                    });
                } else wx.showToast({
                    title: t.data.err,
                    duration: 2e3
                });
            },
            error: function(t) {
                wx.showToast({
                    title: "网络异常！",
                    duration: 2e3
                });
            }
        });
    },
    onShow: function() {
        if (this.setData({
            includeGroup: this.data.commodityAttr
        }), this.distachAttrValue(this.data.commodityAttr), 1 == this.data.commodityAttr.length) {
            for (var t = 0; t < this.data.commodityAttr[0].attrValueList.length; t++) this.data.attrValueList[t].selectedValue = this.data.commodityAttr[0].attrValueList[t].attrValue;
            this.setData({
                attrValueList: this.data.attrValueList
            });
        }
    },
    distachAttrValue: function(t) {
        for (var a = this.data.attrValueList, e = 0; e < t.length; e++) for (s = 0; s < t[e].attrValueList.length; s++) {
            var r = this.getAttrIndex(t[e].attrValueList[s].attrKey, a);
            r >= 0 ? this.isValueExist(t[e].attrValueList[s].attrValue, a[r].attrValues) || a[r].attrValues.push(t[e].attrValueList[s].attrValue) : a.push({
                attrKey: t[e].attrValueList[s].attrKey,
                attrValues: [ t[e].attrValueList[s].attrValue ]
            });
        }
        for (e = 0; e < a.length; e++) for (var s = 0; s < a[e].attrValues.length; s++) a[e].attrValueStatus ? a[e].attrValueStatus[s] = !0 : (a[e].attrValueStatus = [], 
        a[e].attrValueStatus[s] = !0);
        this.setData({
            attrValueList: a
        });
    },
    getAttrIndex: function(t, a) {
        for (var e = 0; e < a.length && t != a[e].attrKey; e++) ;
        return e < a.length ? e : -1;
    },
    isValueExist: function(t, a) {
        for (var e = 0; e < a.length && a[e] != t; e++) ;
        return e < a.length;
    },
    selectAttrValue: function(t) {
        var a = this.data.attrValueList, e = t.currentTarget.dataset.index, r = t.currentTarget.dataset.key, s = t.currentTarget.dataset.value;
        (t.currentTarget.dataset.status || e == this.data.firstIndex) && (t.currentTarget.dataset.selectedvalue == t.currentTarget.dataset.value ? this.disSelectValue(a, e, r, s) : this.selectValue(a, e, r, s));
    },
    selectValue: function(t, a, e, r, s) {
        var i = [];
        if (a != this.data.firstIndex || s) u = this.data.includeGroup; else for (var u = this.data.commodityAttr, n = 0; n < t.length; n++) for (o = 0; o < t[n].attrValues.length; o++) t[n].selectedValue = "";
        for (n = 0; n < u.length; n++) for (o = 0; o < u[n].attrValueList.length; o++) u[n].attrValueList[o].attrKey == e && u[n].attrValueList[o].attrValue == r && i.push(u[n]);
        t[a].selectedValue = r, this.setData({
            attrValueList: t,
            includeGroup: i
        });
        for (var d = 0, n = 0; n < t.length; n++) for (var o = 0; o < t[n].attrValues.length; o++) if (t[n].selectedValue) {
            d++;
            break;
        }
        d < 2 ? this.setData({
            firstIndex: a
        }) : this.setData({
            firstIndex: -1
        });
    },
    disSelectValue: function(t, a, e, r) {
        var s = this.data.commodityAttr;
        t[a].selectedValue = "";
        for (u = 0; u < t.length; u++) for (var i = 0; i < t[u].attrValues.length; i++) t[u].attrValueStatus[i] = !0;
        this.setData({
            includeGroup: s,
            attrValueList: t
        });
        for (var u = 0; u < t.length; u++) t[u].selectedValue && this.selectValue(t, u, t[u].attrKey, t[u].selectedValue, !0);
    },
    addFavorites: function(a) {
        var e = this;
        wx.request({
            url: t.d.ceshiUrl + "/Api/Product/col",
            method: "post",
            data: {
                uid: t.d.userId,
                pid: e.data.productId
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                var a = t.data;
                1 == a.status ? (wx.showToast({
                    title: "操作成功！",
                    duration: 2e3
                }), e.data.itemData.isCollect = !0) : wx.showToast({
                    title: a.err,
                    duration: 2e3
                });
            },
            fail: function() {
                wx.showToast({
                    title: "网络异常！",
                    duration: 2e3
                });
            }
        });
    },
    addShopCart: function(a) {
        var e = this;
        wx.request({
            url: t.d.ceshiUrl + "/Api/Shopping/add",
            method: "post",
            data: {
                uid: t.d.userId,
                pid: e.data.productId,
                num: e.data.buynum
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                var e = t.data;
                if (1 == e.status) {
                    if ("buynow" == a.currentTarget.dataset.type) return void wx.redirectTo({
                        url: "../order/pay?cartId=" + e.cart_id
                    });
                    wx.showToast({
                        title: "加入购物车成功",
                        icon: "success",
                        duration: 2e3
                    });
                } else wx.showToast({
                    title: e.err,
                    duration: 2e3
                });
            },
            fail: function() {
                wx.showToast({
                    title: "网络异常！",
                    duration: 2e3
                });
            }
        });
    },
    bindChange: function(t) {
        this.setData({
            currentTab: t.detail.current
        });
    },
    initNavHeight: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    winWidth: a.windowWidth,
                    winHeight: a.windowHeight
                });
            }
        });
    },
    bannerClosed: function() {
        this.setData({
            bannerApp: !1
        });
    },
    swichNav: function(t) {
        var a = this;
        if (a.data.currentTab === t.target.dataset.current) return !1;
        a.setData({
            currentTab: t.target.dataset.current
        });
    },
    onShareAppMessage: function() {
        return {
            title: "商品详情",
            desc: "云端易购-重庆农村电商领导品牌",
            path: "/pages/product/detail?productId=" + id,
            data: {
                data: data
            }
        };
    }
});