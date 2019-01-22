require("../../../utils/util.js"), require("../../../config/api.js"), getApp();

Page({
    data: {
        array: [ "请选择反馈类型", "商品相关", "物流状况", "客户服务", "优惠活动", "功能异常", "产品建议", "其他" ],
        index: 0
    },
    bindPickerChange: function(n) {
        console.log("picker发送选择改变，携带值为", n.detail.value), this.setData({
            index: n.detail.value
        });
    },
    remove: function(n) {
        console.log(n), this.setData({
            phone: ""
        });
    },
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});