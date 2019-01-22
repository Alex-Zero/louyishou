var e = function(e) {
    e = e || {}, this.beginTime = e.beginTime || "00:00:00", this.interval = e.interval || 0, 
    this.complete = e.complete, this.intervalFn = e.intervalFn, this.name = e.name, 
    this.intervarID, this.endTime, this.endSystemTime;
};

e.prototype = {
    start: function(e) {
        function t() {
            var t = new Date(i.endTime - 1e3 * n++), a = t.toString().substr(16, 8), r = (t.getTime() - new Date("1970/01/01 00:00:00").getTime()) / 1e3, s = e.data.wxTimerList;
            s[i.name] = {
                wxTimer: a,
                wxTimerSecond: r
            }, e.setData({
                wxTimer: a,
                wxTimerSecond: r,
                wxTimerList: s
            }), 0 == (n - 1) % i.interval && i.intervalFn && i.intervalFn(), r <= 0 && (i.complete && i.complete(), 
            i.stop());
        }
        this.endTime = new Date("1970/01/01 " + this.beginTime).getTime(), this.endSystemTime = new Date(Date.now() + this.endTime);
        var i = this, n = 0;
        t(), this.intervarID = setInterval(t, 1e3);
    },
    stop: function() {
        clearInterval(this.intervarID);
    },
    calibration: function() {
        this.endTime = this.endSystemTime - Date.now();
    }
}, module.exports = e;