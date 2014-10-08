CKEDITOR.dialog.add("collapseDialog", function (editor) {
    return {
        title: 'Bootstrap collapse',
        minWidth: 400,
        minHeight: 200,

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'title',
                        label: 'Title',
                        validate: CKEDITOR.dialog.validate.notEmpty("Title field cannot be empty."),
                        setup: function (element) {
                            var titleElement = $(element).find(".panel-heading");
//                            console.log(titleElement);
                            this.setValue(titleElement.html());
                        },
                        commit: function (element) {
                            var titleElement = $(element).find(".panel-heading");
                            titleElement.html(this.getValue());
                        }
                    },
                    {
                        type: 'textarea',
                        id: 'description',
                        label: 'Description',
                        setup: function (element) {
                            var contentElement = $(element).find(".panel-body");
//                            console.log(titleElement);
                            this.setValue(contentElement.html());
                        },
                        commit: function (element) {
                            var contentElement = $(element).find(".panel-body");
                            contentElement.html(this.getValue());
                        }
//                        validate: CKEDITOR.dialog.validate.notEmpty("Explanation field cannot be empty.")
                    }
                ]
            }
        ],

        onOk: function () {
            var dialog = this;
            dialog.commitContent(dialog.element);
            if (dialog.insertMode) {
                editor.insertHtml('<div class="panel panel-default collapsable">' +
                    '<div class="panel-heading collapsable-header">' +
                    '<h2 class="panel-title">' +
                    dialog.getValueOf('tab-basic', 'title') +
                    '</h2></div>' +
                    '<div class="panel-body collapsable-body"><p>' +
                    dialog.getValueOf('tab-basic', 'description') +
                    '</div>' +
                    '</div>');
            }
        },

        onShow: function () {
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            var p = $(element.$).parents("div.panel");
            if (p.size() > 0) {
                this.element = p[0];
                this.insertMode = false;
                this.setupContent(this.element);
            } else {
                this.insertMode = true;
            }
        }
    };
});
