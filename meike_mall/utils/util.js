function n(n, e, t) {
    return e in n ? Object.defineProperty(n, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[e] = t, n;
}

function e(n) {
    var e = n.getFullYear(), o = n.getMonth() + 1, r = n.getDate(), i = n.getHours(), u = n.getMinutes(), c = n.getSeconds();
    return [ e, o, r ].map(t).join("-") + " " + [ i, u, c ].map(t).join(":");
}

function t(n) {
    return (n = n.toString())[1] ? n : "0" + n;
}

function o(n) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "GET";
    return new Promise(function(u, s) {
        wx.request({
            url: n,
            data: e,
            method: t,
            header: {
                "Content-Type": "application/json",
                "X-Nideshop-Token": wx.getStorageSync("token")
            },
            success: function(n) {
                if (console.log(n), console.log("success"), 200 == n.statusCode) {
                    if (401 == n.data.errno) {
                        var e = null;
                        return r().then(function(n) {
                            return e = n.code, i();
                        }).then(function(n) {
                            o(c.AuthLoginByWeixin, {
                                code: e,
                                userInfo: n
                            }, "POST").then(function(n) {
                                0 === n.errno ? (wx.setStorageSync("userInfo", n.data.userInfo), wx.setStorageSync("token", n.data.token), 
                                u(n)) : s(n);
                            }).catch(function(n) {
                                s(n);
                            });
                        }).catch(function(n) {
                            s(n);
                        });
                    }
                    u(n.data);
                } else s(n.errMsg);
            },
            fail: function(n) {
                s(n), console.log("failed");
            }
        });
    });
}

function r() {
    return new Promise(function(n, e) {
        wx.login({
            success: function(t) {
                t.code ? n(t) : e(t);
            },
            fail: function(n) {
                e(n);
            }
        });
    });
}

function i() {
    return new Promise(function(n, e) {
        wx.getUserInfo({
            withCredentials: !0,
            success: function(e) {
                console.log(e), n(e);
            },
            fail: function(n) {
                e(n);
            }
        });
    });
}

function e(n) {
    var e = n.getFullYear(), o = n.getMonth() + 1, r = n.getDate(), i = n.getHours(), u = n.getMinutes(), c = n.getSeconds();
    return [ e, o, r ].map(t).join("/") + " " + [ i, u, c ].map(t).join(":");
}

function t(n) {
    return (n = n.toString())[1] ? n : "0" + n;
}

var u, c = require("../config/api.js");

module.exports = (u = {
    formatTime: e,
    request: o,
    redirect: function(n) {
        wx.redirectTo({
            url: n
        });
    },
    showErrorToast: function(n) {
        wx.showToast({
            title: n,
            icon: "none"
        });
    },
    checkSession: function() {
        return new Promise(function(n, e) {
            wx.checkSession({
                success: function() {
                    n(!0);
                },
                fail: function() {
                    e(!1);
                }
            });
        });
    },
    login: r,
    getUserInfo: i
}, n(u, "formatTime", e), n(u, "objectToUrlParams", function(n) {
    var e = "";
    for (var t in n) e += "&" + t + "=" + n[t];
    return e.substr(1);
}), u);