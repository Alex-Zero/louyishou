Page({
    data: {},
    onLoad: function(n) {
        var o = this, t = wx.getSystemInfoSync();
        o.setData({
            windowWidth: t.windowWidth,
            windowHeight: t.windowHeight
        }), setTimeout(function() {
            wx.navigateBack({
                delta: "1"
            });
        }, 1500);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});