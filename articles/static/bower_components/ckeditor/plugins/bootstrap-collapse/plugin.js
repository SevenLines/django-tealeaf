/**
 * Created by m on 06.10.14.
 */
CKEDITOR.plugins.add('bootstrap-collapse', {
    icons: "",
    init: function (editor) {
        editor.addCommand("addCollapse", new CKEDITOR.dialogCommand("collapseDialog"));
        CKEDITOR.dialog.add("collapseDialog", this.path + "dialogs/bootstrap-collapse.js");
        editor.ui.addButton("AddCollapse", {
            label: 'Add bootstrap collapse',
            command: 'addCollapse',
            toolbar: 'insert'
        });

        if (editor.contextMenu) {
            editor.addMenuGroup("bootstrapGroup");
            editor.addMenuItem("bootstrapCollapseItem", {
                label: "Edit collapse",
                command: "addCollapse",
                group: "bootstrapGroup"
            });
            editor.contextMenu.addListener(function(element) {
                var p = $(element.$).parents("div.panel");
                if (p.size() > 0) {
                    return { bootstrapCollapseItem: CKEDITOR.TRISTATE_OFF };
                }
            })
        }
    }
});