/**
 * Created by m on 21.02.15.
 */

require.config({
    paths: {
        bootstrap: '../lib/bootstrap/bootstrap.min'
    }
});

define('jquery', [], function () {
    return jQuery;
});

require(["interface"]);
