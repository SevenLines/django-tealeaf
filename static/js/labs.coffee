class LabTask

    @hide_all: ->
        $(".task-edit").hide()

    constructor: (id) ->
        @id = id
        $id = $("#task#{id}")

        task = $id.find(".task-edit")
        edit = $id.find(".task-edit-option")

        edit.find("a").click ->
            LabTask.hide_all()
            task.slideDown("fast")
            return false

        task.find("form").ajaxForm
            success: (response, status, xhr, $form) ->
                console.log("hi")
                $id.replaceWith(response)
                labTask = new LabTask(id)

        $(document).mouseup (e) ->
            if not task.is(e.target) and task.has(e.target).length == 0 and not edit.is(e.target) and edit.has(e.target).length == 0
                LabTask.hide_all()


class TaskEditor

    @restore_style: (submit) ->
        submit.toggleClass("btn-warning", false)
        submit.toggleClass("btn-success", false)

    @clear_complexity: (task_id) ->
        $("\##{task_id}").removeClass()

    constructor: (task_id, id_content) ->
        ckEditor = null

        $("\##{task_id}").find(".turn-edit-on-btn").click ->
            $(this).hide("fast")
            $("\##{id_content}").attr("contenteditable", true)
            ckEditor = CKEDITOR.inline(id_content)

        form = $("\##{task_id}").find("form.save")
        if form.size() == 0
            console.log("\##{task_id} form.save didn't find")
            return

        form = form[0]
        submit = $(form).find("button")
        select = $(form).find("select")
        $(form).submit ->
            if ckEditor is null
                ckEditor = CKEDITOR.inline(id_content)

            data = $(form).serializeArray()
            data.push
                'name': 'description'
                'value': ckEditor.getData()

            r = $.post(
                form.action,
                data
            )
            r.success (data) ->
                TaskEditor.restore_style(submit)
                TaskEditor.clear_complexity(task_id)
                submit.toggleClass("btn-success", true)
                $("##{task_id}").toggleClass(select[0].value, true)
                $("##{task_id} .info").html(data)
                btn = $("\##{task_id}").find(".turn-edit-on-btn")
                btn.show("fast")
                setTimeout(
                    () ->
                        TaskEditor.restore_style(submit)
                        btn.click ->
                            $(this).hide("fast")
                            $("\##{id_content}").attr("contenteditable", true)
                            ckEditor = CKEDITOR.inline(id_content)
                    1500
                )

            r.fail (data) ->
                TaskEditor.restore_style(submit)
                submit.toggleClass("btn-warning", true)

            return false


window.TaskEditor = TaskEditor
window.LabTask = LabTask