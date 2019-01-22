require("../../utils/util.js");

var t = require("../../config/api.js"), e = getApp();

Page({
    data: {
        sid: -10,
        autoplay: !1,
        vtype: "",
        videosrc: "",
        navList: [],
        videoList: [],
        userInfo: {},
        id: 0,
        currentCategory: {},
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        page: 1,
        size: 1e4
    },
    setTabBar: function(t) {
        var e = wx.getStorageSync("tabbar"), a = wx.getStorageSync("tabColor");
        this.setData({
            tabbar: e,
            curIdx: t,
            tabColor: a
        });
    },
    onLoad: function(t) {
        console.log(t);
        var e = this;
        e.setTabBar(t.curIdx);
        wx.getStorageSync("userInfo");
        wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    scrollHeight: t.windowHeight
                });
            }
        }), this.getCategoryInfo();
    },
    change: function(t) {
        var e = this;
        console.log(t);
        var a = t.currentTarget.dataset.id, i = t.currentTarget.dataset.vid, s = t.currentTarget.dataset.title, o = wx.createVideoContext("video_" + i);
        i == e.data.vid ? (e.setData({
            vid: -1
        }), o.pause()) : (e.setData({
            vid: i,
            title: s
        }), e.getVideoSrc(a));
    },
    pause: function() {
        this.setData({
            vid: -1
        });
    },
    play: function() {
        var t = this, e = t.data.vid;
        t.setData({
            vid: e
        });
    },
    getCategoryInfo: function() {
        var a = this;
        e.util.request({
            url: t.VideoCate,
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (a.setData({
                    navList: t.data.data.navList
                }), a.getVideoList());
            }
        });
    },
    getVideoList: function() {
        var a = this, i = a.data.sid;
        e.util.request({
            url: t.VideoList,
            data: {
                sid: i
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    videoList: t.data.data.videoList
                });
            }
        });
    },
    getVideoSrc: function(a) {
        var i = this, s = i.data.videoList[a].choose, o = i.data.videoList[a].id, r = wx.createVideoContext("video_" + o), d = i.data.videoList[a].video_url;
        0 == s || 2 == s ? i.setData({
            videosrc: d
        }) : e.util.request({
            url: t.GetVideoInfo,
            data: {
                videosrc: d
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), "" == t.data ? wx.showToast({
                    title: "视频解析失败",
                    icon: "loading",
                    duration: 2e3
                }) : i.setData({
                    videosrc: t.data,
                    autoplay: !0
                }), r.play();
            }
        });
    },
    switchCate: function(t) {
        if (this.data.sid == t.currentTarget.dataset.id) return !1;
        var e = this, a = t.detail.x, i = t.currentTarget;
        a < 60 ? e.setData({
            scrollLeft: i.offsetLeft - 60
        }) : a > 330 && e.setData({
            scrollLeft: i.offsetLeft
        }), this.setData({
            sid: t.currentTarget.dataset.id
        }), this.getCategoryInfo();
    }
});