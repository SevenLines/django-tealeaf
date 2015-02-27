/**
 * Created by m on 22.02.15.
 */
define([], function () {
    return {
        toLocString: function (isodate) {
            if (!isodate)
                return "-";
            var d = new Date(isodate);
            return d.toLocaleString("en-GB");
        }
    }
});
