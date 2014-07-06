// Generated by CoffeeScript 1.7.1
(function() {
  var LabEditor, LabTask, TaskEditor;

  LabTask = (function() {
    LabTask.hide_all = function() {
      return $(".task-edit").hide();
    };

    function LabTask(id) {
      var $id, edit, task;
      this.id = id;
      $id = $("#task" + id);
      task = $id.find(".task-edit");
      edit = $id.find(".task-edit-option");
      edit.find("a").click(function() {
        LabTask.hide_all();
        task.slideDown("fast");
        return false;
      });
      task.find("form").ajaxForm({
        success: function(response, status, xhr, $form) {
          var labTask;
          console.log("hi");
          $id.replaceWith(response);
          return labTask = new LabTask(id);
        }
      });
      $(document).mouseup(function(e) {
        if (!task.is(e.target) && task.has(e.target).length === 0 && !edit.is(e.target) && edit.has(e.target).length === 0) {
          return LabTask.hide_all();
        }
      });
    }

    return LabTask;

  })();

  LabEditor = (function() {
    LabEditor.clear_complexity = function(lab_id) {
      return $("\#" + lab_id).removeClass();
    };

    LabEditor.create_ckEditor = function(lab_content_id) {
      var ckEditor, uploadForm;
      ckEditor = CKEDITOR.inline("" + lab_content_id);
      if (FileUploadForm) {
        uploadForm = new FileUploadForm({
          editor: ckEditor
        });
      }
      return ckEditor;
    };

    function LabEditor(lab_id, lab_content_id) {
      var ckEditor, form;
      ckEditor = LabEditor.create_ckEditor(lab_content_id);
      form = $("\#" + lab_id).find("form.lab-save")[0];
      $(form).submit(function() {
        var data, r;
        data = $(form).serializeArray();
        console.log(form.action);
        data.push({
          'name': 'description',
          'value': ckEditor.getData()
        });
        r = $.post(form.action, data);
        r.success(function(data) {
          var bg;
          bg = $("#" + lab_id).css('background-color');
          return $("#" + lab_id).animate({
            'background-color': '#BBFFBB'
          }, 500).animate({
            'background-color': bg
          }, 500);
        });
        r.fail(function(data) {
          var bg;
          bg = $("#" + lab_id).css('background-color');
          return $("#" + lab_id).animate({
            'background-color': '#FFBBBB'
          }, 500).animate({
            'background-color': bg
          }, 500);
        });
        return false;
      });
    }

    return LabEditor;

  })();

  TaskEditor = (function() {
    TaskEditor.restore_style = function(submit) {
      submit.toggleClass("btn-warning", false);
      return submit.toggleClass("btn-success", false);
    };

    TaskEditor.clear_complexity = function(task_id) {
      return $("\#" + task_id).removeClass();
    };

    TaskEditor.create_ckEditor = function(id_content) {
      var ckEditor, uploadForm;
      ckEditor = CKEDITOR.inline(id_content);
      if (FileUploadForm) {
        uploadForm = new FileUploadForm({
          editor: ckEditor
        });
      }
      return ckEditor;
    };

    function TaskEditor(task_id, id_content) {
      var ckEditor, form, select, submit;
      ckEditor = null;
      $("\#" + task_id).find(".turn-edit-on-btn").click(function() {
        $(this).hide("fast");
        $("\#" + id_content).attr("contenteditable", true);
        return ckEditor = TaskEditor.create_ckEditor(id_content);
      });
      form = $("\#" + task_id).find("form.save");
      if (form.size() === 0) {
        console.log("\#" + task_id + " form.save didn't find");
        return;
      }
      form = form[0];
      submit = $(form).find("button");
      select = $(form).find("select");
      $(form).submit(function() {
        var data, r;
        if (ckEditor === null) {
          ckEditor = CKEDITOR.inline(id_content);
        }
        data = $(form).serializeArray();
        data.push({
          'name': 'description',
          'value': ckEditor.getData()
        });
        r = $.post(form.action, data);
        r.success(function(data) {
          var border_color, btn;
          TaskEditor.clear_complexity(task_id);
          $("#" + task_id).toggleClass(select[0].value, true);
          $("#" + task_id + " .info").html(data);
          btn = $("\#" + task_id).find(".turn-edit-on-btn");
          btn.show("fast");
          border_color = $("#" + task_id).css("border-color");
          return $("#" + task_id).animate({
            "border-color": "green"
          }, 500).animate({
            "border-color": border_color
          }, 500);
        });
        r.fail(function(data) {
          var border_color;
          TaskEditor.restore_style(submit);
          border_color = $("#" + task_id).css("border-color");
          return $("#" + task_id).animate({
            "border-color": "red"
          }, 500).animate({
            "border-color": border_color
          }, 500);
        });
        return false;
      });
    }

    return TaskEditor;

  })();

  window.TaskEditor = TaskEditor;

  window.LabTask = LabTask;

  window.LabEditor = LabEditor;

}).call(this);
