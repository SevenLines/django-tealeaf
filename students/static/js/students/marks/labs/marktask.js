/**
 * Created by m on 19.02.15.
 */
define(['knockout', 'urls'], function (ko, urls) {
    return function(data) {
        var self = this;
        self.id = data.id === undefined ? -1 : data.id;
        self.student = data.student;
        self.task = data.task;
        self.done = ko.observable(data.done === undefined ? false : data.done);

        self.changed = ko.computed(function (){
            return data.done != self.done();
        });

        self.post_data = function () {
            return {
                id: self.id,
                student: self.student,
                task: self.task,
                done: self.done()
            }
        };

        self.reset = function () {
            data.done = self.done();
        };

        self.toggle = function () {
            self.done(!self.done());
        }
    }

});
