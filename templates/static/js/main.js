/**
 * Created by m on 21.02.15.
 */

require.config({
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        bootstrap: '../lib/bootstrap/bootstrap.min',
        jquery: '../bower_components/jquery/dist/jquery'
    }
});

require(["interface"]);
