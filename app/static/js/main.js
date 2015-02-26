/**
 * Created by m on 21.02.15.
 */

require.config({
    shim: {
        'bootstrap': {deps: ['jquery']}
    },
    paths: {
        'bootstrap': '../lib/bootstrap/bootstrap.min',
        'prettify': '../bower_components/google-code-prettify/bin/prettify.min',
        'common-settings': 'empty:'
    }
});

define('jquery', [], function () {
    return jQuery;
});

require(['common']);
