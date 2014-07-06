/**
 * Created by mick on 26.06.14.
 */

CKEDITOR.plugins.add( 'articles', {
    icons: 'articles',

    init: function (editor) {
        editor.addCommand("insert_article_file", {
            exec: function () {
                alert("reimplement me!");
            }
        });

        editor.ui.addButton('Upload', {
            icon: this.path + "icons/upload.png",
            label: "Insert article file",
            command: "insert_article_file"
        });
    }
});