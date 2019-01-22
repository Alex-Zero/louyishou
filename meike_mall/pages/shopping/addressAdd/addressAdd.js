var e = require("../../../utils/util.js"), t = require("../../../config/api.js");

getApp();

Page({
    data: {
        address: {
            id: 0,
            province_id: 0,
            city_id: 0,
            district_id: 0,
            address: "",
            full_region: "",
            name: "",
            mobile: "",
            is_default: 0
        },
        addressId: 0,
        openSelectRegion: !1,
        selectRegionList: [ {
            id: 0,
            name: "省份",
            parent_id: 1,
            type: 1
        }, {
            id: 0,
            name: "城市",
            parent_id: 1,
            type: 2
        }, {
            id: 0,
            name: "区县",
            parent_id: 1,
            type: 3
        } ],
        regionType: 1,
        regionList: [],
        selectRegionDone: !1
    },
    bindinputMobile: function(e) {
        var t = this.data.address;
        t.mobile = e.detail.value, this.setData({
            address: t
        });
    },
    bindinputName: function(e) {
        var t = this.data.address;
        t.name = e.detail.value, this.setData({
            address: t
        });
    },
    bindinputAddress: function(e) {
        var t = this.data.address;
        t.address = e.detail.value, this.setData({
            address: t
        });
    },
    bindIsDefault: function() {
        var e = this.data.address;
        e.is_default = !e.is_default, this.setData({
            address: e
        });
    },
    getAddressDetail: function() {
        var i = this;
        e.request(t.AddressDetail, {
            id: i.data.addressId
        }).then(function(e) {
            0 === e.errno && i.setData({
                address: e.data
            });
        });
    },
    setRegionDoneStatus: function() {
        var e = this, t = e.data.selectRegionList.every(function(e) {
            return 0 != e.id;
        });
        e.setData({
            selectRegionDone: t
        });
    },
    chooseRegion: function() {
        this.setData({
            openSelectRegion: !this.data.openSelectRegion
        });
        var e = this.data.address;
        if (e.province_id > 0 && e.city_id > 0 && e.district_id > 0) {
            var t = this.data.selectRegionList;
            t[0].id = e.province_id, t[0].name = e.province_name, t[0].parent_id = 1, t[1].id = e.city_id, 
            t[1].name = e.city_name, t[1].parent_id = e.province_id, t[2].id = e.district_id, 
            t[2].name = e.district_name, t[2].parent_id = e.city_id, this.setData({
                selectRegionList: t,
                regionType: 3
            }), this.getRegionList(e.city_id);
        } else this.setData({
            selectRegionList: [ {
                id: 0,
                name: "省份",
                parent_id: 1,
                type: 1
            }, {
                id: 0,
                name: "城市",
                parent_id: 1,
                type: 2
            }, {
                id: 0,
                name: "区县",
                parent_id: 1,
                type: 3
            } ],
            regionType: 1
        }), this.getRegionList(1);
        this.setRegionDoneStatus();
    },
    onLoad: function(e) {
        console.log(e), e.id && (this.setData({
            addressId: e.id
        }), this.getAddressDetail()), this.getRegionList(1);
    },
    onReady: function() {},
    selectRegionType: function(e) {
        var t = this, i = e.target.dataset.regionTypeIndex, s = t.data.selectRegionList;
        if (i + 1 == this.data.regionType || i - 1 >= 0 && s[i - 1].id <= 0) return !1;
        this.setData({
            regionType: i + 1
        });
        var a = s[i];
        this.getRegionList(a.parent_id), this.setRegionDoneStatus();
    },
    selectRegion: function(e) {
        var t = this, i = e.target.dataset.regionIndex, s = this.data.regionList[i], a = s.type, n = this.data.selectRegionList;
        n[a - 1] = s, 3 != a ? (this.setData({
            selectRegionList: n,
            regionType: a + 1
        }), this.getRegionList(s.id)) : this.setData({
            selectRegionList: n
        }), n.map(function(e, t) {
            return t > a - 1 && (e.id = 0, e.name = 1 == t ? "城市" : "区县", e.parent_id = 0), 
            e;
        }), this.setData({
            selectRegionList: n
        }), t.setData({
            regionList: t.data.regionList.map(function(e) {
                return t.data.regionType == e.type && t.data.selectRegionList[t.data.regionType - 1].id == e.id ? e.selected = !0 : e.selected = !1, 
                e;
            })
        }), this.setRegionDoneStatus();
    },
    doneSelectRegion: function() {
        if (!1 === this.data.selectRegionDone) return !1;
        var e = this.data.address, t = this.data.selectRegionList;
        e.province_id = t[0].id, e.city_id = t[1].id, e.district_id = t[2].id, e.province_name = t[0].name, 
        e.city_name = t[1].name, e.district_name = t[2].name, e.full_region = t.map(function(e) {
            return e.name;
        }).join(""), this.setData({
            address: e,
            openSelectRegion: !1
        });
    },
    cancelSelectRegion: function() {
        this.setData({
            openSelectRegion: !1,
            regionType: this.data.regionDoneStatus ? 3 : 1
        });
    },
    getRegionList: function(i) {
        var s = this, a = s.data.regionType;
        e.request(t.RegionList, {
            parentId: i
        }).then(function(e) {
            0 === e.errno && s.setData({
                regionList: e.data.map(function(e) {
                    return a == e.type && s.data.selectRegionList[a - 1].id == e.id ? e.selected = !0 : e.selected = !1, 
                    e;
                })
            });
        });
    },
    cancelAddress: function() {
        wx.reLaunch({
            url: "/pages/shopping/address/address"
        });
    },
    saveAddress: function() {
        console.log(this.data.address);
        var i = this.data.address;
        if ("" == i.name) return e.showErrorToast("请输入姓名"), !1;
        if ("" == i.mobile) return e.showErrorToast("请输入手机号码"), !1;
        if (0 == i.district_id) return e.showErrorToast("请输入省市区"), !1;
        if ("" == i.address) return e.showErrorToast("请输入详细地址"), !1;
        e.request(t.AddressSave, {
            id: i.id,
            name: i.name,
            mobile: i.mobile,
            province_id: i.province_id,
            city_id: i.city_id,
            district_id: i.district_id,
            address: i.address,
            is_default: i.is_default
        }, "POST").then(function(e) {
            0 === e.errno && wx.reLaunch({
                url: "/pages/shopping/address/address"
            });
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});