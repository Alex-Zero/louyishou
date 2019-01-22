getApp();

Page({
    data: {
        userInfo: {},
        pointGoods: [ {
            info_img: "../../resource/images/fansvip.jpg",
            goods_level: 1,
            goods_name: "hello 购，茅台酒",
            goods_sale_num: "22",
            goods_num: "33",
            goods_point: "44"
        }, {
            info_img: "../../resource/images/fansvip.jpg",
            goods_level: 1,
            goods_name: "hello 购，茅台酒",
            goods_sale_num: "22",
            goods_num: "33",
            goods_point: "44"
        }, {
            info_img: "../../resource/images/fansvip.jpg",
            goods_level: 1,
            goods_name: "hello 购，茅台酒",
            goods_sale_num: "22",
            goods_num: "33",
            goods_point: "44"
        }, {
            info_img: "../../resource/images/fansvip.jpg",
            goods_level: 1,
            goods_name: "hello 购，茅台酒",
            goods_sale_num: "22",
            goods_num: "33",
            goods_point: "44"
        } ]
    },
    onLoad: function() {
        var o = this, s = wx.getStorageSync("userInfo");
        o.setData({
            userInfo: s
        });
    },
    loadUserInfo: function() {
        var o = this;
        wx.request({
            url: "https://shizhencaiyuan.com/groupAdmin.php/Home/User/getUserInfo",
            data: {
                data: JSON.stringify({
                    uid: this.uid,
                    openid: null
                })
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(s) {
                console.log(s.data.data), o.setData({
                    userInfo: s.data.data
                });
            }
        });
    },
    loadPointGoods: function() {
        var o = this;
        wx.request({
            url: "https://shizhencaiyuan.com/groupAdmin.php/Home/PointGoods/getPointGoods",
            success: function(s) {
                console.log(s.data.data), o.setData({
                    pointGoods: s.data.data
                });
            }
        });
    },
    gotoPay: function() {
        wx.showToast({
            title: "功能在开发中...敬请期待！"
        });
    }
});