var Editor;

Editor = (function () {
    function Editor(ckEditor, id_controller, data) {

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
                    var file_input, form;
                    form = $("" + id_controller + " form.upload-file");
                    if (form.size() === 0) {
                        console.error("form '" + id_contoller + " form.upload-file' not found");
                        return;
                    }
                    form = form[0];
                    file_input = $(form).find(":file")[0];
                    $(file_input).on("change", function () {
                        var formData;
                        formData = new FormData(form);
                        return $.ajax({
                            url: form.action,
                            type: "POST",
                            data: formData,
                            beforeSend: function () {
                                return $(file_input).unbind("change");
                            },
                            success: function (data) {
                                var element;
                                console.log(data);
                                element = null;
                                if (data['type'] === "image") {
                                    element = ev.editor.document.createElement("img");
                                    element.setAttribute("src", data['url']);
                                    element.setAttribute("alt", data['filename']);
                                } else {
                                    element = ev.editor.document.createElement("a");
                                    element.setAttribute("href", data['url']);
                                    element.setText(data['filename']);
                                }
                                if (element) {
                                    return ev.editor.insertElement(element);
                                }
                            },
                            contentType: false,
                            processData: false
                        });
                    });
                    return file_input.click();
                }
            });
        });
    }

    return Editor;

})();

window.Editor = Editor;
