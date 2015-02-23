/**
 * Created by m on 14.02.15.
 */
define(['knockout'], function (ko) {
    // binding ckeditor with description content
    ko.bindingHandlers.ckeditor = {
        init: function (element) {
            var editor = $(element).ckeditor({
                extraPlugins: 'sourcedialog,divarea,bootstrap-collapse,insertpre,div,image,' +
                'bootstrap-collapse,bootstrap-message,showblocks,justify,divarea,colordialog,colorbutton,liststyle,eqneditor'
            }).editor;
            self.description(editor.getData());
            editor.on('change', function (data) {
                self.description(editor.getData());
            });

            //// create save button
            //editor.addCommand("SaveCommand", {
            //    exec: function () {
            //        self.update_description();
            //    }
            //});
            editor.ui.addButton("Save", {
                command: "SaveCommand",
                label: "Save",
                icon: element.dataset.icon,
                toolbar: "editing"
            });
            // <<<
        },
    };
});