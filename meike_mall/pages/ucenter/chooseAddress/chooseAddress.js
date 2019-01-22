require("../../../utils/util.js");

var s = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        addressList: [],
        sysinfo: {}
    },
    onLoad: function(e) {
        var d = this;
        t.util.request({
            url: s.Index,
            cachetime: 0,
            success: function(s) {
                console.log(s), s.data.errno || d.setData({
                    sysinfo: s.data.data.sysinfo
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        this.getAddressList();
    },
    getAddressList: function() {
        var e = this, d = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: s.AddressList,
            data: {
                user_id: d
            },
            cachetime: 0,
            success: function(s) {
                console.log(s.data), s.data.errno || e.setData({
                    addressList: s.data.data.addressList
                });
            }
        });
    },
    addressAddOrUpdate: function(s) {
        wx.navigateTo({
            url: "../addressAdd/addressAdd?id=" + s.currentTarget.dataset.addressId
        });
    },
    deleteAddress: function(e) {
        console.log(e.target);
        var d = this;
        return wx.showModal({
            title: "",
            content: "确定要删除地址？",
            success: function(a) {
                if (a.confirm) {
                    var n = e.target.dataset.addressId;
                    t.util.request({
                        url: s.AddressDelete,
                        data: {
                            id: n
                        },
                        cachetime: 0,
                        success: function(s) {
                            s.data.errno || d.getAddressList();
                        }
                    }), console.log("用户点击确定");
                }
            }
        }), !1;
    },
    onHide: function() {},
    onUnload: function() {}
});