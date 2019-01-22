require("../../../utils/util.js");

var e = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        partnerInfo: {},
        array: [],
        level: [],
        index: 0,
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    xieyi: function() {
        wx.navigateTo({
            url: "../shareXieyi/shareXieyi"
        });
    },
    bindPickerChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        var a = this, t = e.detail.value, n = a.data.level[t].money, o = a.data.level[t].commission, i = a.data.level[t].commission2;
        this.setData({
            index: t,
            money: n,
            commission: o,
            commission2: i
        });
    },
    owner: function(e) {
        var a = this, t = e.detail.value;
        a.setData({
            owner: t
        });
    },
    removeOwner: function(e) {
        this.setData({
            owner: ""
        });
    },
    formSubmit: function(t) {
        var n = this, o = wx.getStorageSync("userInfo"), i = o.user_id, r = o.city, s = n.data.index, l = n.data.array[s], d = n.data.money, c = t.detail.formId, u = t.detail.value.owner, m = t.detail.value.phoneNumber;
        return "" == u ? (a.showErrorModal("请输入真实姓名", "提醒"), !1) : "" == m ? (a.showErrorModal("请输入手机号", "提醒"), 
        !1) : this.data.partnerInfo.num > s ? (a.showErrorModal("请高于当前等级", "提醒"), !1) : void a.util.request({
            url: e.ApplyShare,
            data: {
                user_id: i,
                level: s + 1,
                owner: u,
                mobile: m,
                form_id: c,
                total: d,
                city: r,
                status: "0",
                pay_status: "0"
            },
            cachetime: 0,
            success: function(e) {
                if (console.log(e), !e.data.errno) {
                    var t = e.data.data.ordersn, n = wx.getStorageSync("userInfo").openid, o = a.siteInfo.siteroot, i = a.siteInfo.uniacid, r = "开通" + l + "合伙人";
                    o = (o = o.split("/app")[0]) + "/addons/maker_mall/pay" + i + "/example/jsapi.php", 
                    console.log(o), wx.request({
                        url: o,
                        data: {
                            openid: n,
                            total: d,
                            ordersn: t,
                            title: r
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(e) {
                            var a = e.data;
                            a.package.split("=")[1];
                            wx.requestPayment({
                                timeStamp: a.timeStamp,
                                nonceStr: a.nonceStr,
                                package: a.package,
                                signType: "MD5",
                                paySign: a.paySign,
                                success: function(e) {},
                                fail: function(e) {
                                    wx.redirectTo({
                                        url: "../../user/orderInfo/orderInfo?ordersn=" + t
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    onLoad: function(t) {
        var n = this, o = wx.getStorageSync("userInfo"), i = o.user_id, r = o.inviter;
        n.setData({
            inviter: r
        }), a.util.request({
            url: e.LevelList,
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var a = e.data.data.level[0].money, t = e.data.data.level[0].commission, o = e.data.data.level[0].commission2;
                n.setData({
                    array: e.data.data.levelList,
                    level: e.data.data.level,
                    image_url: e.data.data.img2,
                    money: a,
                    commission: t,
                    commission2: o
                });
            }
        }), a.util.request({
            url: e.Partner,
            data: {
                user_id: i
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), n.setData({
                    partnerInfo: e.data.data.partnerInfo
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});