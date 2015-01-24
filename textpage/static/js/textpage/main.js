function TextPageModel(urls, id) {

    var editor = CKEDITOR.inline("page-content", {
        enterMode: CKEDITOR.ENTER_BR,
        extraPlugins: 'insertpre,div,image,sourcedialog,bootstrap-collapse,bootstrap-message,showblocks,justify,' +
        'divarea,colordialog,colorbutton,liststyle,eqneditor',
        //removePlugins: 'image',
        toolbarGroups: [
            {name: 'clipboard', groups: ['clipboard', 'undo']},
            {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
            {name: 'links'},
            {name: 'insert'},
            {name: 'forms'},
            {name: 'tools'},
            {name: 'document', groups: ['mode', 'document', 'doctools']},
            {name: 'others'},
            '/',
            {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
            {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
            {name: 'styles'},
            {name: 'colors'},
            {name: 'about'}
        ],
        extraAllowedContent: ['img[data-id]', 'a[data-id]']
    });

    var images_to_delete = [];
    var files_to_delete = [];
    editor.addCommand("save", { // create named command
        exec: function (edt) {

            // save text
            function save_text() {
                $.post(urls.save_url, {
                    text: edt.getData(),
                    csrfmiddlewaretoken: $.cookie('csrftoken'),
                    id: id
                }).done(function () {
                    InterfaceAlerts.showSuccess();
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            }

            var inputs = $("#images-form input[type=file]");
            var inputs_file = $("#files-form input[type=file]");
            var ajaxesLeft = inputs.length + inputs_file.length + images_to_delete.length + files_to_delete.length;
            // first save images and rewrite it src attributes
            inputs.each(function () {
                var that = this;
                setTimeout(function () {
                    var num = $(that).data("num");

                    if ($("#image" + num).length > 0) {
                        var formData = new FormData();
                        formData.append("image", that.files[0]);
                        formData.append("csrfmiddlewaretoken", $.cookie('csrftoken'));
                        $.ajax({
                            url: urls.upload_image,
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false
                        }).done(function (r) {
                            var img = $("#image" + num);
                            $(that).remove();
                            img.attr("src", r.url);
                            img.removeAttr("id");
                            img.attr("data-id", r.id);
                        }).always(function () {
                            ajaxesLeft--;
                            if (ajaxesLeft == 0) {
                                save_text();
                            }
                        })
                    }
                }, 0);
            });

            inputs_file.each(function () {
                var that = this;
                setTimeout(function () {
                    var num = $(that).data("num");

                    if ($("#a_file" + num).length > 0) {
                        var formData = new FormData();
                        formData.append("file", that.files[0]);
                        formData.append("csrfmiddlewaretoken", $.cookie('csrftoken'));
                        $.ajax({
                            url: urls.upload_file,
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false
                        }).done(function (r) {
                            var a = $("#a_file" + num);
                            $(that).remove();
                            a.attr("href", r.url);
                            a.removeAttr("id");
                            console.log(r);
                            a.attr("data-id", r.id);
                        }).always(function () {
                            ajaxesLeft--;
                            if (ajaxesLeft == 0) {
                                save_text();
                            }
                        })
                    }
                }, 0);
            });

            // remove existing images
            var i;
            for (i = 0; i < images_to_delete.length; ++i) {
                var im = $("img[data-id=" + images_to_delete[i] + "]");
                if (!im.length) {
                    $.get(urls.remove_image, {
                        id: images_to_delete[i]
                    }).always(function () {
                        --ajaxesLeft;
                        if (ajaxesLeft == 0) {
                            save_text();
                        }
                    });
                } else {
                    --ajaxesLeft;
                    if (ajaxesLeft == 0) {
                        save_text();
                    }
                }
            }

            for (i = 0; i < files_to_delete.length; ++i) {
                var fl = $("a[data-id=" + files_to_delete[i] + "]");
                if (!fl.length) {
                    $.get(urls.remove_file, {
                        id: files_to_delete[i]
                    }).always(function () {
                        --ajaxesLeft;
                        if (ajaxesLeft == 0) {
                            save_text();
                        }
                    });
                } else {
                    --ajaxesLeft;
                    if (ajaxesLeft == 0) {
                        save_text();
                    }
                }
            }

            if (ajaxesLeft == 0) {
                save_text();
            }

        }
    });

    editor.on("instanceReady", function () {
        $(".textpage-content").bind("DOMNodeRemoved", function (e) {
            var id;
            if (e.target.tagName == "IMG") {
                id = $(e.target).data("id");
                if (id) {
                    images_to_delete.push(id);
                }
            }
            if (e.target.tagName == "A") {
                id = $(e.target).data("id");
                if (id) {
                    files_to_delete.push(id);
                }
            }
        });
    });

    var images_count = 0;
    editor.addCommand("add_image", { // create named command
        exec: function (edt) {
            var input = $('<input type="file" style="display: none;" accept="image/*">');
            input.on("change", function () {
                var num = ++images_count;
                var el = edt.document.createElement("img");
                $(el.$).attr("id", "image" + num);
                $(el.$).data("num", num);
                input.attr("id", "input" + num);
                input.data("num", num);

                input2base64(input[0], el.$);
                edt.insertElement(el);

                $("#images-form").append(input);
            });
            input.click();
        }
    });


    var files_count = 0;
    editor.addCommand("add_file", { // create named command
        exec: function (edt) {
            var input = $('<input type="file" style="display: none;">');
            input.on("change", function () {
                var num = ++files_count;
                var el = edt.document.createElement("a");
                $(el.$).attr("id", "a_file" + num);
                $(el.$).data("num", num);
                input.attr("id", "input_file" + num);
                input.data("num", num);

                //input2base64(input[0], el.$);
                el.$.href = input[0].files[0].name;
                $(el.$).html(input[0].files[0].name);
                edt.insertElement(el);

                $("#files-form").append(input);
            });
            input.click();
        }
    });

    editor.ui.addButton('SaveButton', { // add new button and bind our command
        label: "Save",
        command: 'save',
        toolbar: 'clipboard',
        icon: '/static/bower_components/ckeditor/plugins/save/icons/save.png'
    });

    editor.ui.addButton('AddImageButton', { // add new button and bind our command
        label: "Image",
        command: 'add_image',
        toolbar: 'insert',
        icon: '/static/images/textpage/icon_picture.png'
    });

    editor.ui.addButton('AddFileButton', { // add new button and bind our command
        label: "File",
        command: 'add_file',
        toolbar: 'insert',
        icon: '/static/images/textpage/file_upload.png'
    });


}