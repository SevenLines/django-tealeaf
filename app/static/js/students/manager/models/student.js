
app.factory('Student', function () {
    function Student(data) {
        this.name = data.name;
        this.second_name = data.second_name;
        this.group = data.group;
        this.photo = data.photo;
        this.vk = data.vk;
        this.sex = data.sex;
        this.phone = data.phone;
        this.email = data.email;
        this.id = data.id;
        this.files = data.files;

        this.init_data = data;
        this._destroy = false;
    }

    Student.prototype = {
        changed: function () {
            if (this.id <= -1) {
                return true;
            }
            for (var key in this.init_data) {
                if (this.init_data[key] !== this[key]) {
                    return true;
                }
            }
            return this._destroy;
        },
        reset: function () {
            for (var key in this.init_data) {
                this.init_data[key] = this[key];
            }
        },
        data: function () {
            var out = {};
            for (var key in this.init_data) {
                out[key] = this[key];
            }
            if (this._destroy) {
                out['_destroy'] = true;
            }
            return out;
        },
        toggleDestroy: function () {
            this._destroy = !this._destroy;
        },
        class: function () {
            if (this._destroy) {
                return "destroyed";
            }
            if (this.changed()) {
                return "changed";
            }
        }
    };

    return Student;
});