require("../../../utils/util.js");

var e = require("../../../config/api.js"), t = getApp(), i = [];

Page({
    data: {
        address: {
            id: 0,
            province_id: 0,
            city_id: 0,
            district_id: 0,
            address: "",
            full_region: "",
            name: "",
            mobile: "",
            is_default: 0
        },
        addressId: 0,
        openSelectRegion: !1,
        selectRegionList: [ {
            id: 0,
            name: "省份",
            parent_id: 1,
            type: 1
        }, {
            id: 0,
            name: "城市",
            parent_id: 1,
            type: 2
        } ],
        regionType: 1,
        regionList: [],
        selectRegionDone: !1,
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        array: [],
        imgArray: [],
        fxset: {},
        level: [],
        index: 0,
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    onLoad: function(e) {
        this.getRegionList(1);
    },
    onShow: function() {
        var i = this, a = wx.getStorageSync("userInfo"), o = a.phoneNumber, n = a.inviter, s = t.siteInfo.siteroot, r = t.siteInfo.uniacid;
        s = s.split("/app")[0], i.setData({
            inviter: n,
            uniacid: r,
            phoneNumber: o,
            url: s
        }), t.util.request({
            url: e.LevelList,
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var t = e.data.data.level[0].money, a = e.data.data.level[0].commission, o = e.data.data.level[0].commission2;
                i.setData({
                    array: e.data.data.levelList,
                    level: e.data.data.level,
                    fxset: e.data.data.fxset,
                    money: t,
                    commission: a,
                    commission2: o
                });
            }
        });
    },
    getPhoneNumber: function(i) {
        var a = this, o = (i.detail.errMsg, i.detail.iv), n = i.detail.encryptedData, s = a.data.code, r = wx.getStorageSync("session_key"), c = wx.getStorageSync("userInfo").user_id;
        "getPhoneNumber:fail user deny" == i.detail.errMsg ? wx.showToast({
            title: "授权失败请重试",
            icon: "none",
            duration: 2e3
        }) : t.util.request({
            url: e.GetPhoneNumber,
            data: {
                session_key: r,
                encryptedData: n,
                iv: o,
                code: s
            },
            cachetime: 0,
            success: function(i) {
                console.log(i), t.util.request({
                    url: e.UpdatePhoneNumber,
                    data: {
                        phoneNumber: i.data.phoneNumber,
                        user_id: c
                    },
                    cachetime: 0,
                    success: function(e) {
                        a.setData({
                            phoneNumber: e.data.data.phoneNumber
                        }), wx.showToast({
                            title: "授权成功",
                            icon: "none",
                            duration: 2e3
                        });
                    },
                    fail: function(e) {}
                });
            },
            fail: function(e) {
                wx.showModal({
                    title: "提示",
                    content: "签名错误",
                    showCancel: "false",
                    success: function(e) {
                        e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
                    }
                });
            }
        });
    },
    xieyi: function() {
        wx.navigateTo({
            url: "../shareXieyi/shareXieyi"
        });
    },
    change: function() {
        wx.navigateTo({
            url: "../addInviter/addInviter"
        });
    },
    bindPickerChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        var t = this, i = e.detail.value, a = t.data.level[i].money, o = t.data.level[i].commission, n = t.data.level[i].commission2;
        this.setData({
            index: i,
            money: a,
            commission: o,
            commission2: n
        });
    },
    store: function(e) {
        var t = this, i = e.detail.value;
        t.setData({
            store: i
        });
    },
    removeStore: function(e) {
        this.setData({
            store: ""
        });
    },
    owner: function(e) {
        var t = this, i = e.detail.value;
        t.setData({
            owner: i
        });
    },
    removeOwner: function(e) {
        this.setData({
            owner: ""
        });
    },
    imgArray: function(e) {
        var t = this, a = 5 - i.length;
        console.log(a), a > 0 && a <= 5 ? wx.chooseImage({
            count: a,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                wx.showToast({
                    icon: "loading",
                    title: "正在上传"
                });
                var i = e.tempFilePaths, a = t.data.uniacid;
                t.uploadimg({
                    url: t.data.url + "/app/index.php?i=" + a + "&c=entry&a=wxapp&do=Upload&m=meike_mall",
                    path: i
                });
            }
        }) : wx.showModal({
            title: "上传提示",
            content: "最多上传5张图片",
            showCancel: !0,
            cancelText: "取消",
            cancelColor: "",
            confirmText: "确定",
            confirmColor: "",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    uploadimg: function(e) {
        var t = this, a = e.i ? e.i : 0, o = e.success ? e.success : 0, n = e.fail ? e.fail : 0;
        wx.uploadFile({
            url: e.url,
            filePath: e.path[a],
            name: "upfile",
            formData: null,
            success: function(e) {
                "" != e.data ? (console.log(e), o++, i.push(e.data), t.setData({
                    imgArray: i
                }), console.log("申请合伙店铺提交的图片数组", i)) : wx.showToast({
                    icon: "loading",
                    title: "请重试"
                });
            },
            fail: function(e) {
                n++, console.log("fail:" + a + "fail:" + n);
            },
            complete: function() {
                console.log(a), ++a == e.path.length ? (t.setData({
                    images: e.path
                }), wx.hideToast(), console.log("执行完毕"), console.log("成功：" + o + " 失败：" + n)) : (console.log(a), 
                e.i = a, e.success = o, e.fail = n, t.uploadimg(e));
            }
        });
    },
    formSubmit: function(i) {
        var a = this, o = this.data.address, n = o.province, s = o.province_id, r = o.city, c = o.city_id, d = o.district, l = o.district_id, u = wx.getStorageSync("userInfo"), g = u.user_id, p = u.nickname, m = u.avatar, h = u.openid, f = a.data.index, y = i.detail.value.store, v = a.data.array[f], w = a.data.money, _ = i.detail.formId, x = i.detail.value.owner, R = i.detail.value.phoneNumber, S = a.data.location, D = a.data.imgArray, L = D.toString();
        if (void 0 != S) var T = S.longitude, b = S.latitude, I = S.address;
        return "0" == o.province_id ? (t.showErrorModal("请选择店铺地址", "提醒"), !1) : void 0 == S ? (t.showErrorModal("请选择店铺地址", "提醒"), 
        !1) : "" == y ? (t.showErrorModal("请输入店铺名称", "提醒"), !1) : "" == x ? (t.showErrorModal("请输入真实姓名", "提醒"), 
        !1) : "" == R ? (t.showErrorModal("请输入手机号", "提醒"), !1) : "" == D ? (t.showErrorModal("请添加店铺图片和营业执照", "提醒"), 
        !1) : void t.util.request({
            url: e.ApplyStore,
            data: {
                user_id: g,
                openid: h,
                level: f + 1,
                owner: x,
                mobile: R,
                form_id: _,
                nickname: p,
                avatar: m,
                storeName: y,
                storeAddress: I,
                lng: T,
                lat: b,
                total: w,
                province: n,
                province_id: s,
                city: r,
                city_id: c,
                area: d,
                area_id: l,
                imgArray: L
            },
            cachetime: 0,
            success: function(e) {
                if (console.log(e), !e.data.errno) {
                    var i = e.data.data.ordersn, o = t.siteInfo.siteroot, n = a.data.uniacid, s = "开通" + v + "合伙店铺";
                    o = (o = o.split("/app")[0]) + "/addons/meike_mall/pay" + n + "/example/jsapi.php", 
                    console.log(o), wx.request({
                        url: o,
                        data: {
                            openid: h,
                            total: w,
                            ordersn: i,
                            title: s
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(e) {
                            var o = e.data, n = o.package.split("=")[1];
                            wx.requestPayment({
                                timeStamp: o.timeStamp,
                                nonceStr: o.nonceStr,
                                package: o.package,
                                signType: "MD5",
                                paySign: o.paySign,
                                success: function(e) {
                                    a.sendMessage(n, h, i, s, w), t.util.request({
                                        url: "entry/wxapp/StoreOrderStatus",
                                        data: {
                                            user_id: g,
                                            ordersn: i,
                                            pay_status: "1"
                                        },
                                        cachetime: 0,
                                        success: function(e) {
                                            wx.setStorageSync("userInfo", e.data.data);
                                        }
                                    }), t.util.request({
                                        url: "entry/wxapp/PayLog",
                                        data: {
                                            user_id: g,
                                            oid: i,
                                            openid: h,
                                            nickname: p,
                                            avatar: m,
                                            desc: s,
                                            total: w
                                        },
                                        cachetime: 0,
                                        success: function(e) {}
                                    }), wx.showModal({
                                        title: "通知",
                                        content: "您的资料已提交成功，系统正在审核，请留意审核结果通知。",
                                        showCancel: !1,
                                        confirmText: "我知道了",
                                        success: function(e) {
                                            e.confirm ? (console.log("用户点击确定"), wx.navigateBack({
                                                delta: 1
                                            })) : e.cancel && console.log("用户点击取消");
                                        }
                                    });
                                },
                                fail: function(e) {
                                    t.util.request({
                                        url: "entry/wxapp/DelStoreOrder",
                                        data: {
                                            user_id: g,
                                            ordersn: i
                                        },
                                        cachetime: 0,
                                        success: function(e) {
                                            console.log("订单已删除");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    Qlocation: function() {
        var e = this;
        wx.chooseLocation({
            success: function(t) {
                console.log(t), e.setData({
                    location: t
                });
            }
        });
    },
    setRegionDoneStatus: function() {
        var e = this, t = e.data.selectRegionList.every(function(e) {
            return 0 != e.id;
        });
        e.setData({
            selectRegionDone: t
        });
    },
    chooseRegion: function() {
        this.setData({
            openSelectRegion: !this.data.openSelectRegion
        });
        var e = this.data.address;
        if (e.province_id > 0 && e.city_id > 0 && e.district_id > 0) {
            var t = this.data.selectRegionList;
            t[0].id = e.province_id, t[0].name = e.province, t[0].parent_id = 1, t[1].id = e.city_id, 
            t[1].name = e.city, t[1].parent_id = e.province_id, t[2].id = e.district_id, t[2].name = e.district, 
            t[2].parent_id = e.city_id, this.setData({
                selectRegionList: t,
                regionType: 3
            }), this.getRegionList(e.city_id);
        } else this.setData({
            selectRegionList: [ {
                id: 0,
                name: "省份",
                parent_id: 1,
                type: 1
            }, {
                id: 0,
                name: "城市",
                parent_id: 1,
                type: 2
            } ],
            regionType: 1
        }), this.getRegionList(1);
        this.setRegionDoneStatus();
    },
    selectRegionType: function(e) {
        console.log("selectRegionType:" + e.target.dataset.regionTypeIndex);
        var t = this, i = e.target.dataset.regionTypeIndex, a = t.data.selectRegionList;
        if (i + 1 == this.data.regionType || i - 1 >= 0 && a[i - 1].id <= 0) return !1;
        this.setData({
            regionType: i + 1
        });
        var o = a[i];
        this.getRegionList(o.parent_id), this.setRegionDoneStatus();
    },
    selectRegion: function(e) {
        var t = this, i = e.target.dataset.regionIndex, a = this.data.regionList[i], o = a.type, n = this.data.selectRegionList;
        n[o - 1] = a, console.log(o), console.log(n), 3 != o ? (this.setData({
            selectRegionList: n,
            regionType: o + 1
        }), this.getRegionList(a.id)) : this.setData({
            selectRegionList: n
        }), n.map(function(e, t) {
            return t > o - 1 && (e.id = 0, e.name = "城市", e.parent_id = 0), e;
        }), this.setData({
            selectRegionList: n
        }), t.setData({
            regionList: t.data.regionList.map(function(e) {
                return t.data.regionType == e.type && t.data.selectRegionList[t.data.regionType - 1].id == e.id ? e.selected = !0 : e.selected = !1, 
                e;
            })
        }), this.setRegionDoneStatus();
    },
    doneSelectRegion: function() {
        if (!1 === this.data.selectRegionDone) return !1;
        var e = this.data.address, t = this.data.selectRegionList;
        e.province_id = t[0].id, e.city_id = t[1].id, e.district_id = t[2].id, e.province = t[0].name, 
        e.city = t[1].name, e.district = t[2].name, e.full_region = t.map(function(e) {
            return e.name;
        }).join(""), this.setData({
            address: e,
            openSelectRegion: !1
        });
    },
    cancelSelectRegion: function() {
        this.setData({
            openSelectRegion: !1,
            regionType: this.data.regionDoneStatus ? 3 : 1
        });
    },
    getRegionList: function(i) {
        var a = this, o = a.data.regionType;
        t.util.request({
            url: e.RegionList,
            data: {
                parentId: i
            },
            cachetime: 0,
            success: function(e) {
                console.log(e.data), e.data.errno || a.setData({
                    regionList: e.data.data.regionList.map(function(e) {
                        return o == e.type && a.data.selectRegionList[o - 1].id == e.id ? e.selected = !0 : e.selected = !1, 
                        e;
                    })
                });
            }
        });
    },
    sendMessage: function(e, i, a, o, n) {
        t.util.request({
            url: "entry/wxapp/SendMessageApply",
            data: {
                pack: e,
                openid: i,
                ordersn: a,
                title: o,
                total: n
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno;
            },
            fail: function(e) {
                console.log(e);
            }
        });
    }
});