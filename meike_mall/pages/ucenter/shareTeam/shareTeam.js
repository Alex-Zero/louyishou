require("../../../utils/util.js");

var t = require("../../../config/api.js"), s = getApp();

Page({
    data: {
        typeId: 0,
        showType: 0,
        fristPage: 1,
        secondPage: 1,
        size: 200,
        teamList: [],
        status: 1,
        first_count: 0,
        second_count: 0
    },
    onLoad: function(e) {
        var a = this, i = wx.getStorageSync("userInfo").user_id;
        s.util.request({
            url: t.FansList,
            data: {
                user_id: i
            },
            success: function(t) {
                console.log(t), a.setData({
                    first_count: t.data.data.fansCount.nums,
                    second_count: t.data.data.secondfansCount.length
                });
            }
        }), this.getTeamList();
    },
    getTeamList: function() {
        var e = this, a = wx.getStorageSync("userInfo").user_id;
        s.util.request({
            url: t.TeamList,
            data: {
                user_id: a,
                showType: e.data.showType
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (e.data.showType, e.setData({
                    teamList: t.data.data.teamList
                }));
            }
        });
    },
    switchTab: function() {
        this.setData({
            showType: 1 == this.data.showType ? 0 : 1
        }), this.getTeamList();
    }
});