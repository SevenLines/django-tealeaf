# cookies functions
cookie_group_id = () -> $.cookie('group_id')
cookie_discp_id = () -> $.cookie('discipline_id')

#add_form
$add_student_form = $($("form#add_student")[0])
$add_student_form_group_id = $($add_student_form.children("input[name='group_id']")[0])
$add_student_form_discp_id = $($add_student_form.children("input[name='discipline_id']")[0])

student_content_selector = '#group-students .content'

# groups nav form
groups_forms = $($(".groups-nav li form"))

# helper functions
clear_items = () ->
  $('.groups .item form').find(':submit').removeClass('btn-primary')

# ajax'ing students table
set_post_objects_events = () ->
  $("#group-students .content form.ajaxed").ajaxForm
    target: student_content_selector
    success: (response, status, xhr, $form) ->
      set_post_objects_events()

# ajax'ing group's students selection
$('.groups .item form').ajaxForm
  target: student_content_selector
  success: (response, status, xhr, $form) ->
    clear_items()
    $add_student_form_group_id.attr('value', cookie_group_id())
    $add_student_form_discp_id.attr('value', cookie_discp_id())
    sbm = $form.find(':submit')
    $(sbm).addClass("btn-primary")
    set_post_objects_events()

# ajax'ing add student form
$add_student_form.ajaxForm
  target: student_content_selector
  success: (response, status, xhr, $form) ->
    set_post_objects_events()
  beforeSubmit: (formData, jqForm, options) ->
    $add_student_form.find("input[type=text]").val('')
    $($add_student_form.find("input[type=text]")[0]).focus()

# show group from cookie on page load complete
if cookie_group_id()
  groups_forms.find("input[name='group_id'][value='#{cookie_group_id()}']").siblings('[type=submit]')[0].click()
else
  $(groups_forms[0]).find("[type=submit]").click()


