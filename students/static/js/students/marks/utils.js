/**
 * Created by m on 13.02.15.
 */
define('utils', ['urls'], function (urls) {
    return {
        csrfize: function (data) {
            data.csrfmiddlewaretoken = urls.csrf;
            return data;
        },
        post: function(url, data, success, fail) {
            $.post(url, data).done(function (d) {
                if (success) success(d);
                InterfaceAlerts.showSuccess();
            }).fail(function (d) {
                if (fail) fail(d);
                InterfaceAlerts.showFail();
            })
        },
        get: function(url, data, success, fail) {
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