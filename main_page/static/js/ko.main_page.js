/**
 * Created by m on 20.08.14.
 */

function MainPageItem(data) {
    var self = this;

    self.id = data.id;
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.item_url = ko.observable(data.item_url);
    self.item_thumb_url = ko.observable(data.item_thumb_url);
    self.active = ko.observable(data.active);
}


function MainPageModel(data) {
    var self = this;

    self.reset_item = function () {
        return new MainPageItem({
            id: -1,
            title: '',
            description: '',
            item_url: '',
            item_thumb_url: '',
            active: false
        });
    };

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
    self.new_item = ko.observable(self.reset_item());


    self.csrf = data.csrf;

    self.items = ko.observableArray();
    self.current_item = ko.observable(self.reset_item());

    self.blink = function (color, delay) {
        var bg = $('body');
        var bg_css = bg.css("background");
        bg.css("background-color", color);
        setTimeout(function () {
            $("body").css("background", bg_css);
        }, delay);
    };

    self.showSuccess = function () {
        self.blink("#AAFF88", 1000);
    };
    self.showFail = function () {
        self.blink("red", 1000);
    };

    // binding ckeditor with description content
    ko.bindingHandlers.ckeditor = {
        init: function (element) {
            var editor = $(element).ckeditor().editor;
            editor.on('change', function (data) {
                self.current_item().description(editor.getData());
            });

            // create save button
            editor.addCommand("SaveCommand", {
                exec: function () {
                    self.saveItem();
                }
            });
            editor.ui.addButton("Save", {
                command: "SaveCommand",
                label: "Save",
                icon: element.dataset.icon,
                toolbar: "editing"
            });
            // <<<
        },
        update: function (element) {
            var value = self.current_item().description;
//            console.log(value());
            if ($(element).val() !== value()) {
                $(element).val(value());
            }
        }
    };
    // <<<

    self.loadItems = function (select_newest_item) {
        $.get(self.url.items, {}, function (data) {
            self.current_item(self.reset_item());
            self.items($.map(data, function (item) {
                return new MainPageItem(item);
            }));

            for (var i = 0; i < self.items().length; ++i) {
                if (select_newest_item) {
                    self.current_item(self.items()[i]);
                    break;
                }
                if (self.items()[i].active()) {
                    self.current_item(self.items()[i]);
                    break;
                }
            }
            self.update_view();
        })
    };

    self.activateItem = function (data) {
        self.current_item(data);

        $.post(self.url.activate_item, {
            item_id: data.id,
            csrfmiddlewaretoken: self.csrf
        }).success(function () {
            self.update_view();
            self.loadItems();
        })
    };

    self.update_view = function () {
        if (self.current_item === 'undefined')
            return;
//        console.log("update_view");
        $.post(self.url.item, {
            item_id: self.current_item().id,
            csrfmiddlewaretoken: self.csrf
        }).success(function (data) {
            $(self.selector.view).html(data.html);
        }).fail(function (data) {
            $(self.selector.view).html("");
        });
    };

    self.selectItem = function (data) {
        self.current_item(data);
        self.update_view()
    };

    self.saveItem = function () {
        $.post(self.url.save_item, {
            item_id: self.current_item().id,
            description: self.current_item().description(),
            title: self.current_item().title(),
            item_url: self.current_item().item_url,
            csrfmiddlewaretoken: self.csrf
        }).success(function () {
            self.showSuccess();
            self.update_view();
        }).fail(function () {
            self.showFail();
        });
    };

    self.removeItem = function (data) {
        $.post(self.url.remove_item, {
            item_id: data.id,
            csrfmiddlewaretoken: self.csrf
        }).success(function () {
            self.showSuccess();
            self.items.remove(data);
        }).fail(function () {
            self.showFail();
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
                        self.loadItems(true);
                    }
                });
            });
        });

        // open file selection dialog
        file_dialog.click();
    };


    self.loadItems();
}

