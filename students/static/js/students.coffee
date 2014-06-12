# cookies functions
cookie_group_id = () ->
    $.cookie('group_id')
cookie_discp_id = () ->
    $.cookie('discipline_id')
cookie_year = () ->
    $.cookie('year')



class StudentsTable
    @need_to_be_reloaded = null
    @selector_table = "#group-students .content"
    @selector_form_add = "#{@selector_table} form.add"
    @selector_form_remove = "#{@selector_table} form.remove"
    @selector_form_update = "#{@selector_table} form.update"

    @pstfx_old = "_old"

    @ACTIONS =
        Update: 1
        Add:    2
        Remove: 3

    @last_action = 0
    @last_student_id = -1

    @check_changed = (form) ->
        for i in $(form).find("input[type=text]")
            name = "#{i.name}#{StudentsTable.pstfx_old}"
            siblings = $(i).siblings("input[name=#{name}]")
            if siblings.size() > 0
                if i.value != siblings[0].value
                    return true
        return false

    @select_last_student_form_update = () ->
        selector = "input[name=student_id][value=#{StudentsTable.last_student_id}]"
        console.log(selector)
        student_id = $(@selector_form_update).find(selector)
        if student_id.size()
            input_second_name = student_id.siblings("input[name=second_name]")
            if input_second_name.size() > 0
                input_second_name[0].focus()

    @send_changed_students = () ->
        requests = []
        for f in $(StudentsTable.selector_form_update)
            if StudentsTable.check_changed(f)
                request = $.post(f.action, $(f).serialize())
                console.log(request)
                requests.push request

        $.when(requests).then ->
            StudentsTable.last_action = StudentsTable.ACTIONS.Update
            if StudentsTable.need_to_be_reloaded
                StudentsTable.need_to_be_reloaded()
            return
        return

    @bind: ->
        console.log("Student: start binding")
        # формы для добавления студента
        $(@selector_form_add).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('added')
                StudentsTable.last_student_id = -1
                StudentsTable.last_action = StudentsTable.ACTIONS.Add
                if StudentsTable.need_to_be_reloaded != null
                    StudentsTable.need_to_be_reloaded()
                return

        # формы для удаления студента
        $(@selector_form_remove).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log("removed")
                StudentsTable.last_student_id = -1
                StudentsTable.last_action = StudentsTable.ACTIONS.Remove
                if StudentsTable.need_to_be_reloaded != null
                    StudentsTable.need_to_be_reloaded()
                return

        $(@selector_form_update).submit ->
            console.log('form updated')
            StudentsTable.last_student_id = $(this).find('input[name=student_id]')[0].value or -1
            StudentsTable.send_changed_students()
            return false

        # отслеживание изменения имени студента
        $("#{@selector_form_update} input[type=text]").on('input', () ->
            name = "#{this.name}#{StudentsTable.pstfx_old}"
            old_value = $(this).siblings("input[name=#{name}]")[0].value
            $(this).parents('.form-group').toggleClass("has-success", old_value != this.value)
            $(this).siblings('span.glyphicon.form-control-feedback').toggleClass("hidden", old_value == this.value)
        )
        console.log("Student: end binding")
        this


    @restore_last_state: ->
        console.log("Students: restoring")
        if StudentsTable.last_action == StudentsTable.ACTIONS.Add
            $("#add_student_family_input").focus()
        if StudentsTable.last_action == StudentsTable.ACTIONS.Update
            StudentsTable.select_last_student_form_update()
        this


class GroupNav
    # функция событие вызывается когда навигационная панель долдна быть перезагружена
    @need_to_be_reloaded = null
    @active_btn_style = 'btn-primary'

    @selector_nav = "#groups-nav"

    @selector_submit_link = "#{@selector_nav} .submit-link"
    @selector_submit_link_forms = "#{@selector_submit_link} form.item"

    @selector_form_remove = "#{@selector_nav} form.remove"
    @selector_form_update = "#{@selector_nav} form.update"
    @selector_form_add = "#{@selector_nav} form.add"

    @selector_students_table_content = StudentsTable.selector_table

    # очищает стиль выделенных объектов
    @clear_items: ->
        $(GroupNav.selector_submit_link).toggleClass(GroupNav.active_btn_style, false)
        return

    @bind: ->
        console.log("Group: beind begin")
        # формы для удаления групп
        $(@selector_form_remove).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('removed')
                if GroupNav.need_to_be_reloaded
                    GroupNav.need_to_be_reloaded()
                return

        # формы для обновления групп
        $(@selector_form_update).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('updated')
                if GroupNav.need_to_be_reloaded
                    GroupNav.need_to_be_reloaded()
                return

        # формы для добавления групп
        $(@selector_form_add).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('added')
                if GroupNav.need_to_be_reloaded
                    GroupNav.need_to_be_reloaded()
                return

        # формы выбора группы
        $(@selector_submit_link).click ->
            console.log("clicked")
            GroupNav.clear_items()
            $(this).toggleClass(GroupNav.active_btn_style, true)
            $(this).find('form').ajaxSubmit
                target: GroupNav.selector_students_table_content
                success: (response, status, xhr, $form) ->
                    console.log('Group - submit: @selector_submit_link_forms: success')
                    StudentsTable.bind().restore_last_state()
                    return
            return false

        console.log("Group: beind end")
        this

    @restore_last_state: ->
        console.log("Group: restoring")
        if cookie_group_id()
            siblings =  $(GroupNav.selector_submit_link_forms)
                .find("input[name='group_id'][value='#{cookie_group_id()}']")
                .siblings('[type=submit]')
            if siblings.size() > 0
                siblings[0].click()
        this



class YearNav
    @selector_form = "form#year_selector"
    @selector_select = "#{@selector_form} select"
    @selector_group_nav_content = "#groups-content"

    @bind: ->
        console.log("YearNav:bind begin")
        $(@selector_form).ajaxForm
            target: @selector_group_nav_content
            success: (response, status, xhr, $form) ->
                GroupNav.bind().restore_last_state()
                return

        $(@selector_select).on('change', () ->
            $(YearNav.selector_form).submit()
            return
        )
        console.log("YearNav:bind end")
        this

    @year: ->
        $(@selector_select).val()

    @restore_last_state: ->
        $(YearNav.selector_select).val(cookie_year())
        $(YearNav.selector_form).submit()
        this

class StudentsControl
    constructor: ->
        StudentsTable.need_to_be_reloaded = GroupNav.restore_last_state
        GroupNav.need_to_be_reloaded = YearNav.restore_last_state

        YearNav.bind().restore_last_state()
        this

window.StudentsControl = StudentsControl