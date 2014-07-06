// create object of type FileUploadForm
// pass options dict with next fields:
// 'success' -- as ajax success function
// 'fail' -- as ajax fail function
// 'beforeSend' -- as ajax before send function
// 'editor' -- ckEditor instance (created like: CKEDITOR.inline("some_id"))
//
FileUploadForm = (function () {
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
                    that.uploadFile();
                }
            });
            this.editor.ui.addButton('Upload', {
                label: "upload",
                command: 'my_file_browser_upload_file'
            })
        }

        $(form).find(":file").on("change", function () {
            var formData = new FormData(form);
            return $.ajax({
                url: form.action,
                type: "POST",
                data: formData,
                beforeSend: that.beforeSend,
                success: function (data) {
                    if (that.success)
                        that.success();

                    if (that.editor) { // if ckeditor is binded to function
                        console.log(data);
                        var element = null;
                        if (data['type'] === "image") {
                            element = that.editor.document.createElement("img");
                            element.setAttribute("src", data['url']);
                            element.setAttribute("alt", data['filename']);
                        } else {
                            element = that.editor.document.createElement("a");
                            element.setAttribute("href", data['url']);
                            element.setText(data['filename']);
                        }
                        if (element) {
                            return that.editor.insertElement(element);
                        }
                    }
                },
                fail: that.fail,
                contentType: false,
                processData: false
            });
        });
    }

    FileUploadForm.prototype.uploadFile = function () {
        var form = $("#file-upload-form");
        form.find("[type=file]").click();
    };

    return FileUploadForm;
})();