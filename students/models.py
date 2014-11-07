# coding: utf-8
# Create your models here.
import StringIO
import io
import json

from django.db import models, transaction
from django.db.models.signals import post_delete, post_save
from django.db.transaction import atomic
from django.dispatch.dispatcher import receiver
from django.forms import model_to_dict
from django.http import HttpResponse
from markupfield.fields import MarkupField
from colour import Color
import xlsxwriter

from app.utils import json_encoder
import students.utils
from students.utils import current_year


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    ancestor = models.ForeignKey('self', null=True, default=None, blank=True, on_delete=models.SET_NULL)
    year = models.IntegerField(default=students.utils.current_year())
    captain = models.ForeignKey("Student", default=None, null=True,
                                on_delete=models.SET_NULL, related_name="%(class)s_captain")

    # kindness = models.FloatField(default=1)  # показатель доброжелательности группы от 0 до 1
    # erudition = models.FloatField(default=1)  # показатель эрудированность группы от 0 до 1

    def __unicode__(self):
        return "%s | %s" % (self.year, self.title)

    @staticmethod
    def year_groups(year):
        """
        return groups of specific year
        :param year: specific year
        :return:
        """
        return Group.objects.filter(year=year)

    @staticmethod
    def current_year_groups():
        """
        groups of current learning year
        :return:
        """
        return Group.year_groups(year=students.utils.current_year())

    @property
    def students(self):
        """
        students of this group
        use like this: some_group.students.all()
        :return:
        """
        return Group.objects.get(pk=self.pk).student_set

    @transaction.atomic
    def copy_to_next_year(self):
        g = Group.objects.get(pk=self.pk)
        g.pk = None
        g.year += 1
        g.ancestor = self
        g.save()
        for s in self.students.all():
            s.pk = None
            s.group = g
            s.save()

    @property
    def has_ancestor(self):
        return Group.objects.filter(ancestor=self.pk, year=self.year + 1).exists()

    def lessons(self, discipline):
        """
        lessons for current group for current discipline
        use like: lessons.all()
        :return:
        """
        lst = Mark.objects.filter(student__group=self.pk).values('lesson').distinct()
        return Lesson.objects.filter(pk__in=lst).distinct()


class Student(models.Model):
    name = models.CharField(max_length=50, default='')
    second_name = models.CharField(max_length=50, default='')
    group = models.ForeignKey(Group, null=True)

    phone = models.CharField(max_length=50, default='')
    email = models.EmailField(default='')
    vk = models.URLField(default='')

    photo = models.ImageField(upload_to="students", max_length=255, default='')

    def __unicode__(self):
        return "%s | %s" % (self.second_name, self.name)

    def to_dict(self, authenticated=False):
        excluded = ['phone', 'email', 'vk', 'photo'] if not authenticated else []
        return model_to_dict(self, exclude=excluded)

    @staticmethod
    def year_students(year):
        groups = Group.year_groups(year)
        return Student.objects.filter(groups__in=groups)

    @staticmethod
    def current_year_students():
        """
        students of current learning year
        :return:
        """
        return Student.year_students(current_year())

    def marks_for_discipline(self, discipline):
        assert isinstance(discipline, Discipline)
        return Mark.objects.filter(lesson__discipline=discipline, student=self)


