var a = require("../../../config/api.js");

getApp();

Page({
    data: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        loginErrorCount: 0
    },
    onLoad: function(a) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    startRegister: function() {
        var t = this;
        return t.data.password.length < 3 || t.data.username.length < 3 ? (wx.showModal({
            title: "错误信息",
            content: "用户名和密码不得少于3位",
            showCancel: !1
        }), !1) : t.data.password != t.data.confirmPassword ? (wx.showModal({
            title: "错误信息",
            content: "确认密码不一致",
            showCancel: !1
        }), !1) : void wx.request({
            url: a.ApiRootUrl + "auth/register",
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
                })), console.log(a.data.data.token);
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
    bindConfirmPasswordInput: function(a) {
        this.setData({
            confirmPassword: a.detail.value
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

          case "clear-confirm-password":
            this.setData({
                confirmPassword: ""
            });
            break;

          case "clear-code":
            this.setData({
                code: ""
            });
        }
    }
});