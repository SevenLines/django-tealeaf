last_nav = null

$(document).click (e) ->
  target = e.target
  if not $(target).is(".navpanel .level0 a")
    $(".navpanel .level0 .dropdown").hide("fast")
    last_nav = 0

#$(".navpanel .logo a").hover \
#  ( -> $(this).animate({ height: "+=20", })),\
#  ( -> $(this).animate({ height: "-=20", }))


$(".navpanel .level0 a").click ->
  drop = $(this).parent().find(".dropdown")

  if drop.length == 0
    return true

  if last_nav
    $(last_nav).parent().find(".dropdown").toggle("fast")

  if last_nav != this
#    drop.animate(() ->
#      left: if parseInt(drop.css('left'), 10) == 0 then -left.outerWidth() else 0
#    )
    drop.toggle("fast")
    last_nav = this
  else
    last_nav = 0
  return false