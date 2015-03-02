/**
 * Created by m on 02.03.15.
 */
app.factory("_Base", function () {
    function _Base(data) {
        this.init_data = data;
        this._destroy = false;
    }
    _Base.prototype = {
        changed: function () {
            if (this.id <= -1) {
                return true;
            }
            for(var key in this.init_data) {
                if(this.init_data[key] != this[key]) {
                    return true;
                }
            }
            return this._destroy;
        },
        reset: function () {
            for(var key in this.init_data) {
                this.init_data[key] = this[key];
            }
        },
        toggleDestroy: function () {
            this._destroy = !this._destroy;
        }
    };
    return _Base;
});