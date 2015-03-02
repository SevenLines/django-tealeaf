({
    baseUrl: '../../marks',
    out: '../dist/marks.js',
    name: 'marks',
    findNestedDependencies: true,
    paths: {
        'qtip': '../../../bower_components/qtip2/jquery.qtip',
        'knockout': '../../../bower_components/knockout/dist/knockout',
        'select2': '../../../bower_components/select2/select2',
        'jquery-impromptu': '../../../bower_components/jquery-impromptu/dist/jquery-impromptu',

        'color': '../../../lib/color',

        'marks': './marks',
        'labs': './labs',

        'helpers': '../../helpers',

        'ckeditorinlinebinding': '../../bindings/ckeditorinlinebinding',
        'select2binding': '../../bindings/select2binding',

        'jquery': 'empty:',
        "urls": 'empty:',
        "pickmeup": 'empty:',
    }
})