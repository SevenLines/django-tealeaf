function MarksViewModel(data) {
    var self = this;

    self.init = function () {
        self.loadYears();
    };

    self.url = { // urls
        years: data.url.years,
        groups: data.url.groups,
        students: data.url.students
    };

    self.cookie = { // cookie names
        year: "year",
        group_id: "group_id",
        expires: 7 // days
    };

    // subscribes blocking control
    self._block = false;
    self.block = function () {
        self._block = true
    };
    self.unblock = function () {
        self._block = false
    };
    self.check_block = function (func) {
        if (!self._block)
            return func();
        return null;
    };
    // end subscribes blocking control

    self.years = ko.observableArray();
    self.year = ko.observable();

    self.groups = ko.observableArray();
    self.group = ko.observable();

    self.students = ko.observableArray();
    self.student = ko.observable();

    self.disciplines = ko.observableArray();
    self.discipline = ko.observable();

    self.year.subscribe(function () {
        self.check_block(function () {
            if (self.year()) {
                self.loadGroups();
            }
        });
    });

    self.group.subscribe(function () {
        self.check_block(function () {
            if (self.group()) {
                self.loadStudents();
            } else {
                self.students(null);
            }
        });
    });

    self.loadYears = function () {
        self.block();
        $.get(self.url.years, {}, self.years).success(function (data) {
            self.unblock();
            self.year($.cookie(self.cookie.year));
        })
    };

    self.loadGroups = function () {
        self.block();
        $.get(self.url.groups, { 'year': self.year() }, self.groups).success(function (data) {
            $.cookie(self.cookie.year, self.year(), { expires: self.cookie.expires });
            var group_id = $.cookie(self.cookie.group_id);

            self.unblock();
            if (self.groups().every(function (entry) {
                if (group_id == entry.id) {
                    self.group(entry);
                    return false;
                }
                return true;
            })) {
                self.group(null);
            }
        })
    };

    self.loadStudents = function () {
        $.get(self.url.students, { 'group_id': self.group().id }, self.students).success(function (data) {
            $.cookie(self.cookie.group_id, self.group().id, { expires: self.cookie.expires });
        });
    };

    self.init();
}


