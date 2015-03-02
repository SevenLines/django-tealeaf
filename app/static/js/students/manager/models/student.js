app.factory('Student', ['_Base', function (_Base) {
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
    }

    helpers.extend(Student, _Base);

    Student.prototype.data = function () {
        var out = {};
        for (var key in this.init_data) {
            out[key] = this[key];
        }
        if (this._destroy) {
            out['_destroy'] = true;
        }
        return out;
    };
    Student.prototype.class = function () {
        if (this._destroy) {
            return "destroyed";
        }
        if (this.changed()) {
            return "changed";
        }
    };

    return Student;
}]);