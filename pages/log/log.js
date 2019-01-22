getApp();

Page({
    data: {
        showLog: !1
    },
    onLoad: function() {},
    toggleLog: function() {
        this.setData({
            showLog: !this.data.showLog
        });
    }
});