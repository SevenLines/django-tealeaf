(function () {
    var template = function (id) {
        return _.template($("#" + id).html());
    };

    var Session = Backbone.Model.extend({
        defaults: {
            ip_address: '172.24.1.36',
            user_agent: 'Firefox',
            start_time: '0',
            end_time: '10'
        }
    });

    var SessionList = Backbone.Collection.extend({
        model: Session
    });

    var SessionListView = Backbone.View.extend({
        tagName: "tbody",
        render: function () {
            this.collection.each(function (session) {
                var sessionView = new SessionView({model: session});
                this.$el.append(sessionView.render().el);
            }, this);
            return this;
        }
    });

    var SessionView = Backbone.View.extend({
        tagName: 'tr',
        template: template("templateSession"),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    window.App = function (urls) {
        var self = this;

        var sessionCollection = new SessionList([
            {
                ip_address: '172.24.1.35'
            },
            {
                ip_address: '172.24.1.36'
            },
            {
                ip_address: '172.24.1.37'
            }
        ]);

        var sessionListView = new SessionListView({collection: sessionCollection});
        $("table#visitors>thead").after(sessionListView.render().el);
    }
})();


