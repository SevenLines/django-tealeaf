# cookies functions
cookie_group_id = () ->
  $.cookie('group_id')
cookie_discp_id = () ->
  $.cookie('discipline_id')
cookie_year = () ->
  $.cookie('year')

#add_student_form
add_student_form_selector = "form#add_student"
#$add_student_form_discp_id = $($add_student_form).children("input[name='discipline_id']")[0])

# selectors
add_group_form_selector = "#groups-nav form#add_group"
remove_group_form_selector = "#groups-nav form.remove"
update_group_form_selector = "#groups-nav form.update"
group_submit_links = "#groups-nav .submit-link"
year_selector_form = "form#year_selector"
student_content_selector = "#group-students .content"
group_content_selector = "#groups-content"
group_item = "#groups-nav form.item"

# styles
active_btn_style = 'btn-primary'

# helper functions
clear_items = () ->
  $(group_submit_links).removeClass(active_btn_style)

restore_last_year = () ->
  # set initial year from last session
  if cookie_year()
    $("#{year_selector_form} select option").filter(() ->
      return $(this).text() == cookie_year()
    ).attr('selected', true)
    $(year_selector_form).submit()

bind_submit_links = () ->
  $(group_submit_links).click ->
    $(this).children('form').submit()

restore_last_group = () ->
  if cookie_group_id()
    $(group_item).find("input[name='group_id'][value='#{cookie_group_id()}']").siblings('[type=submit]')[0].click()

# ajax'ing students table
students_form_ajaxing = () ->
  add_student_form_ajaxing()
  $("#group-students .content form.ajaxed").ajaxForm
    target: student_content_selector
    success: (response, status, xhr, $form) ->
      students_form_ajaxing()

groups_nav_ajaxing = () ->
  group_item_forms_ajaxing()
  add_group_form_ajaxing()
  remove_group_form_ajaxing()
  update_group_form_ajaxing()
  restore_last_group()

# setting group selector events
group_item_forms_ajaxing = () ->
  # ajax'ing group's students selection
  bind_submit_links()
  $(group_item).ajaxForm
    target: student_content_selector
    success: (response, status, xhr, $form) ->
      clear_items()
      $(add_student_form_selector).children("input[name='group_id']").attr('value', cookie_group_id())
#      $add_student_form_discp_id.attr('value', cookie_discp_id())
      sbm = $form.closest(group_submit_links)
      $(sbm).addClass(active_btn_style)
      students_form_ajaxing()

remove_group_form_ajaxing = () ->
  $(remove_group_form_selector).ajaxForm
    target: group_content_selector
    success: (response, status, xhr, $form) ->
      groups_nav_ajaxing()

add_group_form_ajaxing = () ->
  $(add_group_form_selector).ajaxForm
    target: group_content_selector
    success: (response, status, xhr, $form) ->
      groups_nav_ajaxing()

update_group_form_ajaxing = () ->
  $(update_group_form_selector).ajaxForm
    target: group_content_selector
    success: (response, status, xhr, $form) ->
      groups_nav_ajaxing()

# ajax'ing add student form
add_student_form_ajaxing = () ->
  $(add_student_form_selector).ajaxForm
    target: student_content_selector
    success: (response, status, xhr, $form) ->
      alert($(add_student_form_selector).size())
      $(add_student_form_selector).find("input[type=text]").val('')
      $($(add_student_form_selector).find("input[type=text]")[0]).focus()
      students_form_ajaxing()
#    beforeSubmit: (formData, jqForm, options) ->



# эта функция активирует события выбора года
# и все что к этому прилагается
set_years_events = () ->
  # мнгновенное смена года
  $("#{year_selector_form} select").on('change', ()->
    $(year_selector_form).submit()
  )
  # ajax'им событие формы
  $(year_selector_form).ajaxForm
    target: group_content_selector
    success: (response, status, xhr, $form) ->
      groups_nav_ajaxing()

  # а так же востанавливает последний выбранный год
  restore_last_year()

# добавляем функцию в глобальное пространство имен
window.set_years_events = set_years_events
