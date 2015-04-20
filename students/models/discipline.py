# coding=utf-8
from colour import Color
from django.db import models
import io
import json
import xlsxwriter
from app.utils import json_encoder
from students.models.mark import Mark
import students.utils


class Discipline(models.Model):
    """
    дисциплина
    """
    title = models.CharField(max_length=50, default='')
    year = models.IntegerField(default=students.utils.current_year())
    semestr = models.SmallIntegerField(default=students.utils.current_semestr())
    visible = models.BooleanField(default=False)

    @staticmethod
    def ignore_lesson(lesson):
        from students.models.lesson import Lesson

        return lesson['si'] or lesson['lt'] == Lesson.LESSON_TYPE_EXAM

    @staticmethod
    def compute_marks(student_marks, lessons=None):
        from students.models.lesson import Lesson

        s = 0

        if lessons is None:
            raise Exception("lessons is not defined")

        lessons_count = 0
        for i, m in enumerate(student_marks, 1):
            mark = m['m']
            if not Discipline.ignore_lesson(lessons[i - 1]):
                lessons_count += 1

            # оценка за экзамен не влияет на общий бал
            if lessons[i - 1]['lt'] == Lesson.LESSON_TYPE_EXAM:
                continue

            if mark is not None:
                if mark == Mark.MARK_BLACK_HOLE:  # черная дыра сжирает все старые достижнения
                    if s > 0:
                        s = 0
                elif mark == Mark.MARK_SHINING:  # сияние дарует 100% достижнения
                    if s < lessons_count * 3:
                        s = lessons_count * 3
                    elif i == len(
                            student_marks):  # а если в самом конце и у студента не меньше 100 дарует 1000 балов :D
                        s = lessons_count * 30 + float(lessons_count * 30) / 70 * 27
                elif mark == Mark.MARK_MERCY:
                    if s < 0:
                        s = 0
                elif mark == Mark.MARK_KEEP:
                    pass
                else:
                    s += mark
        return s

    @staticmethod
    def compute_percents(student_marks, lessons=None):
        _sum = Discipline.compute_marks(student_marks, lessons)
        lessons_count = len(filter(lambda x: not Discipline.ignore_lesson(x), lessons)) if lessons else len(
            student_marks)
        max = lessons_count * 3
        min = lessons_count * -2
        base = 0.3
        if _sum == 0:
            out = base
        elif _sum > 0:
            out = base + (float(_sum) / max) * (1 - base)
        else:
            out = base - (float(_sum) / min) * base
        return out


    def __unicode__(self):
        return u"%s %s %s" % (self.title, self.year, self.semestr)

    def marks(self, group_id):
        from students.models.group import Group
        from students.models.lesson import Lesson

        query = """
SELECT s.id as student_id, l.lesson_id, date, sm.id as id, mark
FROM students_student s
  LEFT JOIN (SELECT id as lesson_id, date, multiplier
        FROM students_lesson sl
        WHERE group_id = %(group_id)d and discipline_id = %(discipline_id)d) l ON 1 = 1
  LEFT JOIN students_mark sm ON l.lesson_id = sm.lesson_id and s.id = sm.student_id
WHERE s.group_id = %(group_id)d and l.lesson_id is not NULL
  ORDER BY s.id, l.date, l.lesson_id
      """ % {
            'group_id': int(group_id),
            'discipline_id': int(self.id)
        }

        marks = list(Mark.objects.raw(query))

        marks = list([{"sid": m.student_id,
                       "mid": m.id,
                       "lid": m.lesson_id,
                       "m": m.mark} for m in marks])

        # занятия у группы по дисциплине
        lessons = list(Lesson.objects.filter(group__pk=group_id, discipline__id=self.pk)
                       .order_by("date", "id"))
        lessons = list([{"id": l.id,
                         "lt": l.lesson_type if l.lesson_type else None,
                         "dt": l.date,
                         "k": l.multiplier,
                         "dn": l.description.rendered,
                         "dn_raw": l.description.raw,
                         'si': l.score_ignore,
                         'icn_id': l.icon.id if l.icon else '',
                         'icn_url': l.icon.url if l.icon else '',
                         'icn_fld_id': l.icon.folder.id if l.icon else '',
                         } for l in lessons])

        group = Group.objects.filter(pk=group_id).first()
        if not group:
            return None

        # студенты группы
        stdnts = group.students.all().order_by("second_name")
        stdnts = list([s.to_dict() for s in stdnts])
        for s in stdnts:
            # формируем оценки для студентов
            s_marks = list(filter(lambda m: m['sid'] == s['id'], marks))
            s_sum = Discipline.compute_marks(s_marks, lessons)
            s.update({
                'marks': s_marks,
                'sum': s_sum
            })


        # виды занятий
        lesson_types = list([{'id': t[0], 'title': t[1]} for t in Lesson.LESSON_TYPES])
        # виды оценок
        mark_types = list([{'k': t[0], 'v': t[1]} for t in Mark.MARKS])

        # формируем ответ
        return json.dumps({'lessons': lessons,
                           'students': stdnts,
                           'lesson_types': lesson_types,
                           'mark_types': mark_types, }, default=json_encoder)


