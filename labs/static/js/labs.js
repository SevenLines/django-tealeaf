(function(){var t,e,n;e=function(){function t(e){var n,i,r;this.id=e,n=$("#task"+e),r=n.find(".task-edit"),i=n.find(".task-edit-option"),i.find("a").click(function(){return t.hide_all(),r.slideDown("fast"),!1}),r.find("form").ajaxForm({success:function(i){var r;return console.log("hi"),n.replaceWith(i),r=new t(e)}}),$(document).mouseup(function(e){return r.is(e.target)||0!==r.has(e.target).length||i.is(e.target)||0!==i.has(e.target).length?void 0:t.hide_all()})}return t.hide_all=function(){return $(".task-edit").hide()},t}(),t=function(){function t(e,n){var i,r;i=t.create_ckEditor(n),r=$("#"+e).find("form.lab-save")[0],$(r).submit(function(){var t,n;return t=$(r).serializeArray(),console.log(r.action),t.push({name:"description",value:i.getData()}),n=$.post(r.action,t),n.success(function(){return $("#"+e).toggleClass("bg-success",!0),setTimeout(function(){return $("#"+e).toggleClass("bg-success",!1)},1e3)}),n.fail(function(){return $("#"+e).toggleClass("bg-danger",!0),setTimeout(function(){return $("#"+e).toggleClass("bg-danger",!1)},1e3)}),!1})}return t.clear_complexity=function(t){return $("#"+t).removeClass()},t.create_ckEditor=function(t){var e,n;return e=CKEDITOR.inline(""+t),FileUploadForm&&(n=new FileUploadForm({editor:e})),e},t}(),n=function(){function t(e,n){var i,r,o,s;return i=null,$("#"+e).find(".turn-edit-on-btn").click(function(){return $(this).hide("fast"),$("#"+n).attr("contenteditable",!0),i=t.create_ckEditor(n)}),r=$("#"+e).find("form.save"),0===r.size()?void console.log("#"+e+" form.save didn't find"):(r=r[0],s=$(r).find("button"),o=$(r).find("select"),void $(r).submit(function(){var a,l;return null===i&&(i=CKEDITOR.inline(n)),a=$(r).serializeArray(),a.push({name:"description",value:i.getData()}),l=$.post(r.action,a),l.success(function(n){var i;return t.clear_complexity(e),$("#"+e).toggleClass(o[0].value,!0),$("#"+e+" .info").html(n),i=$("#"+e).find(".turn-edit-on-btn"),i.show("fast"),$("#"+e+" .edit").toggleClass("bg-success",!0),setTimeout(function(){return $("#"+e+" .edit").toggleClass("bg-success",!1)},1e3)}),l.fail(function(){return t.restore_style(s),$("#"+e+" .edit").toggleClass("bg-danger",!0),setTimeout(function(){return $("#"+e+" .edit").toggleClass("bg-danger",!1)},1e3)}),!1}))}return t.restore_style=function(t){return t.toggleClass("btn-warning",!1),t.toggleClass("btn-success",!1)},t.clear_complexity=function(t){return $("#"+t).removeClass()},t.create_ckEditor=function(t){var e,n;return e=CKEDITOR.inline(t),FileUploadForm&&(n=new FileUploadForm({editor:e})),e},t}(),window.TaskEditor=n,window.LabTask=e,window.LabEditor=t}).call(this);