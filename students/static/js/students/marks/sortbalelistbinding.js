/**
 * Created by m on 14.02.15.
 */
define(['knockout'], function (ko) {
    ko.bindingHandlers.sortableList = {
        init: function (element, valueAccessor) {
            var list = valueAccessor();
            Sortable.create(element, {
                onUpdate: function (event) {
                    var item = list()[event.oldIndex];
                    list.remove(item);
                    list.splice(event.newIndex, 0, item)
                }
            });
        }
    };
});