class DisciplineMarksCache(models.Model):
    discipline = models.ForeignKey("Discipline", null=True, default=None)
    group = models.ForeignKey("Group", null=True, default=None)
    marks_json = models.TextField(default="")
    marks_excel = models.BinaryField(null=True)

    class Meta:
        index_together = [
            ["discipline", "group"],
        ]

    @staticmethod
    def get(discipline_id, group_id):
        val = DisciplineMarksCache.objects.filter(discipline_id=discipline_id, group_id=group_id).first()
        if not val or val.marks_json == u'[]' or val.marks_excel is None:
            val = DisciplineMarksCache.update(discipline_id, group_id)
        return val

    @staticmethod
    def get_json(discipline_id, group_id):
        val = DisciplineMarksCache.get(discipline_id, group_id)
        return val.marks_json

    @staticmethod
    def get_excel(discipline_id, group_id):
        val = DisciplineMarksCache.get(discipline_id, group_id)
        return val.marks_excel


    @staticmethod
    def update(discipline_id, group_id):
        """
        Обновляет кеш таблицы оценок для пары дисциплина группа
        :param discipline_id:
        :param group_id:
        """
        from students.models.group import Group

        if not Group.objects.filter(pk=group_id).exists():
            return None

        val = DisciplineMarksCache.objects.filter(discipline_id=discipline_id, group_id=group_id).first()
        if val is None:
            val = DisciplineMarksCache()
            val.discipline_id = discipline_id
            val.group_id = group_id
        d = Discipline.objects.get(pk=discipline_id)
        marks = d.marks(group_id)

        val.marks_json = json.dumps(marks)
        excel = val._marks_to_excel(json.loads(json.loads(val.marks_json)))

        val.marks_excel = '' if isinstance(excel, str) else excel.getvalue()

        val.save()

        return val

    @staticmethod
    def _marks_to_excel(data):
        """
        :type discipline: students.models.Discipline
        :type group: students.models.Group
        """
        from students.models.group import Group
        # data = json.loads(json.loads(DisciplineMarksCache.get(discipline.pk, group.pk)))

        lessons = data['lessons']
        students = data['students']
        mark_types = data['mark_types']
        lesson_types = data['lesson_types']

        group = None
        if len(students) > 0:
            group = Group.objects.filter(pk=students[0]['group']).first()
        else:
            return ''

        students.sort(key=lambda s: s['sum'], reverse=True)

        # Create an in-memory output file for the new workbook.
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})
        frmt_student = workbook.add_format()
        frmt_student.set_border()
        frmt_student.set_align('center')
        frmt_student.set_align('vcenter')
        frmt_student.set_rotation(90)
        frmt_student.set_text_wrap()

        frmt_header = workbook.add_format()
        frmt_header.set_border()
        frmt_header.set_align('center')
        frmt_header.set_align('vcenter')
        frmt_header.set_text_wrap()

        worksheet = workbook.add_worksheet(u"{}".format(group.title if group else u'студенты'))

        bg_colors = {
            # Mark.MARK_ABSENT: "#ffeeee",
            Mark.MARK_NORMAL: "#aef28c",
            Mark.MARK_GOOD: "#aef28c",
            Mark.MARK_EXCELLENT: "#4bb814",
            Mark.MARK_AWESOME: "#388a0f",
            Mark.MARK_FANTASTIC: "#255c0a",
            Mark.MARK_INCREDIBLE: "#3a4408",
            Mark.MARK_BLACK_HOLE: "black",
            Mark.MARK_SHINING: "yellow",
        }

        mark_formats = {}
        lesson_formts = {}

        # Подготовка стилей
        for lt in lesson_types:
            frmt = workbook.add_format()
            frmt.set_align('center')
            frmt.set_align('vcenter')
            frmt.set_text_wrap()
            frmt.set_border()

            if lt['id'] >= 2:
                bg_color = Color(bg_colors[Mark.MARK_NORMAL])
                bg_color.set_hue({
                                     2: 0.15,
                                     3: 0.5,
                                     4: 0.6,
                                     5: 0.8
                                 }.get(lt['id'], bg_color.get_hue()))

                frmt.set_bg_color(bg_color.get_hex_l())

            lesson_formts[lt['id']] = frmt

            for mt in mark_types:
                if mark_formats.get(lt['id']) is None:
                    mark_formats[lt['id']] = {}
                frmt = workbook.add_format()
                frmt.set_align('center')
                frmt.set_align('vcenter')
                frmt.set_border()

                bg_color = bg_colors.get(mt['k'], 'white')

                color = {
                    Mark.MARK_BLACK_HOLE: 'white',
                    Mark.MARK_AWESOME: 'white',
                    Mark.MARK_EXCELLENT: 'white',
                    Mark.MARK_FANTASTIC: 'white',
                    Mark.MARK_INCREDIBLE: 'white',
                }.get(mt['k'], 'black')

                bg_color = Color(bg_color)
                color = Color(color)

                if mt['k'] > 0:
                    if lt['id'] == 2:
                        bg_color.set_hue(0.15)
                        bg_color.set_luminance(min(bg_color.get_luminance() * 1.4, 0.9))
                    elif lt['id'] == 3:
                        bg_color.set_hue(0.5)
                        bg_color.set_luminance(min(bg_color.get_luminance() * 1.1, 0.9))
                    elif lt['id'] == 4:
                        bg_color.set_hue(0.6)
                        bg_color.set_luminance(min(bg_color.get_luminance() * 1.1, 0.9))
                    elif lt['id'] == 5:
                        bg_color.set_hue(0.8)
                        bg_color.set_luminance(min(bg_color.get_luminance() * 1.1, 0.9))
                    else:
                        bg_color.set_hue(0.25)

                bg_color = {
                    Mark.MARK_SHINING: Color(bg_colors[Mark.MARK_SHINING]),
                    Mark.MARK_BLACK_HOLE: Color(bg_colors[Mark.MARK_BLACK_HOLE]),
                }.get(mt['k'], bg_color)

                frmt.set_bg_color(bg_color.get_hex_l())
                frmt.set_color(color.get_hex_l())

                mark_formats[lt['id']][mt['k']] = frmt

        # заполнение строки занятий
        worksheet.set_row(0, 90)
        for r, l in enumerate(lessons, 2):
            worksheet.write(r, 0, l['dn_raw'].strip(), lesson_formts[l['lt']])
            h = 20 * max(1, l['dn_raw'].strip().count("\n") + 1)
            worksheet.set_row(r, h)

        # заполнение таблицы оценок
        max_width = 1
        for c, s in enumerate(students, 1):
            name = "%s %s" % (s['second_name'], s['name'])
            score = Discipline.compute_percents(s['marks'], lessons=lessons)
            score = "{score} / {percents}%".format(**{
                'percents': int(score * 100),
                'score': s['sum'],
            })

            # ячейка имени
            worksheet.write(0, c, name, frmt_student)
            worksheet.write(1, c, score, frmt_header)
            # заполняем оценки
            marks = s['marks']
            for r, m in enumerate(marks, 2):
                if m['m'] is not None:
                    if abs(m['m']) > Mark.MARK_SPECIAL:
                        mark = {
                            Mark.MARK_BLACK_HOLE: u'∅',
                            Mark.MARK_SHINING: u'∞',
                            Mark.MARK_MERCY: u'○',
                            Mark.MARK_KEEP: u'=',
                        }.get(m['m'], '')
                    else:
                        mark = u'н' if m['m'] == -2 else m['m']
                else:
                    mark = ''

                lt = lessons[r - 2]['lt']
                worksheet.write(r, c, mark,
                                mark_formats[lt].get(0 if m['m'] is None else m['m'], None))

            if len(name) > max_width:
                max_width = len(name)

        # декоративные улучшения
        worksheet.set_column(0, 0, max_width)
        worksheet.merge_range('A1:A2', group.title, frmt_header)

        # print setup
        if len(lessons) < len(students):
            worksheet.set_landscape()

        worksheet.fit_to_pages(1, 1)

        # Close the workbook before streaming the data.
        workbook.close()

        # Rewind the buffer.
        output.seek(0)

        return output
