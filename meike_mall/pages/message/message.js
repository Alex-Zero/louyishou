Page({
    data: {},
    setTabBar: function(n) {
        var o = wx.getStorageSync("tabbar"), t = wx.getStorageSync("tabColor");
        this.setData({
            tabbar: o,
            curIdx: n,
            tabColor: t
        });
    },
    onLoad: function(n) {
        this.setTabBar(n.curIdx);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});