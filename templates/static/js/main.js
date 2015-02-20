/**
 * Created by m on 21.02.15.
 */

require.config({
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        bootstrap: '../lib/bootstrap/bootstrap.min'
    }
});

require(["interface"]);
