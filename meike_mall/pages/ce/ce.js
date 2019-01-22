Page({
    data: {},
    onLoad: function(n) {
        this.limit();
    },
    limit: function() {
        var n = this;
        setTimeout(function() {
            wx.showToast({
                title: "111"
            }), n.limit();
        }, 1e4);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});