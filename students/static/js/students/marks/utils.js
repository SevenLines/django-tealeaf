/**
 * Created by m on 13.02.15.
 */
define('utils', ['urls'], function (urls) {
    return {
        csrfize: function (data) {
            data.csrfmiddlewaretoken = urls.csrf;
            return data;
        }
    };
});