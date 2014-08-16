# cookies functions
cookie_group_id = () ->
    $.cookie('group_id')
cookie_discp_id = () ->
    $.cookie('discipline_id')
cookie_year = () ->
    $.cookie('year')

Logger.useDefaults()

class StudentsTable
    pstfx_old = "_old"

    ACTIONS =
        Update: 1
        Add:    2
        Remove: 3

    @last_action = 0
    @last_student_id = -1

    constructor: ->
        @id = ""
        @need_to_be_reloaded = null
        @selector_table = "#{@id} .group-students .content"
        @selector_form_add = "#{@selector_table} form.add"
        @selector_form_remove = "#{@selector_table} form.remove"
        @selector_form_update = "#{@selector_table} form.update"
        @modal_form = "#{@id} .modal_remove"
        @add_student_family_input = "#{@id} .add_student_family_input"


    set_id: (id) =>
        @id = id
        @selector_table = "#{@id} .group-students .content"
        @selector_form_add = "#{@selector_table} form.add"
        @selector_form_remove = "#{@selector_table} form.remove"
        @selector_form_update = "#{@selector_table} form.update"
        @modal_form = "#{@id} .modal_remove"
        @add_student_family_input = "#{@id} .add_student_family_input"

    check_changed = (form) =>
        for i in $(form).find("input[type=text]")
            name = "#{i.name}#{pstfx_old}"
            siblings = $(i).siblings("input[name=#{name}]")
            if siblings.size() > 0
                if i.value != siblings[0].value
                    return true
        return false

    select_last_student_form_update = (selector_form_update) =>
        selector = "input[name=student_id][value=#{StudentsTable.last_student_id}]"
        console.log("Gonna restore: #{selector}")
        console.log(selector_form_update)
        student_id = $(selector_form_update).find(selector)
        if student_id.size()
            input_second_name = student_id.siblings("input[name=second_name]")
            if input_second_name.size() > 0
                input_second_name[0].focus()

    send_changed_students = (selector_form_update, need_to_be_reloaded) =>
        requests = []
        console.log(selector_form_update)

        for f in $(selector_form_update)
            if check_changed(f)
                request = $.post(f.action, $(f).serialize())
                console.log(request)
                requests.push request

        $.when(requests).then ->
            StudentsTable.last_action = ACTIONS.Update
            if need_to_be_reloaded
                need_to_be_reloaded()
            return
        return

    bind: =>
        console.log("Student: start binding")

        need_to_be_reloaded = @need_to_be_reloaded
        modal_form = @modal_form
        selector_form_update = @selector_form_update

        # формы для добавления студента
        $(@selector_form_add).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('added')
                StudentsTable.last_student_id = -1
                StudentsTable.last_action = ACTIONS.Add
                if need_to_be_reloaded != null
                    need_to_be_reloaded()
                return

        # формы для удаления студента
        $(@selector_form_remove).submit ->
            modal = $("#{modal_form}").modal("show")

            try
                tr = $(this).parents("tr")[0]
                if tr
                    form = $(tr).find("form.update")
                    name = form.find("input[name=name]")[0].value
                    second_name = form.find("input[name=second_name]")[0].value
            catch
                return false

            student_name = $($(this).parents("li")[1]).find('a').text()
            modal.find('.modal-body').html("Удалить?<h2>#{second_name}<br>#{name}</h2>")

            form = this
            $(modal).find('.confirm').unbind('click')
            $(modal).find('.confirm').click ->
                console.info("clicked")
                $(form).ajaxSubmit
                    success: (response, status, xhr, $form) ->
                        console.info("removed")
                        StudentsTable.last_student_id = -1
                        StudentsTable.last_action = ACTIONS.Remove
                        if need_to_be_reloaded != null
                            need_to_be_reloaded()
                        return
            return false

        $(@selector_form_update).submit ->
            console.log('form updated')
            StudentsTable.last_student_id = $(this).find('input[name=student_id]')[0].value or -1
            send_changed_students(selector_form_update, need_to_be_reloaded)
            return false

        # отслеживание изменения имени студента
        $("#{@selector_form_update} input[type=text]").on('input', () ->
            name = "#{this.name}#{pstfx_old}"
            old_value = $(this).siblings("input[name=#{name}]")[0].value
            $(this).parents('.form-group').toggleClass("has-success", old_value != this.value)
            $(this).siblings('span.glyphicon.form-control-feedback').toggleClass("hidden", old_value == this.value)
        )
        console.log("Student: end binding")
        this


    restore_last_state: =>
        console.log("Students: restoring")
        if StudentsTable.last_action == ACTIONS.Add
            $("#{@add_student_family_input}").focus()
        if StudentsTable.last_action == ACTIONS.Update
            select_last_student_form_update(@selector_form_update)
        this