class Discipline(models.Model):
    """
    дисциплина
    """
    title = models.CharField(max_length=50, default='')
    year = models.IntegerField(default=students.utils.current_year())
    semestr = models.SmallIntegerField(default=students.utils.current_semestr())

    @staticmethod
    def compute_marks(student_marks):
        s = 0
        for i, m in enumerate(student_marks, 1):
            mark = m['m']
            if mark is not None:
                if mark == Mark.MARK_BLACK_HOLE:  # черная дыра сжирает все старые достижнения
                    if s > 0:
                        s = 0
                elif mark == Mark.MARK_SHINING:  # сияние дарует 100% достижнения
                    if s < i * 3:
                        s = i * 3
                    elif i == len(student_marks):
                        s = i * 30 + float(i * 30) / 70 * 27
                else:
                    s += mark
        return s
        # return sum([m['m'] for m in student_marks if m['m']], 0)

    def __unicode__(self):
        return u"%s %s %s" % (self.title, self.year, self.semestr)

    def marks(self, group_id):
        marks = list(Mark.objects.raw("""
SELECT s.id as student_id, l.lesson_id, date, sm.id as id, mark
FROM students_student s
  LEFT JOIN (SELECT id as lesson_id, date, multiplier
        FROM students_lesson sl
        WHERE group_id = %(group_id)s and discipline_id = %(discipline_id)s) l ON true
  LEFT JOIN students_mark sm ON l.lesson_id = sm.lesson_id and s.id = sm.student_id
WHERE s.group_id = %(group_id)s and l.lesson_id is not NULL
  ORDER BY s.id, l.date, l.lesson_id
      """, {
            'group_id': group_id,
            'discipline_id': self.id
        }))

        marks = list([{"sid": m.student_id,
                       "mid": m.id,
                       "lid": m.lesson_id,
                       "m": m.mark} for m in marks])

        # студенты группы
        stdnts = Group.objects.get(pk=group_id).students.all().order_by("second_name")
        stdnts = list([s.to_dict() for s in stdnts])
        for s in stdnts:
            # формируем оценки для студентов
            s_marks = list(filter(lambda m: m['sid'] == s['id'], marks))
            s_sum = Discipline.compute_marks(s_marks)
            s.update({
                'marks': s_marks,
                'sum': s_sum
            })

        lessons = list(Lesson.objects.filter(group__pk=group_id, discipline__id=self.pk)
                       .order_by("date", "id"))
        lessons = list([{"id": l.id,
                         "lt": l.lesson_type if l.lesson_type else None,
                         "dt": l.date,
                         "k": l.multiplier,
                         "dn": l.description.rendered,
                         "dn_raw": l.description.raw
                        } for l in lessons])

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
    discipline = models.ForeignKey(Discipline, null=True, default=None)
    group = models.ForeignKey(Group, null=True, default=None)
    marks_json = models.TextField(default="")
    marks_excel = models.BinaryField(null=True)

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
        val = DisciplineMarksCache.objects.filter(discipline_id=discipline_id, group_id=group_id).first()
        if val is None:
            val = DisciplineMarksCache()
            val.discipline_id = discipline_id
            val.group_id = group_id
        d = Discipline.objects.get(pk=discipline_id)
        marks = d.marks(group_id)
        val.marks_json = json.dumps(marks)

        excel = val._marks_to_excel(json.loads(json.loads(val.marks_json)))

        val.marks_excel = excel.getvalue()

        val.save()

        return val

    @staticmethod
    def _marks_to_excel(data):
        """
        :type discipline: students.models.Discipline
        :type group: students.models.Group
        """
        # data = json.loads(json.loads(DisciplineMarksCache.get(discipline.pk, group.pk)))

        lessons = data['lessons']
        students = data['students']
        mark_types = data['mark_types']
        lesson_types = data['lesson_types']

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

        worksheet = workbook.add_worksheet(u"группа")

        mark_formats = {}
        for mt in mark_types:
            for lt in lesson_types:
                if mark_formats.get(lt['id']) is None:
                    mark_formats[lt['id']] = {}
                frmt = workbook.add_format()
                frmt.set_align('center')
                frmt.set_align('vcenter')
                frmt.set_border()

                color = 'white'
                if mt['k'] < 0:
                    color = "#ffeeee"
                elif mt['k'] > 0:
                    color = {
                        1: "#aef28c",
                        2: "#7eeb47",
                        3: "#4bb814",
                        4: "#388a0f",
                        5: "#255c0a",
                    }.get(mt['k'], 'white')

                color = Color(color)
                if lt['id'] == 2 and mt['k'] > 0:
                    color.set_hue(0)
                    color.set_luminance(min(color.get_luminance() * 1.3, 1))
                elif lt['id'] == 3 and mt['k'] > 0:
                    color.set_hue(0.5)
                    color.set_luminance(min(color.get_luminance() * 1.1, 1))

                frmt.set_bg_color(color.get_hex_l())

                mark_formats[lt['id']][mt['k']] = frmt

        worksheet.set_row(0, 90)
        for r, l in enumerate(lessons, 2):
            worksheet.write(r, 0, l['dn_raw'].strip(), frmt_header)
            h = 20 * max(1, l['dn_raw'].strip().count("\n") + 1)
            worksheet.set_row(r, h)

        max_width = 1

        score_max = len(lessons) * 3
        score_min = len(lessons) * -2
        score_base = 0.3

        for c, s in enumerate(students, 1):
            name = "%s %s" % (s['second_name'], s['name'])

            if s['sum'] == 0:
                score = score_base
            elif s['sum'] > 0:
                score = score_base + (float(s['sum']) / score_max) * (1-score_base)
            else:
                score = score_base - (float(s['sum']) / score_min) * score_base

            score = "{score} / {percents}%".format(**{
                'percents': int(score * 100),
                'score': s['sum'],
            })
            worksheet.write(0, c, name, frmt_student)
            worksheet.write(1, c, score, frmt_header)
            marks = s['marks']
            for r, m in enumerate(marks, 2):
                mark = 0 if m['m'] is None else m['m']
                lt = lessons[r-2]['lt']
                worksheet.write(r, c, mark, mark_formats[lt].get(mark, None))

            if len(name) > max_width:
                max_width = len(name)
        worksheet.set_column(0, 0, max_width)

        # Close the workbook before streaming the data.
        workbook.close()

        # Rewind the buffer.
        output.seek(0)

        return output


