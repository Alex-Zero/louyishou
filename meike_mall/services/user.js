var n = require("../utils/util.js"), e = require("../config/api.js");

getApp();

module.exports = {
    loginByWeixin: function() {
        var t = null;
        return new Promise(function(o, c) {
            return n.login().then(function(e) {
                return console.log(e), t = e.code, n.getUserInfo();
            }).then(function(r) {
                n.request(e.AuthLoginByWeixin, {
                    code: t,
                    userInfo: r
                }, "POST").then(function(n) {
                    0 === n.errno ? (wx.setStorageSync("userInfo", n.data.userInfo), wx.setStorageSync("token", n.data.token), 
                    o(n)) : c(n);
                }).catch(function(n) {
                    c(n);
                });
            }).catch(function(n) {
                c(n);
            });
        });
    },
    checkLogin: function() {
        return new Promise(function(e, t) {
            wx.getStorageSync("userInfo") && wx.getStorageSync("token") ? n.checkSession().then(function() {
                e(!0);
            }).catch(function() {
                t(!1);
            }) : t(!1);
        });
    }
};