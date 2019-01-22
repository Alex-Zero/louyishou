require("./meike_mall/utils/util.js"), require("./meike_mall/config/api.js"), require("./meike_mall/services/user.js");

App({
    onLaunch: function() {
        var e = this;
        wx.login({
            success: function(o) {
                o.code ? (e.util.request({
                    url: "entry/wxapp/GetUid",
                    data: {
                        code: o.code,
                        m: "meike_mall"
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno || (wx.setStorageSync("userInfo", e.data.data.userInfo), 
                        wx.setStorageSync("session_key", e.data.data.userInfo.session_key));
                    }
                }), e.util.request({
                    url: "entry/wxapp/Footer",
                    data: {
                        m: "meike_mall"
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), wx.setStorageSync("tabbar", e.data.data.tabbarList), wx.setStorageSync("tabColor", e.data.data.tabColor);
                    }
                })) : console.log("获取用户登录态失败！" + o.errMsg);
            }
        });
    },
    showErrorModal: function(e, o) {
        wx.showModal({
            title: o || "加载失败",
            content: e || "未知错误",
            showCancel: !1,
            confirmColor: "#b4282d"
        });
    },
    showLoadToast: function(e, o) {
        wx.showToast({
            title: e || "加载中",
            icon: "loading",
            duration: o || 1e4
        });
    },
    globalData: {
        userInfo: null,
        mch_info: null,
        code: "",
        openId: "",
        session_key: ""
    },
    util: require("we7/resource/js/util.js"),
    siteInfo: require("siteinfo.js")
});