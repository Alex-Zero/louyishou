require("../../utils/util.js");

var t = require("../../config/api.js"), a = getApp();

Page({
    data: {
        cartGoods: [],
        sysinfo: {},
        cartTotal: {
            goodsCount: 0,
            checkedGoodsCount: 0,
            checkedGoodsAmount: 0,
            checkedCommonAmount: 0
        },
        isEditCart: !1,
        checkedAllStatus: !0,
        editCartList: []
    },
    onLoad: function(e) {
        var o = this;
        a.util.request({
            url: t.Index,
            cachetime: 0,
            success: function(t) {
                t.data.errno || o.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        });
    },
    onShow: function() {
        var e = wx.getStorageSync("userInfo").user_id, o = this;
        a.util.request({
            url: t.Index,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || o.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), this.setData({
            user_id: e
        }), this.getCartList();
    },
    getCartList: function() {
        var e = this, o = wx.getStorageSync("userInfo").user_id;
        a.util.request({
            url: t.CartList,
            data: {
                user_id: o
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    cartGoods: t.data.data.cartList,
                    cartTotal: t.data.data.cartTotal
                }), e.setData({
                    checkedAllStatus: e.isCheckedAll()
                });
            }
        });
    },
    isCheckedAll: function() {
        return this.data.cartGoods.every(function(t, a, e) {
            return 1 == t.checked;
        });
    },
    checkedAll: function() {
        var e = this;
        if (this.data.isEditCart) {
            var o = e.isCheckedAll(), c = this.data.cartGoods.map(function(t) {
                return t.checked = !o, t;
            });
            e.setData({
                cartGoods: c,
                checkedAllStatus: e.isCheckedAll(),
                "cartTotal.checkedGoodsCount": e.getCheckedGoodsCount()
            });
        } else a.util.request({
            url: t.CartChecked,
            data: {
                user_id: e.data.user_id,
                isChecked: e.isCheckedAll() ? 0 : 1
            },
            cachetime: 0,
            success: function(t) {
                t.data.errno || e.setData({
                    cartGoods: t.data.data.cartList,
                    cartTotal: t.data.data.cartTotal
                }), e.setData({
                    checkedAllStatus: e.isCheckedAll()
                });
            }
        });
    },
    editCart: function() {
        var t = this;
        if (this.data.isEditCart) this.getCartList(), this.setData({
            isEditCart: !this.data.isEditCart
        }); else {
            var a = this.data.cartGoods.map(function(t) {
                return t.checked = !1, t;
            });
            this.setData({
                editCartList: this.data.cartGoods,
                cartGoods: a,
                isEditCart: !this.data.isEditCart,
                checkedAllStatus: t.isCheckedAll(),
                "cartTotal.checkedGoodsCount": t.getCheckedGoodsCount()
            });
        }
    },
    checkedItem: function(e) {
        var o = e.target.dataset.itemIndex, c = this;
        if (this.data.isEditCart) {
            var s = this.data.cartGoods.map(function(t, a, e) {
                return a == o && (t.checked = !t.checked), t;
            });
            c.setData({
                cartGoods: s,
                checkedAllStatus: c.isCheckedAll(),
                "cartTotal.checkedGoodsCount": c.getCheckedGoodsCount()
            });
        } else a.util.request({
            url: t.CartChecked,
            data: {
                user_id: c.data.user_id,
                cartId: c.data.cartGoods[o].id,
                productIds: c.data.cartGoods[o].product_id,
                isChecked: c.data.cartGoods[o].checked ? 0 : 1
            },
            cachetime: 0,
            success: function(t) {
                t.data.errno || c.setData({
                    cartGoods: t.data.data.cartList,
                    cartTotal: t.data.data.cartTotal
                }), c.setData({
                    checkedAllStatus: c.isCheckedAll()
                });
            }
        });
    },
    getCheckedGoodsCount: function() {
        var t = 0;
        return this.data.cartGoods.forEach(function(a) {
            !0 === a.checked && (t += parseFloat(a.number));
        }), t;
    },
    cutNumber: function(t) {
        var a = t.target.dataset.itemIndex, e = this.data.cartGoods[a], o = parseFloat(e.number) - 1 > 1 ? parseFloat(e.number) - 1 : 1;
        e.number = o, this.setData({
            cartGoods: this.data.cartGoods
        }), this.updateCart(e.product_id, e.goods_id, o, e.id);
    },
    addNumber: function(t) {
        var a = t.target.dataset.itemIndex, e = this.data.cartGoods[a], o = parseFloat(e.number) + 1;
        e.number = o, this.setData({
            cartGoods: this.data.cartGoods
        }), this.updateCart(e.product_id, e.goods_id, o, e.id);
    },
    updateCart: function(e, o, c, s) {
        var d = this, r = wx.getStorageSync("userInfo").user_id;
        a.util.request({
            url: t.CartUpdate,
            data: {
                user_id: r,
                productId: e,
                goodsId: o,
                number: c,
                id: s
            },
            cachetime: 0,
            success: function(t) {
                console.log(t);
                var a = t.data.data.cartList.map(function(t) {
                    return t.checked = !1, t;
                });
                t.data.errno || d.setData({
                    cartGoods: a,
                    cartTotal: t.data.data.cartTotal
                }), d.setData({
                    checkedAllStatus: d.isCheckedAll()
                });
            }
        });
    },
    checkoutOrder: function() {
        var t = this, a = this.data.cartGoods.filter(function(t, a, e) {
            return 1 == t.checked;
        });
        return a.length <= 0 ? (wx.showToast({
            title: "请选择商品",
            icon: "none"
        }), !1) : a.length > 50 ? (wx.showToast({
            title: "所选商品数量超过下单上限，请重新选择",
            icon: "none"
        }), !1) : (console.log(t.data.cartTotal.checkedGoodsAmount), wx.setStorageSync("carts", a), 
        wx.setStorageSync("cartTotal", t.data.cartTotal.checkedGoodsAmount), wx.setStorageSync("cartCommonTotal", t.data.cartTotal.checkedCommonAmount), 
        void wx.navigateTo({
            url: "../shopping/checkout/checkout"
        }));
    },
    deleteCart: function() {
        var e = this;
        wx.showModal({
            content: "确认删除所选商品么？",
            confirmColor: "#b4282d",
            success: function(o) {
                if (!o.confirm) return !1;
                var c = wx.getStorageSync("userInfo").user_id, s = e.data.cartGoods.filter(function(t, a, e) {
                    return 1 == t.checked;
                });
                if (s.length <= 0) return !1;
                console.log(s), s = s.map(function(t, a, e) {
                    if (1 == t.checked) return t.id;
                }), console.log(s.join(",")), a.util.request({
                    url: t.CartDelete,
                    data: {
                        user_id: c,
                        cartIds: s.join(",")
                    },
                    cachetime: 0,
                    success: function(t) {
                        if (console.log(t), !t.data.errno) {
                            var a = t.data.data.cartList.map(function(t) {
                                return t.checked = !1, t;
                            });
                            e.setData({
                                cartGoods: a,
                                cartTotal: t.data.data.cartTotal
                            });
                        }
                        e.setData({
                            checkedAllStatus: e.isCheckedAll()
                        });
                    }
                });
            }
        });
    }
});