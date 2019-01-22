var a = require("../../../config/api.js");

getApp();

Page({
    data: {
        username: "",
        password: "",
        code: "",
        loginErrorCount: 0
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    startLogin: function() {
        var t = this;
        if (t.data.password.length < 1 || t.data.username.length < 1) return wx.showModal({
            title: "错误信息",
            content: "请输入用户名和密码",
            showCancel: !1
        }), !1;
        wx.request({
            url: a.ApiRootUrl + "auth/login",
            data: {
                username: t.data.username,
                password: t.data.password
            },
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                200 == a.data.code && (t.setData({
                    loginErrorCount: 0
                }), wx.setStorage({
                    key: "token",
                    data: a.data.data.token,
                    success: function() {
                        wx.switchTab({
                            url: "/pages/ucenter/index/index"
                        });
                    }
                }));
            }
        });
    },
    bindUsernameInput: function(a) {
        this.setData({
            username: a.detail.value
        });
    },
    bindPasswordInput: function(a) {
        this.setData({
            password: a.detail.value
        });
    },
    bindCodeInput: function(a) {
        this.setData({
            code: a.detail.value
        });
    },
    clearInput: function(a) {
        switch (a.currentTarget.id) {
          case "clear-username":
            this.setData({
                username: ""
            });
            break;

          case "clear-password":
            this.setData({
                password: ""
            });
            break;

          case "clear-code":
            this.setData({
                code: ""
            });
        }
    }
});