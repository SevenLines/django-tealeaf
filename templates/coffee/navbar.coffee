last_nav = null

$(document).click (e) ->
    target = e.target
    if not $(target).is(".navpanel .level0 a")
        element = $(".navpanel .level0 .dropdown")
        $(element).animate({width: 'hide'}, 'fast')
        last_nav = 0


$(".navpanel .level0 a").click ->
    drop = $(this).parent().find(".dropdown")
    if drop.size() == 0
        return true

    if last_nav
        element = $(last_nav).parent().find(".dropdown")
        $(element).animate({width: 'hide'}, 'fast')

    if last_nav != this
        $(drop).animate({width: 'show'}, 'fast')
        last_nav = this
    else
        last_nav = 0

    return false