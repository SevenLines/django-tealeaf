/**
 * Created by m on 21.02.15.
 */
({
    baseUrl: '../',
    out: '../dist/main.js',
    name: 'main',
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'bootstrap': '../lib/bootstrap/bootstrap.min',
        'common-settings': 'empty:'
    }
})