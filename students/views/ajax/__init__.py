import StringIO

from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_GET
import xlsxwriter

from students.models import Group


@require_GET
def xlsx(request):
    if 'year' in request.GET:
        year = request.GET['year']
    else:
        return HttpResponseBadRequest("'year' param is not set")

    groups = Group.year_groups(year)

    # Create an in-memory output file for the new workbook.
    output = StringIO.StringIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})

    row_offset = 1
    max_width = 0

    for g in groups.all().order_by("title"):
        worksheet = workbook.add_worksheet(g.title)
        row = 0
        for s in g.students.all().order_by("second_name", "name"):
            name = "%s %s" % (s.second_name, s.name)
            worksheet.write(row_offset + row, 0, name)
            if len(name) > max_width:
                max_width = len(name)
            row += 1
        worksheet.set_column(0, 0, max_width)
        worksheet.set_column(1, 24, 2)

    # Close the workbook before streaming the data.
    workbook.close()

    # Rewind the buffer.
    output.seek(0)

    # Construct a server response.
    response = HttpResponse(output.read(), content_type="application/xlsx")
    response['Content-Disposition'] = 'attachment; filename=%s.xlsx' % year
    return response