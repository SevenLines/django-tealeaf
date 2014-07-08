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

class LabEditor
    @clear_complexity: (lab_id) ->
        $("\##{lab_id}").removeClass()

    @create_ckEditor: (lab_content_id) ->
        ckEditor = CKEDITOR.inline("#{lab_content_id}")
        if FileUploadForm
            uploadForm = new FileUploadForm
                editor: ckEditor
        return ckEditor

    constructor: (lab_id, lab_content_id) ->
        ckEditor = LabEditor.create_ckEditor(lab_content_id)
        form = $("\##{lab_id}").find("form.lab-save")[0]

        $(form).submit ->
            data = $(form).serializeArray()
            console.log(form.action)
            data.push
                'name': 'description'
                'value': ckEditor.getData()

            r = $.post(
                form.action,
                data
            )

            r.success (data) ->
                bg = $("##{lab_id}").css('background-color')
                $("##{lab_id}").animate({ 'background-color': '#BBFFBB' }, 500).animate({'background-color': bg}, 500)

            r.fail (data) ->
                bg = $("##{lab_id}").css('background-color')
                $("##{lab_id}").animate({ 'background-color': '#FFBBBB' }, 500).animate({'background-color': bg}, 500)

            return false



class TaskEditor
    @restore_style: (submit) ->
        submit.toggleClass("btn-warning", false)
        submit.toggleClass("btn-success", false)

    @clear_complexity: (task_id) ->
        $("\##{task_id}").removeClass()

    @create_ckEditor: (id_content) ->
        ckEditor = CKEDITOR.inline(id_content)
        if FileUploadForm
            uploadForm = new FileUploadForm
                editor: ckEditor
        return ckEditor

    constructor: (task_id, id_content) ->
        ckEditor = null

        $("\##{task_id}").find(".turn-edit-on-btn").click ->
            $(this).hide("fast")
            $("\##{id_content}").attr("contenteditable", true)
            ckEditor = TaskEditor.create_ckEditor(id_content)

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
                TaskEditor.clear_complexity(task_id)
                $("##{task_id}").toggleClass(select[0].value, true)
                $("##{task_id} .info").html(data)
                btn = $("\##{task_id}").find(".turn-edit-on-btn")
                btn.show("fast")

                border_color = $("##{task_id}").css("border-color");
                $("##{task_id}").animate({"border-color": "green"}, 500)
                                .animate({"border-color": border_color}, 500)



            r.fail (data) ->
                TaskEditor.restore_style(submit)
                border_color = $("##{task_id}").css("border-color");
                $("##{task_id}").animate({"border-color": "red"}, 500)
                                .animate({"border-color": border_color}, 500)

            return false


window.TaskEditor = TaskEditor
window.LabTask = LabTask
window.LabEditor = LabEditor