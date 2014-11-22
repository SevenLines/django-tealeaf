ko.bindingHandlers.select2 = {
  init: function(element, valueAccessor, allBindingsAccessor) {
    var obj = valueAccessor(),
      allBindings = allBindingsAccessor(),
      lookupKey = allBindings.lookupKey;

    setTimeout(function() { 
      $(element).select2(obj);
    }, 0);

    if (lookupKey) {
      var value = ko.utils.unwrapObservable(allBindings.value);
      $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function(item) {
        return item[lookupKey] === value;
      }));
    }

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      $(element).select2('destroy');
    });
  },
  update: function(element) {
    $(element).trigger('change');
  }
};