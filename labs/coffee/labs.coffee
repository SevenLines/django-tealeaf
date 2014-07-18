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
                $("##{lab_id}").toggleClass("bg-success", true);
                setTimeout(
                    () ->
                        $("##{lab_id}").toggleClass("bg-success", false)
                    1000)

            r.fail (data) ->
                $("##{lab_id}").toggleClass("bg-danger", true);
                setTimeout(
                    () ->
                        $("##{lab_id}").toggleClass("bg-danger", false)
                    1000)

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
            data = $(form).serializeArray()
            if $("##{id_content}").size() > 0 and ckEditor is null
                ckEditor = CKEDITOR.inline(id_content)
                data.push
                    'name': 'description'
                    'value': ckEditor.getData()
#            console.log("about to send")

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

                $("##{task_id} .edit").toggleClass("bg-success", true);
                setTimeout(
                    () ->
                        $("##{task_id} .edit").toggleClass("bg-success", false)
                    1000)


            r.fail (data) ->
                TaskEditor.restore_style(submit)
                $("##{task_id} .edit").toggleClass("bg-danger", true);
                setTimeout(
                    () ->
                        $("##{task_id} .edit").toggleClass("bg-danger", false)
                    1000)

            return false


window.TaskEditor = TaskEditor
window.LabEditor = LabEditor