class GroupNav
    log = Logger.get("GroupNav")

    constructor: () ->
        @id = ""
        @need_to_be_reloaded = ""
        @active_btn_style = "btn-primary"
        @selector_nav = ""
        @selector_submit_link = ""
        @selector_submit_link_forms = ""
        @selector_form_remove = ""
        @selector_form_add = ""
        @modal_form = ""
        @selector_students_table_content = ""
        @students_table = new StudentsTable()
        @students_table.need_to_be_reloaded = @restore_last_state
        @set_id("")

    set_id: (_id) =>
        @id = _id
        @students_table.set_id(@id)
        @log = Logger.get("GroupNav-#{@id}")

        @selector_nav = "#{@id} .groups-nav"

        @selector_submit_link = "#{@selector_nav} .submit-link"
        @selector_submit_link_forms = "#{@selector_submit_link} form.item"

        @selector_form_remove = "#{@selector_nav} form.remove"
        @selector_form_update = "#{@selector_nav} form.update"
        @selector_form_add = "#{@selector_nav} form.add"
        @selector_form_copy_to_next_year = "#{@selector_nav} form.copy_to_next_year"
        @modal_form = "#{@id} .modal_remove"
        @selector_students_table_content = @students_table.selector_table

#        selector_students_table_content = students_table.selector_table

    # очищает стиль выделенных объектов
    clear_items: ->
        $(@selector_submit_link).toggleClass(@active_btn_style, false)
        return

    bind: ->
        log.debug("Group: bind begin")
        group_nav = this
        # формы для удаления групп
        $(@selector_form_remove).submit ->
            modal = $("#{group_nav.modal_form}").modal("show")

            group_name = $($(this).parents("li")[1]).find('a').text()
            modal.find('.modal-body').html("Удалить группу?<h2>#{group_name}</h2>")

            form = this
            $(modal).find('.confirm').unbind('click')
            $(modal).find('.confirm').click ->
                $(form).ajaxSubmit
                    success: (response, status, xhr, $form) ->
                        console.log('removed')
                        if need_to_be_reloaded
                            need_to_be_reloaded()
                        return

            return false

        # формы для обновления групп
        $(@selector_form_update).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('updated')
                if need_to_be_reloaded
                    need_to_be_reloaded()
                return

        # форма копирования группы в следующий год
        $(@selector_form_copy_to_next_year).ajaxForm
            success: (response, status, xhr, $form) ->
#                console.dir(this)
                $form.remove()
                return

        need_to_be_reloaded = @need_to_be_reloaded
        # формы для добавления групп
        $(@selector_form_add).ajaxForm
            success: (response, status, xhr, $form) ->
                console.log('added')
                if need_to_be_reloaded
                    need_to_be_reloaded()
                return

        active_btn_style = @active_btn_style
        selector_students_table_content = @selector_students_table_content
        students_table = @students_table
        selector_submit_link = @selector_submit_link

        # формы выбора группы
        $(@selector_submit_link).click ->
            log.debug("clicked")
            $(selector_submit_link).toggleClass(active_btn_style, false)
            $(this).toggleClass(active_btn_style, true)
            log.debug(selector_students_table_content)
            $(this).find('form').ajaxSubmit
                target: selector_students_table_content
                success: (response, status, xhr, $form) ->
                    log.debug('selector_submit_link_forms: success')
                    students_table.bind().restore_last_state()
                    return
            return false

        log.debug("Group: bind end")
        this

    restore_last_state: =>
        log.debug("restore last state")
        if cookie_group_id()
            log.debug("immitate clicking")
            log.debug(@selector_submit_link_forms)
            siblings =  $(@selector_submit_link_forms)
                .find("input[name='group_id'][value='#{cookie_group_id()}']")
                .siblings('[type=submit]')
            if siblings.size() > 0
                siblings[0].click()
        this



class YearNav
    log = Logger.get("YearNav")


    constructor: ->
        @group_nav = new GroupNav()

        @id = ""
        @selector_form = "#{@id} form.year_selector"
        @selector_select = "#{@selector_form} select"
        @selector_group_nav_content = "#{@id} .groups-content"
        @group_nav.need_to_be_reloaded = @restore_last_state
        @set_id("")


    set_id: (_id) =>
        @id = _id
        @selector_form = "#{@id} form.year_selector"
        @selector_select = "#{@selector_form} select"
        @selector_group_nav_content = "#{@id} .groups-content"
        @group_nav.set_id(@id)

        log = Logger.get("YearNav-#{@id}")

    bind: =>
        log.debug("bind begin")
        selector_group_nav_content = @selector_group_nav_content
        selector_form = @selector_form
        group_nav = @group_nav

        $(@selector_form).ajaxForm
            target: selector_group_nav_content
            success: (response, status, xhr, $form) ->
                log.debug("get succesfull responce to #{selector_group_nav_content}")
                log.debug($(selector_group_nav_content).size())
                group_nav.bind().restore_last_state()
                return

        $(@selector_select).on('change', () ->
            $(selector_form).submit()
            return
        )
        log.debug("bind end")
        this

    year: =>
        $(@selector_select).val()

    restore_last_state: =>
        log.debug("restore last state")
        $(@selector_select).val(cookie_year())
        log.debug("submit")
        $(@selector_form).submit()
        this

class StudentsControl
    log = Logger.get("StudentsControl")
    id = ""

    constructor: (id) ->
        @year_nav = new YearNav()
        @id = "##{id}"

        log.debug("set id #{@id}")
        @year_nav.set_id(@id)

        log.debug("bind and restore")
        @year_nav.bind().restore_last_state()
        this

window.StudentsControl = StudentsControl
window.YearNav = YearNav
window.StudentsTable = StudentsTable
window.GroupNav = GroupNav