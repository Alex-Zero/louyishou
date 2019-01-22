require("../../../utils/util.js");

var e = require("../../../lib/wxParse/wxParse.js"), t = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        info: {},
        vipTips: !0
    },
    onLoad: function(e) {
        var t = this, a = wx.getSystemInfoSync();
        t.setData({
            windowWidth: a.screenWidth,
            windowHeight: a.screenHeight,
            vip: e.vip || "",
            id: e.id,
            share_user_id: e.share_user_id || ""
        }), this.storeInfo(e.id);
    },
    know: function() {
        this.setData({
            vipTips: !0
        });
    },
    storeInfo: function(i) {
        var n = this;
        a.util.request({
            url: t.BusinessInfo,
            data: {
                id: i
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), n.setData({
                    info: t.data.data.info
                }), e.wxParse("details", "html", t.data.data.info.details, n), wx.setNavigationBarTitle({
                    title: t.data.data.info.storename
                });
            }
        });
    },
    index: function() {
        wx.switchTab({
            url: "/meike_mall/pages/index/index"
        });
    },
    onShow: function() {
        var e = wx.getStorageSync("userInfo"), i = e.user_id;
        if ("0" == e.login_state) wx.navigateTo({
            url: "../../auth/index/index"
        }); else {
            if (i == this.data.share_user_id) return !1;
            this.data.share_user_id && i != this.data.share_user_id && "" == e.inviter && this.getFansInfo(i), 
            "1" == this.data.vip && "0" == e.member && (a.util.request({
                url: t.BackDoor,
                data: {
                    user_id: i
                },
                cachetime: 0,
                success: function(e) {
                    console.log("恭喜成为vip"), wx.setStorageSync("userInfo", e.data.data);
                }
            }), this.setData({
                vipTips: !1
            }));
        }
    },
    getFansInfo: function(e) {
        var i = this;
        a.util.request({
            url: t.FansBind,
            data: {
                inviter_id: i.data.share_user_id,
                user_id: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), "errno" != e.data.message && (wx.setStorageSync("userInfo", e.data.data), 
                a.util.request({
                    url: t.SendMessageNew,
                    data: {
                        inviter_id: e.data.data.inviter_id,
                        user_id: e.data.data.user_id,
                        nickname: e.data.data.nickname,
                        open_type: i.data.open_type
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log("发送成功");
                    }
                }));
            }
        });
    },
    nav: function() {
        wx.openLocation({
            latitude: parseFloat(this.data.info.wei),
            longitude: parseFloat(this.data.info.jing),
            scale: 28
        });
    },
    call: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.info.storetel
        });
    },
    onShareAppMessage: function(e) {
        return {
            title: this.data.info.title,
            path: "/meike_mall/pages/ucenter/businessInfo/businessInfo?share_user_id=" + this.data.info.user_id + "&type=link&id=" + this.data.id
        };
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});