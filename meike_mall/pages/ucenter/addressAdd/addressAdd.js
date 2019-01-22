var e = require("../../../utils/util.js"), t = require("../../../config/api.js"), i = getApp();

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
        var e = this;
        i.util.request({
            url: t.AddressDetail,
            data: {
                id: e.data.addressId
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data), t.data.errno || e.setData({
                    address: t.data.data.addressDetail
                });
            }
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
            t[0].id = e.province_id, t[0].name = e.province, t[0].parent_id = 1, t[1].id = e.city_id, 
            t[1].name = e.city, t[1].parent_id = e.province_id, t[2].id = e.district_id, t[2].name = e.district, 
            t[2].parent_id = e.city_id, this.setData({
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
        console.log(e);
        var s = this;
        i.util.request({
            url: t.Index,
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || s.setData({
                    sysinfo: e.data.data.sysinfo
                });
            }
        }), e.id && (this.setData({
            addressId: e.id
        }), this.getAddressDetail()), this.getRegionList(1);
    },
    getWxAddress: function() {
        wx.chooseAddress({
            success: function(e) {
                console.log(e.userName), console.log(e.postalCode), console.log(e.provinceName), 
                console.log(e.cityName), console.log(e.countyName), console.log(e.detailInfo), console.log(e.nationalCode), 
                console.log(e.telNumber);
            }
        });
    },
    selectRegionType: function(e) {
        console.log("selectRegionType:" + e.target.dataset.regionTypeIndex);
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
        e.province_id = t[0].id, e.city_id = t[1].id, e.district_id = t[2].id, e.province = t[0].name, 
        e.city = t[1].name, e.district = t[2].name, e.full_region = t.map(function(e) {
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
    getRegionList: function(e) {
        var s = this, a = s.data.regionType;
        i.util.request({
            url: t.RegionList,
            data: {
                parentId: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e.data), e.data.errno || s.setData({
                    regionList: e.data.data.regionList.map(function(e) {
                        return a == e.type && s.data.selectRegionList[a - 1].id == e.id ? e.selected = !0 : e.selected = !1, 
                        e;
                    })
                });
            }
        });
    },
    cancelAddress: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    saveAddress: function() {
        console.log(this.data.address);
        var s = this.data.address;
        if ("" == s.name) return e.showErrorToast("请输入姓名"), !1;
        if ("" == s.mobile) return e.showErrorToast("请输入手机号码"), !1;
        if (0 == s.district_id) return e.showErrorToast("请输入省市区"), !1;
        if ("" == s.address) return e.showErrorToast("请输入详细地址"), !1;
        var a = this, n = wx.getStorageSync("userInfo").user_id;
        i.util.request({
            url: t.AddressSave,
            data: {
                addressId: a.data.addressId,
                user_id: n,
                name: s.name,
                mobile: s.mobile,
                province_id: s.province_id,
                province: s.province,
                city_id: s.city_id,
                city: s.city,
                district_id: s.district_id,
                district: s.district,
                address: s.address,
                is_default: s.is_default
            },
            cachetime: 0,
            success: function(e) {
                console.log(e.data), wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});