class Lesson(models.Model):
    """
    пара по некоторой дисциплине
    """

    LESSON_TYPES = [
        (1, "Пара"),
        (2, "Контрольная"),
        (3, "Экзамен"),
    ]

    description = MarkupField(default="", markup_type="textile", blank=True)

    discipline = models.ForeignKey(Discipline)
    group = models.ForeignKey(Group, null=True)
    date = models.DateField(auto_now_add=True)
    lesson_type = models.IntegerField(verbose_name="type", default=1, choices=LESSON_TYPES)
    multiplier = models.FloatField(default=1)

    def to_dict(self):
        d = model_to_dict(self)
        d.update({
            'description': self.description.rendered,
            'description_raw': self.description.raw,
        })
        return d

    def __unicode__(self):
        return u"%s %s (%s)" % (self.discipline, self.date, self.lesson_type)


    @staticmethod
    @atomic
    def create_lesson_for_group(group, discipline):
        """
        creates lesson with empty marks fields for group
        with current date and returns lesson on success or None on failure
        """
        assert isinstance(discipline, Discipline)
        assert isinstance(group, Group)

        l = Lesson(discipline=discipline)
        l.save()
        for s in group.students.all():
            m = Mark(lesson=l, student=s)
            m.save()
        return l


class Mark(models.Model):
    """
    оценка студента за пару
    """
    MARK_BASE = 0
    MARK_SPECIAL = 1000

    MARK_BLACK_HOLE = MARK_BASE - (MARK_SPECIAL + 1)
    MARK_ABSENT = MARK_BASE - 2
    MARK_EMPTY = MARK_BASE
    MARK_NORMAL = MARK_BASE + 1
    MARK_GOOD = MARK_BASE + 2
    MARK_EXCELLENT = MARK_BASE + 3
    MARK_AWESOME = MARK_BASE + 4
    MARK_FANTASTIC = MARK_BASE + 5
    MARK_SHINING = MARK_BASE + (MARK_SPECIAL + 1)

    MARKS = [
        # (MARK_NORMAL-3, 'terrible'),
        # (MARK_NORMAL-2, 'bad'),
        (MARK_BLACK_HOLE, 'black-hole'),
        (MARK_ABSENT, 'absent'),
        (MARK_EMPTY, 'empty'),  # без оценки
        (MARK_NORMAL, 'normal'),
        (MARK_GOOD, 'good'),
        (MARK_EXCELLENT, 'excellent'),
        (MARK_AWESOME, 'awesome'),
        (MARK_FANTASTIC, 'fantastic'),
        (MARK_SHINING, 'shining'),
        # (MARK_NORMAL + 6, 'godlike'),
    ]

    student = models.ForeignKey(Student)
    lesson = models.ForeignKey(Lesson)
    mark = models.SmallIntegerField(choices=MARKS, default=MARK_NORMAL)

    def __unicode__(self):
        return u"%s %s" % (self.student, self.mark)

    @staticmethod
    def get_for(group, discipline):
        return Mark.objects.filter(lesson__discipline=discipline, student__group=group).all()

    @staticmethod
    def get_for_id(group_id, discipline_id):
        return Mark.get_for(Group.objects.get(pk=group_id), Discipline.objects.get(pk=discipline_id))


def active_years(r=2):
    """
    returns list of active years like current year +-r
    :param r: range from current year [-r, r]
    :return:
    """
    years = Group.objects.all().values_list('year').distinct()
    if len(years) == 0:
        years = [current_year(), ]
    else:
        years = list(zip(*years)[0])

    _min = min(years)
    _max = max(years)
    for i in xrange(1, r + 1):
        years.insert(0, _min - i)
    for i in xrange(1, r + 1):
        years.append(_max + i)
    years.sort()
    return years


@receiver(post_delete, sender=Lesson)
@receiver(post_save, sender=Lesson)
def update_cache_lesson(instance, **kwargs):
    DisciplineMarksCache.update(instance.discipline_id, instance.group_id)


@receiver(post_delete, sender=Student)
@receiver(post_save, sender=Student)
def update_cache_student(instance, **kwargs):
    DisciplineMarksCache.objects.filter(group=instance.group_id).delete()
