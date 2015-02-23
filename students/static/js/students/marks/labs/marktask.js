/**
 * Created by m on 19.02.15.
 */
define(['knockout', 'urls'], function (ko, urls) {
    return function(data_inst) {
        var self = this;
        var data = data_inst;

        data.done = (data.done === undefined ? false : data.done);

        self.id = data.id === undefined ? -1 : data.id;
        self.student = data.student;
        self.task = data.task;
        self.group = data.group;
        self.done = ko.observable(data.done);

        self.lab_inst = ko.observable(data.lab_inst);
        self.task_inst = ko.observable(data.task_inst);

        self.changed = ko.pureComputed(function (){
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

        self.css = ko.pureComputed(function () {
            var result = [
                self.done() ? 'done' : '',
            ].join(" ");
            return result;
        });

        self.reset = function () {
            data.done = self.done();
        };

        self.toggle = function () {
            self.done(!self.done());
        }
    }

});
