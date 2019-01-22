Page({
    data: {
        navData: {},
        goodsData: {},
        currentCatId: 0,
        active: 0
    },
    type: 2,
    onLoad: function(t) {
        this.loadNav();
    },
    onShow: function() {
        this.loadGroupList();
    },
    onHide: function() {
        clearInterval(this.timer);
    },
    onUnload: function() {
        clearInterval(this.timer);
    },
    loadNav: function() {
        var t = this;
        wx.request({
            url: "https://shizhencaiyuan.com/groupAdmin.php/Home/Goodscate/index",
            data: {
                data: JSON.stringify({
                    parent_id: 0
                })
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(a) {
                t.setData({
                    navData: a.data.data
                });
            }
        });
    },
    loadGroupList: function() {
        wx.showLoading && (wx.showLoading({
            title: "加载中...",
            mask: !0
        }), setTimeout(function() {
            wx.hideLoading();
        }, 1e3));
        var t = 0;
        arguments.length > 0 && (t = arguments[0].currentTarget.dataset.catid), clearInterval(this.timer);
        var a = this;
        wx.request({
            url: "https://shizhencaiyuan.com/groupAdmin.php/Home/Goods/group",
            data: {
                data: JSON.stringify({
                    cat_id: t,
                    is_low: this.type
                })
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                var o = e.data.data;
                console.log(o);
                var i = setInterval(function() {
                    for (var e = 0; e < o.length; e++) o[e].group_end_time = a.timeFormat(1e3 * o[e].group_off_time);
                    a.setData({
                        goodsData: o,
                        currentCatId: t
                    });
                }, 1e3);
                a.timer = i;
            }
        });
    },
    timeFormat: function(t) {
        var a = (t = t) - new Date().getTime();
        return !(a <= 0) && Math.floor(a / 36e5) + ":" + Math.floor(a / 6e4 % 60) + ":" + Math.floor(a / 1e3 % 60);
    },
    changeType: function(t) {
        "group" == t.currentTarget.dataset.type ? (this.setData({
            active: 0
        }), this.type = 2, this.loadGroupList()) : (this.setData({
            active: 1
        }), this.type = 1, this.loadGroupList());
    },
    offered: function(t) {
        var a = t.currentTarget.dataset.groupid;
        wx.navigateTo({
            url: "/pages/offered/offered?group_id=" + a
        });
    },
    onShareAppMessage: function() {
        return {
            title: "title",
            desc: "desc",
            path: "path"
        };
    }
});