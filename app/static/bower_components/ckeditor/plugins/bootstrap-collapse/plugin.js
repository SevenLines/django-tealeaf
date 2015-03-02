/**
 * Created by m on 06.10.14.
 */
CKEDITOR.plugins.add('bootstrap-collapse', {
    icons: "collapse_arrow16x16",
    init: function (editor) {
        editor.addCommand("addCollapse", new CKEDITOR.dialogCommand("collapseDialog"));
        CKEDITOR.dialog.add("collapseDialog", this.path + "dialogs/bootstrap-collapse.js");
        editor.ui.addButton("AddCollapse", {
            label: 'Add bootstrap collapse',
            command: 'addCollapse',
            toolbar: 'insert',
            icon : this.path + 'icons/collapse_arrow16x16.png'
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
                if (p.size() <= 0) {
                    return { bootstrapCollapseItem: CKEDITOR.TRISTATE_OFF };
                }
            })
        }
    }
});