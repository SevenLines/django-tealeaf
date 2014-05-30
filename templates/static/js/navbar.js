// Generated by CoffeeScript 1.7.1
(function() {
  var last_nav;

  last_nav = null;

  $(document).click(function(e) {
    var target;
    target = e.target;
    if (!$(target).is(".navpanel .level0 a")) {
      $(".navpanel .level0 .dropdown").hide("fast");
      return last_nav = 0;
    }
  });

  $(".navpanel .level0 a").click(function() {
    var drop;
    drop = $(this).parent().find(".dropdown");
    if (drop.length === 0) {
      return true;
    }
    if (last_nav) {
      $(last_nav).parent().find(".dropdown").toggle("fast");
    }
    if (last_nav !== this) {
      last_nav = this;
    } else {
      last_nav = 0;
    }
    return false;
  });

}).call(this);
