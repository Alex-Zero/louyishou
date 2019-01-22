var t = getApp(), e = require("../../lib/wxParse/wxParse.js"), a = (require("../../utils/util.js"), 
require("../../config/api.js"));

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
            url: a.CreatPoster,
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
        var i = this, o = wx.getStorageSync("userInfo"), s = o.user_id, n = wx.getSystemInfoSync(), r = t.siteInfo.uniacid;
        i.setData({
            windowWidth: n.windowWidth,
            windowHeight: n.windowHeight,
            userInfo: o,
            open_type: e.type || "",
            id: parseInt(e.id),
            share_user_id: e.share_user_id || ""
        }), t.util.request({
            url: a.CreatGoodsCode,
            data: {
                goodsId: parseInt(e.id),
                user_id: s,
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
                user_id: s
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || i.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), "" != o.store_id && "2" != o.is_people && t.util.request({
            url: a.FootPrint,
            data: {
                user_id: s,
                mch_id: o.store_id,
                goods_id: parseInt(e.id)
            },
            cachetime: 0,
            success: function(t) {
                console.log(t);
            }
        }), this.cartGoodsCount(), this.getGoodsInfo();
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
        var e = this, i = e.data.goods.videosrc;
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
        "0" == e.data.goods.type ? e.setData({
            videosrc: e.data.goods.videosrc
        }) : "1" == e.data.goods.type && e.getVideosrc(), wx.createVideoContext("video").play(), 
        this.setData({
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
    formSubmitAI: function(e) {
        var i = e.detail.formId, o = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: a.FormID,
            data: {
                user_id: o,
                form_id: i
            },
            cachetime: 0,
            success: function(t) {
                console.log("form_id添加成功"), wx.navigateTo({
                    url: "/meike_mall/pages/ai/ai"
                });
            }
        });
    },
    showModal: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            });
        }.bind(this), 200);
    },
    hideModal: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export()
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export(),
                showModalStatus: !1
            });
        }.bind(this), 200);
    },
    showModalAttr1: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalAttr: !0,
            label: 1
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            });
        }.bind(this), 200);
    },
    hideModalAttr: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export()
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export(),
                showModalAttr: !1
            });
        }.bind(this), 200);
    },
    showModalAttr2: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalAttr: !0,
            label: 2
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            });
        }.bind(this), 200);
    },
    showModalAttr3: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalAttr: !0,
            label: 3
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            });
        }.bind(this), 200);
    },
    fansPage: function() {
        wx.navigateTo({
            url: "/meike_mall/pages/ucenter/shareFans/shareFans"
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
        var i = this, o = wx.getStorageSync("userInfo").store_id;
        t.util.request({
            url: a.GoodsDetail,
            data: {
                id: i.data.id,
                store_id: o
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (i.setData({
                    goods: t.data.data.info,
                    attribute: t.data.data.attribute,
                    issueList: t.data.data.issue,
                    comment: t.data.data.comment,
                    brand: t.data.data.brand[0] || {},
                    specificationList: t.data.data.specificationList,
                    productList: t.data.data.productList || [],
                    userHasCollect: t.data.data.userHasCollect
                }), "0" == t.data.data.info.fpm && "0" == t.data.data.info.fpp && i.setData({
                    freight_price: t.data.data.info.freight_price
                }), 1 == t.data.data.userHasCollect ? i.setData({
                    collectBackImage: i.data.hasCollectImage
                }) : i.setData({
                    collectBackImage: i.data.noCollectImage
                }), e.wxParse("goodsDetail", "html", t.data.data.info.goods_desc, i), wx.setNavigationBarTitle({
                    title: t.data.data.info.name
                }), i.getGoodsRelated());
            }
        });
    },
    cartGoodsCount: function() {
        var e = this, i = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: a.CartGoodsCount,
            data: {
                user_id: i
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), e.setData({
                    cartGoodsCount: t.data.data.cartGoodsCount.nums
                });
            }
        });
    },
    getGoodsRelated: function() {
        var e = this;
        t.util.request({
            url: a.GoodsRelated,
            data: {
                id: e.data.id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    relatedGoods: t.data.data.goodsList
                });
            }
        });
    },
    clickSkuValue: function(t) {
        for (var e = this, a = t.currentTarget.dataset.nameId, i = t.currentTarget.dataset.valueId, o = this.data.specificationList, s = 0; s < o.length; s++) if (o[s].specification_id == a) for (var n = 0; n < o[s].valueList.length; n++) o[s].valueList[n].id == i ? o[s].valueList[n].checked ? o[s].valueList[n].checked = !1 : o[s].valueList[n].checked = !0 : o[s].valueList[n].checked = !1;
        this.setData({
            specificationList: o
        }), this.changeSpecInfo();
        var r = this.getCheckedProductItem(this.getCheckedSpecKey());
        if (!r || r.length <= 0) return !1;
        console.log(r), e.setData({
            checkedProduct: r
        });
    },
    getCheckedSpecValue: function() {
        for (var t = [], e = this.data.specificationList, a = 0; a < e.length; a++) {
            for (var i = {
                nameId: e[a].specification_id,
                valueId: 0,
                valueText: ""
            }, o = 0; o < e[a].valueList.length; o++) e[a].valueList[o].checked && (i.valueId = e[a].valueList[o].id, 
            i.valueText = e[a].valueList[o].value, i.valueThumb = e[a].valueList[o].thumb);
            t.push(i);
        }
        return t;
    },
    setSpecValueStatus: function() {},
    isCheckedAllSpec: function() {
        return !this.getCheckedSpecValue().some(function(t) {
            if (0 == t.valueId) return console.log("规格不完整"), wx.showToast({
                title: "请选择完整规格",
                icon: "none"
            }), !0;
        });
    },
    getCheckedSpecKey: function() {
        return this.getCheckedSpecValue().map(function(t) {
            return t.valueId;
        }).join("_");
    },
    changeSpecInfo: function() {
        var t = this, e = this.getCheckedSpecValue().filter(function(e) {
            return 0 != e.valueId && ("" != e.valueThumb && t.setData({
                thumb: e.valueThumb
            }), !0);
        }).map(function(t) {
            return t.valueText;
        });
        e.length > 0 ? this.setData({
            checkedSpecText: e.join("　")
        }) : this.setData({
            checkedSpecText: "请选择规格数量"
        });
    },
    getCheckedProductItem: function(t) {
        return this.data.productList.filter(function(e) {
            return e.specs == t;
        });
    },
    switchAttrPop: function() {
        0 == this.data.openAttr && this.setData({
            openAttr: !this.data.openAttr,
            collectBackImage: "../../resource/images/detail_back.png"
        });
    },
    openCartPage: function() {
        wx.switchTab({
            url: "../cart/cart"
        });
    },
    addToCart: function() {
        var e = this, i = wx.getStorageSync("userInfo"), o = i.user_id;
        if ("0" == e.data.goods.hasoption) {
            if ("1" == e.data.goods.is_distribution) if ("1" == i.member) n = e.data.goods.vip_fx_total; else n = e.data.goods.fx_total; else n = "";
            if ("1" == i.member) r = e.data.goods.members_price; else r = e.data.goods.retail_price;
            if (e.data.goods.goods_number < this.data.number) return wx.showToast({
                title: "库存不足，请重新选择",
                icon: "none"
            }), !1;
            t.util.request({
                url: a.CartAdd,
                data: {
                    user_id: o,
                    goods_id: e.data.id,
                    goods_name: e.data.goods.name,
                    goods_image: e.data.goods.primary_pic_url,
                    members_price: e.data.goods.members_price,
                    retail_price: e.data.goods.retail_price,
                    fx_total: n,
                    goods_specifition_name_value: "默认",
                    goods_specifition_ids: "",
                    total: r,
                    number: e.data.number
                },
                cachetime: 0,
                success: function(t) {
                    console.log(t), e.cartGoodsCount(), wx.showToast({
                        title: "添加成功"
                    }), setTimeout(function() {
                        e.hideModalAttr(), e.cartGoodsCount();
                    }, 2e3);
                }
            });
        } else {
            if (!this.isCheckedAllSpec()) return !1;
            var s = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!s || s.length <= 0) return !1;
            if (console.log("验证库存"), s[0].stock < this.data.number) return wx.showToast({
                title: "库存不足，请重新选择",
                icon: "none"
            }), !1;
            if ("1" == e.data.goods.is_distribution) if ("1" == i.member) n = s[0].vip_fx_total; else n = s[0].fx_total; else var n = "";
            if ("1" == i.member) {
                r = s[0].costprice;
                console.log(r);
            } else {
                var r = s[0].marketprice;
                console.log(r);
            }
            t.util.request({
                url: a.CartAdd,
                data: {
                    user_id: o,
                    goods_id: e.data.id,
                    goods_name: e.data.goods.name,
                    goods_image: e.data.goods.primary_pic_url,
                    members_price: s[0].costprice,
                    retail_price: s[0].marketprice,
                    fx_total: n,
                    goods_specifition_name_value: s[0].title,
                    goods_specifition_ids: s[0].id,
                    total: r,
                    number: e.data.number
                },
                cachetime: 0,
                success: function(t) {
                    console.log(t), e.cartGoodsCount(), wx.showToast({
                        title: "添加成功"
                    }), setTimeout(function() {
                        e.hideModalAttr(), e.cartGoodsCount();
                    }, 1e3);
                }
            });
        }
    },
    pay: function() {
        var e = this, i = wx.getStorageSync("userInfo"), o = i.user_id, s = e.data.goods.id, n = e.data.goods.name, r = e.data.goods.retail_price, d = e.data.goods.members_price, c = e.data.goods.primary_pic_url, u = e.data.number, l = e.data.goods.hasoption, m = e.data.sysinfo.rap_show, p = e.data.goods.is_plugin, g = e.data.goods.freight_price, h = e.data.goods.fpm, f = e.data.goods.fpp;
        if ("1" == i.member) _ = d * u; else var _ = r * u;
        if (g > 0) if (_ > h || _ == h || u > f || u == f) x = 0; else x = g; else var x = 0;
        if ("0" == l) {
            if ("1" == e.data.goods.is_distribution) if ("1" == i.member) w = e.data.goods.vip_fx_total * e.data.number; else w = e.data.goods.fx_total * e.data.number; else w = "";
            if (1 == m) {
                if (1 == p) b = ""; else b = e.data.goods.plugin_price * e.data.number;
                wx.setStorageSync("rap_price", b);
            }
            if (e.data.goods.goods_number < this.data.number) return wx.showToast({
                title: "库存不足，请重新选择",
                icon: "none"
            }), !1;
            t.util.request({
                url: a.OrderSubmit,
                data: {
                    user_id: o,
                    order_status: "0",
                    pay_status: "0",
                    pay_name: n,
                    goods_image: c,
                    pay_id: s,
                    order_price: r * u,
                    member_price: d * u,
                    pay_attr: "默认",
                    pay_num: u,
                    goods_price: r,
                    fx_total: w,
                    freight_price: x
                },
                cachetime: 0,
                success: function(t) {
                    var e = t.data.data.order_sn;
                    wx.setStorageSync("ordersn", e), wx.setStorageSync("goods_specifition_ids", ""), 
                    wx.navigateTo({
                        url: "../pay/pay"
                    });
                }
            });
        } else {
            if (!this.isCheckedAllSpec()) return !1;
            var v = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!v || v.length <= 0) return !1;
            if (console.log("验证库存"), console.log(v), v[0].stock < this.data.number) return wx.showToast({
                title: "库存不足，请重新选择",
                icon: "none"
            }), !1;
            if ("1" == e.data.goods.is_distribution) if ("1" == i.member) {
                console.log("执行了多规格分销"), console.log(v[0].vip_fx_total);
                w = v[0].vip_fx_total * e.data.number;
            } else w = v[0].fx_total * e.data.number; else var w = "";
            if (1 == m) {
                if (1 == p) b = ""; else var b = e.data.goods.plugin_price * e.data.number;
                wx.setStorageSync("rap_price", b);
            }
            t.util.request({
                url: a.OrderSubmit,
                data: {
                    user_id: o,
                    order_status: "0",
                    pay_status: "0",
                    pay_name: n,
                    goods_image: c,
                    pay_id: s,
                    order_price: v[0].marketprice * u,
                    member_price: v[0].costprice * u,
                    pay_attr: e.data.checkedSpecText,
                    fx_total: w,
                    pay_num: u,
                    goods_price: v[0].marketprice
                },
                cachetime: 0,
                success: function(t) {
                    var a = t.data.data.order_sn;
                    wx.setStorageSync("ordersn", a), wx.setStorageSync("goods_specifition_ids", v[0].id);
                    var i = wx.createAnimation({
                        duration: 200,
                        timingFunction: "linear",
                        delay: 0
                    });
                    e.animation = i, i.translateY(300).step(), e.setData({
                        animationData: i.export()
                    }), setTimeout(function() {
                        i.translateY(0).step(), e.setData({
                            animationData: i.export(),
                            showModalAttr: !1
                        });
                    }.bind(this), 200), wx.navigateTo({
                        url: "../pay/pay"
                    });
                }
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
    },
    onShareAppMessage: function(t) {
        return console.log(this.data.mch_id), t.from, {
            title: this.data.goods.name,
            path: "/meike_mall/pages/goods/goods?id=" + this.data.id + "&mch_id=" + this.data.mch_id + "&share_user_id=" + this.data.user_id + "&type=link"
        };
    }
}, "preventD", function() {}));