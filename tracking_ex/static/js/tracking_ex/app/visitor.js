/**
 * Created by m on 22.02.15.
 */
define(['app/helpers'], function (helpers) {
    return function (data) {
        var self = this;
        self.ip_address = data.ip_address;
        self.start_time = helpers.toLocString(data.start_time);
        self.end_time = helpers.toLocString(data.end_time);
        self.user_agent = data.user_agent;
        self.last_of_day = data.last_of_day;
        self.visits = data.visits;

        self.style = self.last_of_day ? "last_of_day" : "";
    }
});

