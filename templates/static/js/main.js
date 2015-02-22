/**
 * Created by m on 21.02.15.
 */

require.config({
    shim: {
        'bootstrap': {deps: ['jquery']}
    },
    paths: {
        'bootstrap': '../lib/bootstrap/bootstrap.min',
        'jquery': '../bower_components/jquery/dist/jquery',
        'prettify': '../bower_components/google-code-prettify/bin/prettify.min.js'
    }
});

define('jquery', [], function () {
    return jQuery;
});

require(["interface", 'prettify', 'jquery.toc']);
