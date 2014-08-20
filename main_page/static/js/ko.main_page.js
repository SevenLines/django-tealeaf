/**
 * Created by m on 20.08.14.
 */

function MainPageItem(data) {
    var self = this;

    self.id = data.id;
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.item_url = ko.observable(data.item_url);
}


function MainPageModel(data) {
    var self = this;

    self.load_items_url = data.load_items_url;
    self.image_container_selector = data.image_container_selector;
    self.csrf = data.csrf;

    self.items = ko.observableArray();
    self.current_item = ko.observable();
    self.text = ko.observable("cool text");

    self.loadItems = function () {
        $.get(self.load_items_url, {}, function (data) {
            self.items($.map(data, function (item) {
                return new MainPageItem(item);
            }));
        })
    };

    self.selectItem = function (data, url) {
        self.current_item(data);
        $.post(url, {
            item_id: data.id,
            csrfmiddlewaretoken: self.csrf
        }, function(data) {
            $(self.image_container_selector).html(data)
        });
    };

    self.loadItems();
}

