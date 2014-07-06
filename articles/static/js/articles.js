// Generated by CoffeeScript 1.7.1
(function() {
  var Editor;

  Editor = (function() {
    function Editor(ckEditor, id_controller) {
      ckEditor.setKeystroke([[CKEDITOR.CTRL + CKEDITOR.ALT + 83, "saveme"]]);
      ckEditor.on("instanceReady", function(ev) {
        ev.editor.addCommand("saveme", {
          exec: function() {
            var data, form, html, query;
            form = $(id_controller).find("form.save")[0];
            if (form === null) {
              return false;
            }
            html = ev.editor.getData();
            data = $(form).serializeArray();
            data.push({
              'name': 'raw',
              'value': html
            });
            query = $.post(form.action, data);
            return query.success(function() {
              return location.reload();
            });
          }
        });
        return ev.editor.addCommand("insert_article_file", {
          exec: function() {
            var file_input, form;
            form = $("" + id_controller + " form.upload-file");
            if (form.size() === 0) {
              console.error("form '" + id_contoller + " form.upload-file' not found");
              return;
            }
            form = form[0];
            file_input = $(form).find(":file")[0];
            $(file_input).on("change", function() {
              var formData;
              formData = new FormData(form);
              return $.ajax({
                url: form.action,
                type: "POST",
                data: formData,
                beforeSend: function() {
                  return $(file_input).unbind("change");
                },
                success: function(data) {
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

}).call(this);