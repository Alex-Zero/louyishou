require("../../../utils/util.js");

var o = require("../../../config/api.js"), a = [], e = getApp();

Page({
    data: {
        array: [],
        imgArray: [],
        index: 0
    },
    bindPickerChange: function(o) {
        console.log("picker发送选择改变，携带值为", o.detail.value), this.setData({
            index: o.detail.value
        });
    },
    store: function(o) {
        var a = this, e = o.detail.value;
        a.setData({
            store: e
        });
    },
    removeStore: function(o) {
        this.setData({
            store: ""
        });
    },
    owner: function(o) {
        var a = this, e = o.detail.value;
        a.setData({
            owner: e
        });
    },
    removeOwner: function(o) {
        this.setData({
            owner: ""
        });
    },
    location: function() {
        var o = this;
        wx.chooseLocation({
            success: function(a) {
                o.setData({
                    location: a
                });
            }
        });
    },
    imgArray: function(o) {
        var t = this, i = 5 - a.length;
        console.log(i), i > 0 && i <= 5 ? wx.chooseImage({
            count: i,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(o) {
                wx.showToast({
                    icon: "loading",
                    title: "正在上传"
                });
                var a = o.tempFilePaths, i = e.siteInfo.uniacid;
                t.uploadimg({
                    url: t.data.url + "/app/index.php?i=" + i + "&c=entry&a=wxapp&do=Upload&m=maker_mail",
                    path: a
                });
            }
        }) : wx.showModal({
            title: "上传提示",
            content: "最多上传5张图片",
            showCancel: !0,
            cancelText: "取消",
            cancelColor: "",
            confirmText: "确定",
            confirmColor: "",
            success: function(o) {},
            fail: function(o) {},
            complete: function(o) {}
        });
    },
    uploadimg: function(o) {
        var e = this, t = o.i ? o.i : 0, i = o.success ? o.success : 0, n = o.fail ? o.fail : 0;
        wx.uploadFile({
            url: o.url,
            filePath: o.path[t],
            name: "upfile",
            formData: null,
            success: function(o) {
                "" != o.data ? (console.log(o), i++, a.push(o.data), e.setData({
                    imgArray: a
                }), console.log("入驻审核提交的图片数组", a)) : wx.showToast({
                    icon: "loading",
                    title: "请重试"
                });
            },
            fail: function(o) {
                n++, console.log("fail:" + t + "fail:" + n);
            },
            complete: function() {
                console.log(t), ++t == o.path.length ? (e.setData({
                    images: o.path
                }), wx.hideToast(), console.log("执行完毕"), console.log("成功：" + i + " 失败：" + n)) : (console.log(t), 
                o.i = t, o.success = i, o.fail = n, e.uploadimg(o));
            }
        });
    },
    formSubmit: function(a) {
        var t = this, i = wx.getStorageSync("userInfo").openid, n = t.data.index, s = t.data.array[n], l = a.detail.formId, r = a.detail.value.store, c = a.detail.value.address, u = a.detail.value.owner, d = a.detail.value.phoneNumber, f = t.data.location;
        if (void 0 != f) var h = f.longitude, g = f.latitude;
        console.log(t.data.imgArray);
        var m = t.data.imgArray, p = m.toString();
        return "" == r ? (e.showErrorModal("请输入店铺名称", "提醒"), !1) : "" == c ? (e.showErrorModal("请选择店铺地址", "提醒"), 
        !1) : "" == u ? (e.showErrorModal("请输入法人姓名", "提醒"), !1) : "" == d ? (e.showErrorModal("请输入手机号", "提醒"), 
        !1) : "" == m ? (e.showErrorModal("请添加店铺图片和营业执照", "提醒"), !1) : void e.util.request({
            url: o.Admission,
            data: {
                openid: i,
                storeType: s,
                storeName: r,
                address: c,
                lng: h,
                lat: g,
                owner: u,
                mobile: d,
                imgArray: p,
                form_id: l
            },
            cachetime: 0,
            success: function(o) {
                console.log(o);
            }
        });
    },
    onLoad: function(a) {
        var t = this, i = wx.getStorageSync("userInfo").phoneNumber, n = e.siteInfo.siteroot, s = e.siteInfo.uniacid;
        n = n.split("/app")[0], t.setData({
            url: n,
            uniacid: s,
            phoneNumber: i
        }), e.util.request({
            url: o.StoreType,
            cachetime: 0,
            success: function(o) {
                console.log(o), t.setData({
                    array: o.data.data[0]
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});