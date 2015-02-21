define('article', ['jquery'], function($) {
   return function Editor(ckEditor, id_controller, data) {

        ckEditor.setKeystroke([[CKEDITOR.CTRL + CKEDITOR.ALT + 83, "saveme"]]);

        ckEditor.on("instanceReady", function (ev) {

            ev.editor.addCommand("saveme", {
                exec: function () {
                    $.post(data.url.save, {
                        plugin_id: data.id,
                        raw: ev.editor.getData(),
                        csrfmiddlewaretoken: data.csrf
                    }).done(function () {
                        InterfaceAlerts.showSuccess();
                    })
                }
            });

            ev.editor.addCommand("insert_article_file", {
                exec: function () {
                    var input = $("<input type=file>");
                    input.one("change", function () {
                        var formData = new FormData()
                        formData.append("file", input.files[0])
                        $.ajax({
                            url: data.url.upload,
                            type: "POST",
                            data: formData,
                            contentType: false,
                            processData: false
                        }).done(function (r) {
                            var element;
                            element = null;
                            if (r['type'] === "image") {
                                element = ev.editor.document.createElement("img");
                                element.setAttribute("src", r['url']);
                                element.setAttribute("alt", r['filename']);
                            } else {
                                element = ev.editor.document.createElement("a");
                                element.setAttribute("href", r['url']);
                                element.setText(r['filename']);
                            }
                            if (element) {
                                ev.editor.insertElement(element);
                            }
                            InterfaceAlerts.showSuccess();
                        }).fail(InterfaceAlerts.showFail)
                    });
                    input.click();
                }
            });
        });
    }
});