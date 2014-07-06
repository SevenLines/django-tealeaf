class Editor
    constructor: (ckEditor, id_controller) ->
        ckEditor.setKeystroke [
            [CKEDITOR.CTRL + CKEDITOR.ALT + 83, "saveme"] # Ctrl+Alt+S
        ]

        ckEditor.on("instanceReady", (ev) ->
            # кнопка сохранить
            ev.editor.addCommand("saveme",
                exec: () ->
                    form = $(id_controller).find("form.save")[0]

                    if form == null
                        return false

                    html = ev.editor.getData();
                    data = $(form).serializeArray();
                    data.push
                        'name': 'raw'
                        'value': html

                    query = $.post(form.action, data)
                    query.success(() ->
                        location.reload()
                    )
            )
            ev.editor.addCommand("insert_article_file",
                # кнопка загрузить файл
                exec: () ->
                    form = $("#{id_controller} form.upload-file")

                    if form.size() == 0
                        console.error("form '#{id_contoller} form.upload-file' not found")
                        return

                    form = form[0]

                    file_input = $(form).find(":file")[0]
                    $(file_input).on("change", ->
                        formData = new FormData(form);
                        $.ajax(
                            url: form.action
                            type: "POST"
                            data: formData
                            beforeSend: ->
                                $(file_input).unbind("change")
                            success: (data) ->
                                console.log(data);
                                element = null;

                                if data['type'] == "image"
                                    element = ev.editor.document.createElement("img");
                                    element.setAttribute("src", data['url']);
                                    element.setAttribute("alt", data['filename']);
                                else
                                    element = ev.editor.document.createElement("a");
                                    element.setAttribute("href", data['url']);
                                    element.setText(data['filename']);

                                if element
                                    ev.editor.insertElement(element)
                            contentType: false
                            processData: false
                        )
                    )
                    file_input.click();
            )
        )

window.Editor = Editor