Page({
    data: {},
    onLoad: function(o) {},
    onReady: function() {},
    onShow: function() {},
    location: function() {
        wx.getLocation({
            type: "wgs84",
            success: function(o) {
                console.log(o);
                o.latitude, o.longitude, o.speed, o.accuracy;
            }
        });
    }
});