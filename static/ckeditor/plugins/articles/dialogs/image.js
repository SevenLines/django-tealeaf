CKEDITOR.dialog.add( 'articlesImageDialog', function ( editor ) {
    return {
        title: 'Image',
        minWidth: 400,
        minHeight: 200,

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'file',
                        id: 'file',
                        label: 'Image path',
                        validate: CKEDITOR.dialog.validate.notEmpty("select image")
                    }
                ]
            }
        ]
    };
});