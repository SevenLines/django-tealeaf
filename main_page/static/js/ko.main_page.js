/**
 * Created by m on 20.08.14.
 */

function MainPageItem(data) {
    var self = this;

    self.id = data.id;
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.item_url = ko.observable(data.item_url);
    self.active = ko.observable(data.active);
}


function MainPageModel(data) {
    var self = this;

    self.url = {
        items: data.url.items,                  // list of items
        item: data.url.item,                    // item with specific item_id
        activate_item: data.url.activate_item,  // activate currently selected item
        save_item: data.url.save_item,          // save item with specific item_id
        add_item: data.url.add_item,            // add new item
        remove_item: data.url.remove_item       // remove item with id
    };

    self.selector = {
        view: data.selector.view
    };

    self.modalSave = new ModalConfirm("#modalSave");
    self.new_item = new MainPageItem({
        id: -1,
        title: '',
        description: '',
        item_url: '',
        active: false
    });


    self.csrf = data.csrf;

    self.items = ko.observableArray();
    self.current_item = ko.observable();
    self.text = ko.observable("cool text");

    self.loadItems = function () {
        $.get(self.url.items, {}, function (data) {
            self.items($.map(data, function (item) {
                return new MainPageItem(item);
            }));

            for (var i = 0; i < self.items().length; ++i) {
                if (self.items()[i].active()) {
                    self.current_item(self.items()[i]);
                    break;
                }
            }
        })
    };

    self.activateItem = function (data) {
        self.current_item(data);

        $.post(self.url.activate_item, {
            item_id: data.id,
            csrfmiddlewaretoken: self.csrf
        }).success(function () {
            for (var i = 0; i < self.items().length; ++i) {
                self.items()[i].active(false);
            }
            self.current_item().active(true);
            self.update_view();
        })
    };

    self.update_view = function () {
        if (self.current_item === 'undefined')
            return;

        $.post(self.url.item, {
            item_id: self.current_item().id,
            csrfmiddlewaretoken: self.csrf
        }).success(function (data) {
            $(self.selector.view).html(data.html);
        });
    };

    self.selectItem = function (data) {
        self.current_item(data);
        self.update_view()
    };

    self.saveItem = function () {
        $.post(self.url.save_item, {
            item_id: self.current_item().id,
            description: self.current_item().description,
            title: self.current_item().title,
            item_url: self.current_item().item_url,
            csrfmiddlewaretoken: self.csrf
        }).success(function (data) {
            self.update_view();
        });
    };

    self.removeItem = function (data) {
        $.post(self.url.remove_item, {
            item_id: data.id,
            csrfmiddlewaretoken: self.csrf
        }).success(function() {
            self.loadItems();
            self.update_view();
        })
    };


    self.addItem = function (form) {
        var file_dialog = $(form).find("[name='file']").first();

        // unbind onchange event to avoid overbinding
        file_dialog.unbind("change");
        file_dialog.on("change", function () {
            // create preview of uploaded file
            var reader = new FileReader();
            reader.onload = function (e) {
                $("img#preview").attr('src', e.target.result)
            };
            reader.readAsDataURL(file_dialog[0].files[0]);

            // show modal form
            self.modalSave.message("Создать новый вид");
            self.modalSave.show(function () {
                var formData = new FormData(form);
                $.ajax({
                    url: self.url.add_item,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function () {
                        self.loadItems();
                    }
                });
            });
        });

        // open file selection dialog
        file_dialog.click();
    };


    self.loadItems();
}

