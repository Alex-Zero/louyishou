require("../../utils/util.js");

var t = require("../../config/api.js"), e = (require("../../services/user.js"), 
getApp());

Page({
    data: {
        tabs: [ {
            icon: "radarchart",
            name: "雷达"
        }, {
            icon: "YUAN",
            name: "收益"
        }, {
            icon: "setting",
            name: "设置"
        } ],
        menus: [ "时间", "行为" ],
        swaitchStatus: !0,
        activeIndex: "0",
        sliderOffset: 0,
        activeIndex1: 0,
        sliderLeft: 0
    },
    onLoad: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                t.setData({
                    sliderLeft: (e.windowWidth / t.data.tabs.length - 90) / 2,
                    sliderLeft1: (e.windowWidth / t.data.menus.length - 90) / 2
                });
            }
        });
    },
    tabClick: function(t) {
        this.setData({
            sliderOffset: t.currentTarget.offsetLeft,
            activeIndex: t.currentTarget.id
        });
    },
    tabClick1: function(t) {
        this.setData({
            sliderOffset1: t.currentTarget.offsetLeft,
            activeIndex1: t.currentTarget.id
        });
    },
    formSubmitAI: function(i) {
        var a = i.detail.formId, s = wx.getStorageSync("userInfo").user_id;
        e.util.request({
            url: t.FormID,
            data: {
                user_id: s,
                form_id: a
            },
            cachetime: 0,
            success: function(t) {
                console.log("form_id添加成功"), wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    switchOn: function() {
        this.setData({
            swaitchStatus: !0
        });
    },
    switchOff: function() {
        this.setData({
            swaitchStatus: !1
        });
    }
});