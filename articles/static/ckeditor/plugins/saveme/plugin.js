CKEDITOR.plugins.add("saveme", {
    icons: 'saveme',

    init: function (editor) {
        editor.addCommand("saveme", {
            exec: function () {
                alert("reimplement me!");
            }
        });

        editor.ui.addButton('Saveme', {
            label: "saveme",
            command: "saveme"
        });
    }
});
