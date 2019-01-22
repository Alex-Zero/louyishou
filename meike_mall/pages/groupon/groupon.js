function t(a) {
    a.setData({
        clock: e(c)
    }), c <= 0 ? a.setData({
        clock: "已经截止"
    }) : setTimeout(function() {
        c -= 10, t(a);
    }, 10);
}

function e(t) {
    var e = Math.floor(t / 1e3), i = Math.floor(e / 3600), n = a(Math.floor((e - 3600 * i) / 60));
    return i + ":" + n + ":" + a(e - 3600 * i - 60 * n) + " " + a(Math.floor(t % 1e3 / 10));
}

function a(t) {
    return t < 10 ? "0" + t : t;
}

var i = getApp(), n = require("../../lib/wxParse/wxParse.js"), o = require("../../utils/util.js"), s = require("../../config/api.js"), c = 864e5;

Page({
    data: {
        id: 0,
        clock: "",
        animationData: {},
        goods: {},
        instr: [ {
            name: "是否进口",
            desc: "进口"
        }, {
            name: "生产厂家",
            desc: "格瑞斯"
        }, {
            name: "品牌",
            desc: "格瑞斯"
        }, {
            name: "箱装数量",
            desc: "20罐/箱"
        }, {
            name: "重量kg",
            desc: "20"
        }, {
            name: "****",
            desc: "****"
        } ],
        gallery: [ {
            id: "1",
            img_url: "https://unsplash.it/200/200"
        }, {
            id: "2",
            img_url: "https://unsplash.it/400/400"
        }, {
            id: "2",
            img_url: "https://unsplash.it/800/800"
        } ],
        attribute: [ {
            name: "是否进口",
            value: "进口"
        }, {
            name: "生产厂家",
            value: "格瑞斯"
        }, {
            name: "品牌",
            value: "格瑞斯"
        } ],
        issueList: [],
        comment: {
            count: "99",
            data: {
                avatar: "../../resource/images/head.png",
                nickname: "UGoul",
                add_time: "2018-07-26",
                content: "默认好评",
                pic_list: [ {
                    id: "0",
                    pic_url: "https://unsplash.it/200/200"
                }, {
                    id: "0",
                    pic_url: "https://unsplash.it/400/400"
                }, {
                    id: "0",
                    pic_url: "https://unsplash.it/800/800"
                } ]
            }
        },
        ongoing: [ {
            id: 1,
            avatar: "https://wx.qlogo.cn/mmopen/vi_32/7Hy7kuj8kZoUrX6ZL6p3bEEfNlufv7HhLkMfib71EVNDwxALA7B0FXZqLCgz1Js2ickejOwR6bumXMHauOgJlGYg/132",
            nickname: "UGoul",
            rnum: "1",
            time_end: "6:25:36"
        }, {
            id: 2,
            avatar: "https://wx.qlogo.cn/mmopen/vi_32/7Hy7kuj8kZoUrX6ZL6p3bEEfNlufv7HhLkMfib71EVNDwxALA7B0FXZqLCgz1Js2ickejOwR6bumXMHauOgJlGYg/132",
            nickname: "UGoul",
            rnum: "1",
            time_end: "6:25:36"
        }, {
            id: 3,
            avatar: "https://wx.qlogo.cn/mmopen/vi_32/7Hy7kuj8kZoUrX6ZL6p3bEEfNlufv7HhLkMfib71EVNDwxALA7B0FXZqLCgz1Js2ickejOwR6bumXMHauOgJlGYg/132",
            nickname: "UGoul",
            rnum: "1",
            time_end: "6:25:36"
        } ],
        brand: {
            brandId: "1",
            name: "aaaa"
        },
        specificationList: [],
        productList: [],
        relatedGoods: [ {
            id: "1",
            list_pic_url: "https://unsplash.it/400/400",
            name: "狗狗口水巾围巾泰迪宠物口水巾",
            retail_price: "29.8",
            list_num: "156"
        }, {
            id: "2",
            list_pic_url: "https://unsplash.it/200/200",
            name: "宠物消毒液，狗狗除臭剂杀菌剂",
            retail_price: "111",
            list_num: "798"
        } ],
        cartGoodsCount: 0,
        userHasCollect: 0,
        number: 1,
        checkedSpecText: "请选择规格数量",
        openAttr: !1,
        noCollectImage: "../../resource/images/icon_collect.png",
        hasCollectImage: "../../resource/images/icon_collect_checked.png",
        collectBackImage: "../../resource/images/icon_collect.png"
    },
    timeFormat: function(t) {
        var e = (t = t) - new Date().getTime();
        return !(e <= 0) && Math.floor(e / 36e5) + ":" + Math.floor(e / 6e4 % 60) + ":" + Math.floor(e / 1e3 % 60);
    },
    getGoodsInfo: function() {
        var t = this;
        i.util.request({
            url: s.GoodsDetail,
            data: {
                id: t.data.id
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || (t.setData({
                    goods: e.data.data.info,
                    issueList: e.data.data.issue
                }), n.wxParse("goodsDetail", "html", e.data.data.info.goods_desc, t));
            }
        });
    },
    getGoodsRelated: function() {
        var t = this;
        o.request(s.GoodsRelated, {
            id: t.data.id
        }).then(function(e) {
            0 === e.errno && t.setData({
                relatedGoods: e.data.goodsList
            });
        });
    },
    clickSkuValue: function(t) {
        for (var e = t.currentTarget.dataset.nameId, a = t.currentTarget.dataset.valueId, i = this.data.specificationList, n = 0; n < i.length; n++) if (i[n].specification_id == e) for (var o = 0; o < i[n].valueList.length; o++) i[n].valueList[o].id == a ? i[n].valueList[o].checked ? i[n].valueList[o].checked = !1 : i[n].valueList[o].checked = !0 : i[n].valueList[o].checked = !1;
        this.setData({
            specificationList: i
        }), this.changeSpecInfo();
    },
    getCheckedSpecValue: function() {
        for (var t = [], e = this.data.specificationList, a = 0; a < e.length; a++) {
            for (var i = {
                nameId: e[a].specification_id,
                valueId: 0,
                valueText: ""
            }, n = 0; n < e[a].valueList.length; n++) e[a].valueList[n].checked && (i.valueId = e[a].valueList[n].id, 
            i.valueText = e[a].valueList[n].value);
            t.push(i);
        }
        return t;
    },
    setSpecValueStatus: function() {},
    isCheckedAllSpec: function() {
        return !this.getCheckedSpecValue().some(function(t) {
            if (0 == t.valueId) return !0;
        });
    },
    getCheckedSpecKey: function() {
        return this.getCheckedSpecValue().map(function(t) {
            return t.valueId;
        }).join("_");
    },
    changeSpecInfo: function() {
        var t = this.getCheckedSpecValue().filter(function(t) {
            return 0 != t.valueId;
        }).map(function(t) {
            return t.valueText;
        });
        t.length > 0 ? this.setData({
            checkedSpecText: t.join("　")
        }) : this.setData({
            checkedSpecText: "请选择规格数量"
        });
    },
    getCheckedProductItem: function(t) {
        return this.data.productList.filter(function(e) {
            return e.goods_specification_ids == t;
        });
    },
    onLoad: function(e) {
        this.setData({
            id: parseInt(e.id)
        });
        t(this);
    },
    onReady: function() {},
    onShow: function() {
        "0" == wx.getStorageSync("userInfo").login_state && wx.navigateTo({
            url: "../auth/index/index"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    switchAttrPop: function() {
        0 == this.data.openAttr && this.setData({
            openAttr: !this.data.openAttr,
            collectBackImage: "../../resource/images/detail_back.png"
        });
    },
    closeAttrOrCollect: function() {
        var t = this;
        this.data.openAttr ? (this.setData({
            openAttr: !1
        }), 1 == t.data.userHasCollect ? t.setData({
            collectBackImage: t.data.hasCollectImage
        }) : t.setData({
            collectBackImage: t.data.noCollectImage
        })) : o.request(s.CollectAddOrDelete, {
            typeId: 0,
            valueId: this.data.id
        }, "POST").then(function(e) {
            var a = e;
            0 == a.errno ? "add" == a.data.type ? t.setData({
                collectBackImage: t.data.hasCollectImage
            }) : t.setData({
                collectBackImage: t.data.noCollectImage
            }) : wx.showToast({
                image: "../../resource/images/icon_error.png",
                title: a.errmsg,
                mask: !0
            });
        });
    },
    openCartPage: function() {
        wx.switchTab({
            url: "/maker_mail/pages/cart/cart"
        });
    },
    addToCart: function() {
        var t = this;
        if (0 == this.data.openAttr) this.setData({
            openAttr: !this.data.openAttr,
            collectBackImage: "../../resource/images/detail_back.png"
        }); else {
            if (!this.isCheckedAllSpec()) return !1;
            var e = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!e || e.length <= 0) return !1;
            if (e.goods_number < this.data.number) return !1;
            o.request(s.CartAdd, {
                goodsId: this.data.goods.id,
                number: this.data.number,
                productId: e[0].id
            }, "POST").then(function(e) {
                var a = e;
                0 == a.errno ? (wx.showToast({
                    title: "添加成功"
                }), t.setData({
                    openAttr: !t.data.openAttr,
                    cartGoodsCount: a.data.cartTotal.goodsCount
                }), 1 == t.data.userHasCollect ? t.setData({
                    collectBackImage: t.data.hasCollectImage
                }) : t.setData({
                    collectBackImage: t.data.noCollectImage
                })) : wx.showToast({
                    image: "../../resource/images/icon_error.png",
                    title: a.errmsg,
                    mask: !0
                });
            });
        }
    },
    cutNumber: function() {
        this.setData({
            number: this.data.number - 1 > 1 ? this.data.number - 1 : 1
        });
    },
    addNumber: function() {
        this.setData({
            number: this.data.number + 1
        });
    }
});