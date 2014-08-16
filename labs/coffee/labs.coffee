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
        $("\##{task_id}").removeClass("easy medium hard nightmare")

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
            try ckEditor = CKEDITOR.inline(id_content);

            console.log(ckEditor)

            data = $(form).serializeArray();
            if ckEditor != null
                console.log("good")
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

class SelectStudent
    update_select: (select_selector, val) ->


    constructor: (selector_select2, students_url) ->

        $(selector_select2).select2(
            placeholder: "студенты"
            multiple: true
            minimumInputLength: 2
            initSelection: (element, callback) ->
                data = []
                $(element).closest("form").find("select[name='users'] option").each (i, el)->
                    console.log(el)
                    data.push({
                        id: el.value
                        text: el.text
                    })
                callback(data)
                return
            ajax:
                url: students_url
                dataType: "json"
                data: (term, page) =>
                    return {
                        filter: term
                    }
                results: (data, page) =>
                    return {
                        results: data
                    }
        ).select2('val', [])
        .on("change", (e) ->
            selector_hidden_select = $(this).closest("form").find("select[name='users']")
            $(selector_hidden_select).find("option").remove()
            for v in e.val
               $(selector_hidden_select).append("<option val='#{v}' selected>#{v}</option>")
        )


window.SelectStudent = SelectStudent
window.TaskEditor = TaskEditor
window.LabEditor = LabEditor