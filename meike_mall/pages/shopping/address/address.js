var e = require("../../../utils/util.js"), s = require("../../../config/api.js");

getApp();

Page({
    data: {
        addressList: []
    },
    onLoad: function(e) {
        this.getAddressList();
    },
    onReady: function() {},
    onShow: function() {},
    getAddressList: function() {
        var t = this;
        e.request(s.AddressList).then(function(e) {
            0 === e.errno && t.setData({
                addressList: e.data
            });
        });
    },
    addressAddOrUpdate: function(e) {
        console.log(e), wx.navigateTo({
            url: "/pages/shopping/addressAdd/addressAdd?id=" + e.currentTarget.dataset.addressId
        });
    },
    selectAddress: function(e) {
        console.log(e.currentTarget.dataset.addressId);
        try {
            wx.setStorageSync("addressId", e.currentTarget.dataset.addressId);
        } catch (e) {}
        wx.redirectTo({
            url: "/pages/shopping/checkout/checkout"
        });
    },
    onHide: function() {},
    onUnload: function() {}
});