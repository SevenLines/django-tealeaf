// create object of type FileUploadForm
// pass options dict with next fields:
// 'success' -- as ajax success function
// 'fail' -- as ajax fail function
// 'beforeSend' -- as ajax before send function
// 'editor' -- ckEditor instance (created like: CKEDITOR.inline("some_id"))
//
FileUploadForm = (function () {
    var scriptTag = document.getElementsByTagName('script');
    scriptTag = scriptTag[scriptTag.length - 1];
    var path = scriptTag.src;
    var this_script_folder = path.substr(0, path.lastIndexOf( '/' )+1 );
    var current_upload_form = null;

    function FileUploadForm(options) {
        this.success = options['success'];
        this.fail = options['fail'];
        this.beforeSend = options['beforeSend'];
        this.editor = options['editor'];

        var form = $("#file-upload-form")[0];
        var that = this;

        if (this.editor) {
            this.editor.addCommand("my_file_browser_upload_file", {
                exec: function () {
                    that.uploadFile(that);
                }
            });
            this.editor.ui.addButton('Upload', {
                label: "upload",
                command: 'my_file_browser_upload_file',
                icon: this_script_folder + "icon/file_upload.png"
            })
        }

        $(form).find(":file").on("change", function () {
            if (!current_upload_form)
                return;

            var editor = current_upload_form.editor;
            var success = current_upload_form.success;
            var fail = current_upload_form.fail;
            var beforeSend = current_upload_form.beforeSend;

            current_upload_form = null;

            var formData = new FormData(form);
            $.ajax({
                url: form.action,
                type: "POST",
                data: formData,
                beforeSend: beforeSend,
                success: function (data) {
                    if (success)
                        success();

                    if (editor) { // if ckeditor is binded to function
                        var element = null;
                        if (data['type'] === "image") {
                            element = editor.document.createElement("img");
                            element.setAttribute("src", data['url']);
                            element.setAttribute("alt", data['filename']);
                        } else {
                            element = editor.document.createElement("a");
                            element.setAttribute("href", data['url']);
                            element.setText(data['filename']);
                        }
                        if (element) {
                            return editor.insertElement(element);
                        }
                    }
                },
                fail: fail,
                contentType: false,
                processData: false
            });
        });
    }

    FileUploadForm.prototype.uploadFile = function (that) {
        var form = $("#file-upload-form");
        current_upload_form = that;
        form.find("[type=file]").click();
    };

    return FileUploadForm;
})();