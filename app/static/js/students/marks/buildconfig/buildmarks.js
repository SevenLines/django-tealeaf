({
    baseUrl: '../../marks',
    out: '../dist/marks.js',
    name: 'marks',
    findNestedDependencies: true,
    paths: {
        'qtip': '../../../bower_components/qtip2/jquery.qtip',
        'knockout': '../../../bower_components/knockout/dist/knockout',
        'prettify': '../../../bower_components/google-code-prettify/bin/prettify.min',
        'jquery.cookie': '../../../bower_components/jquery.cookie/jquery.cookie',
        'select2': '../../../bower_components/select2/select2',
        'jquery-impromptu': '../../../bower_components/jquery-impromptu/dist/jquery-impromptu',

        'color': '../../../lib/color',
        'bootstrap': '../../../lib/bootstrap/bootstrap.min',

        'marks': './marks',
        'labs': './labs',
        'config': 'empty:',

        'helpers': '../../helpers',
        'interface': '../../interface',
        'common': '../../common',
        'jquery.toc': '../../jquery.toc',

        'ckeditorinlinebinding': '../../bindings/ckeditorinlinebinding',
        'select2binding': '../../bindings/select2binding',

        'jquery': 'empty:',
        "urls": 'empty:',
        "pickmeup": 'empty:',
        "common-settings": 'empty:'
    }
})