/**
 * Created by m on 13.02.15.
 */
define('utils', ['urls'], function (urls) {
    function csrfize(data) {
        data.csrfmiddlewaretoken = urls.csrf;
        return data;
    }

    return {
        csrfize: csrfize,
        post: function (url, data, success, fail) {
            $.post(url, csrfize(data)).done(function (d) {
                if (success) success(d);
                InterfaceAlerts.showSuccess();
            }).fail(function (d) {
                if (fail) fail(d);
                InterfaceAlerts.showFail();
            })
        },
        get: function (url, data, success, fail) {
            $.get(url, data).done(function (d) {
                if (success) success(d);
                InterfaceAlerts.showSuccess();
            }).fail(function (d) {
                if (fail) fail(d);
                InterfaceAlerts.showFail();
            });
        }
    };
});