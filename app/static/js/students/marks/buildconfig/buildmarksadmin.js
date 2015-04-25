({
    baseUrl: '../../marks',
    out: '../dist/marksadmin.js',
    name: 'marksadmin',
    findNestedDependencies: true,
    paths: {
        'qtip': '../../../bower_components/qtip2/jquery.qtip',
        'knockout': '../../../bower_components/knockout/dist/knockout',
        'select2': '../../../bower_components/select2/select2',
        'jquery-impromptu': '../../../bower_components/jquery-impromptu/dist/jquery-impromptu',
        'pickmeup': '../../../bower_components/pickmeup/js/jquery.pickmeup',
        'iconpicker': '../../../bower_components/fontawesome-iconpicker/dist/js/fontawesome-iconpicker',

        'color': '../../../lib/color',

        'marks': './marks',
        'labs': './labs',

        'helpers': '../../helpers',
        'jquery.toc': '../../jquery.toc',

        'ckeditorinlinebinding': '../../bindings/ckeditorinlinebinding',
        'select2binding': '../../bindings/select2binding',

        'jquery': 'empty:',
        "urls": 'empty:',
        //"urls": 'empty:',
    }
})