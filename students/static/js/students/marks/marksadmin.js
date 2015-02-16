/**
 * Created by m on 16.02.15.
 */
require.config({
    paths: {
        knockout: '/static/bower_components/knockout/dist/knockout',
        ckeditorbinding: './bindings/ckeditorbinding',
        sortbalelistbinding: './bindings/sortbalelistbinding',
        select2binding: './bindings/select2binding',
        select2: '/static/bower_components/select2/select2',
    }
});

require(['bindings/ckeditorbinding', 'bindings/sortbalelistbinding', 'bindings/select2binding']);
