require("../../../utils/util.js");

var e = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        desc: [ {
            value: "1.佣金在用户确认收货，订单状态为【已完成】即可结算提现。"
        }, {
            value: "2.每次提现金额不少于50元，上限20000元。"
        }, {
            value: "3.每月最多可提现2次"
        }, {
            value: "4.提现暂不收手续费（以后根据政策调整）。"
        }, {
            value: "5.提现需绑定手机号和微信号。"
        }, {
            value: "6.恶意提现一经发现，平台将对账号进行封号。"
        }, {
            value: "7.提现将会通过微信的【通知服务】进行通知，打款到微信零钱，请注意查收"
        } ],
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        array: [],
        level: [],
        index: 0,
        total: "0.00",
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    onShow: function() {
        var t = this, o = wx.getStorageSync("userInfo").user_id;
        a.util.request({
            url: e.TiXian,
            data: {
                user_id: o
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), t.setData({
                    open_total: e.data.data.open_total,
                    number: e.data.data.number,
                    cut: 2 - e.data.data.number
                });
            }
        });
    },
    totalInput: function(e) {
        var a = e.detail.value;
        this.setData({
            total: a
        });
    },
    all: function() {
        this.setData({
            total: this.data.open_total
        });
    },
    formSubmit: function(t) {
        var o = this, s = wx.getStorageSync("userInfo"), i = s.user_id, l = s.realname, n = s.is_people, r = s.is_store, u = s.is_city, c = s.is_area, d = s.openid, m = s.phoneNumber, f = o.data.total, p = o.data.cut, _ = t.detail.formId;
        if (2 == n) g = 4; else if (2 == r) g = 3; else if (2 == c) g = 2; else if (2 == u) var g = 1;
        return "0.00" == f || "" == f ? (a.showErrorModal("请输入提现金额", "提醒"), !1) : f < 50 ? (a.showErrorModal("提现金额不少于50元", "提醒"), 
        !1) : p < 1 ? (a.showErrorModal("本月提现次数已用完", "提醒"), !1) : o.data.open_total < 50 ? (a.showErrorModal("可提现余额不足50元", "提醒"), 
        !1) : void a.util.request({
            url: e.ApplyTiXian,
            data: {
                user_id: i,
                user_name: l,
                mobile: m,
                user_laber: g,
                total: f,
                status: "1"
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), a.util.request({
                    url: e.SendMessageApplyTixian,
                    data: {
                        form_id: _,
                        openid: d,
                        user_name: l,
                        total: f
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log("发送成功"), wx.showModal({
                            title: "通知",
                            content: "您的提现申请已提交成功，系统正在审核，请留意审核结果通知。",
                            showCancel: !1,
                            confirmText: "我知道了",
                            success: function(e) {
                                e.confirm ? (console.log("用户点击确定"), wx.navigateBack({
                                    delta: 1
                                })) : e.cancel && console.log("用户点击取消");
                            }
                        });
                    }
                });
            }
        });
    }
});