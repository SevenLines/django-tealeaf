last_nav = 0

#$(".navpanel .logo a").mouseenter ->
#  hue = Math.floor(Math.random() * 30) * 12;
#
#  color = $.Color({
#    hue: hue,
#    saturation: 0.5,
#    lightness: 0.8,
#    alpha: 0.75
#  }).toHexString();
#
#  $(this).css("background-color", color)

$(document).click (e) ->
  target = e.target
  if not $(target).is(".navpanel .level0 a")
    $(".navpanel .level0 .dropdown").hide("fast")
    last_nav = 0

$(".navpanel .level0 a").click ->
  drop = $(this).parent().find(".dropdown")

  if drop.length == 0
    return true

  if last_nav
    $(last_nav).parent().find(".dropdown").toggle("fast")

  if last_nav != this
    drop.toggle("fast")
    last_nav = this
  else
    last_nav = 0
  return false