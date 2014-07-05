from django import template
from django.template.loader import render_to_string

register = template.Library()


@register.simple_tag(takes_context=True)
def file_upload_form(context, save_dir):
    return render_to_string("file_browser/file_upload_form.html", {
        'path': save_dir,
    }, context)


@register.simple_tag()
def file_upload_form_bind_ckeditor(ckEditorVariable):
    return "if (FileUploadForm) { var uploadForm = new FileUploadForm({ editor: %s }); }" % ckEditorVariable
