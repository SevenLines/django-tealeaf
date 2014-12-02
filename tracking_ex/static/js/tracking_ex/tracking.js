(function () {
    function toLocString(isodate) {
        if (!isodate)
            return "-";
        var d = new Date(isodate);
        return d.toLocaleString("en-GB");
    }

    function Visitor(data) {
        var self = this;
        self.ip_address = data.ip_address;
        self.start_time = toLocString(data.start_time);
        self.end_time = toLocString(data.end_time);
        self.user_agent = data.user_agent;
        self.last_of_day = data.last_of_day;
        self.visits = data.visits;

        self.style = self.last_of_day ? "last_of_day" : "";
    }

    window.AppTracking = function (data) {
        var self = this;
        var url = {
            visitors: data.url.visitors
        };

        var page = 1;
        self.no_more_visitors = ko.observable(false);
        self.visitors = ko.observableArray();
        self.visitors_loading = ko.observable(false);

        function resetInterface() {
            $("#visitors .visitor .agent").tooltip();
        }

        function fetchVisitors() {
            self.visitors_loading(true);
            $.get(url.visitors, {
                page: page
            }).done(function (response) {
                var lastD = null;
                var i = 0;
                function add_item() {
                    if (i < response.visitors.length) {
                        var item = response.visitors[i];
                        var curD = toLocString(item.start_time).substring(0, 10);
                        if (lastD && curD != lastD) {
                            item.last_of_day = true;
                            console.log(lastD + " " + curD);
                        }
                        lastD = curD;
                        ++i;
                        self.visitors.push(new Visitor(item));
                        setTimeout(add_item, 0);
                    } else {
                        self.no_more_visitors(response.no_more);
                        page++;
                        resetInterface();
                    }
                }
                add_item();
            }).always(function () {
                self.visitors_loading(false);
            });
        }


        function init() {
            fetchVisitors();
        }

        self.resetList = function () {
            page = 1;
            self.visitors.removeAll();
            self.no_more_visitors(false);
            self.fetchMore();
        };

        self.fetchMore = function () {
            if (self.no_more_visitors())
                return;
            fetchVisitors();
        };

        init();
    };
})();