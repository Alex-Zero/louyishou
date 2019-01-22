getApp();

Page({
    data: {
        username: "",
        code: ""
    },
    onLoad: function(e) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    startLogin: function() {},
    bindUsernameInput: function(e) {
        this.setData({
            username: e.detail.value
        });
    },
    bindCodeInput: function(e) {
        this.setData({
            code: e.detail.value
        });
    },
    clearInput: function(e) {
        switch (e.currentTarget.id) {
          case "clear-username":
            this.setData({
                username: ""
            });
            break;

          case "clear-code":
            this.setData({
                code: ""
            });
        }
    }
});