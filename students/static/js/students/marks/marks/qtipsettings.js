/**
 * Created by m on 20.02.15.
 */
define(function () {
    return {
        content: {
            text: "",
            title: function () {
                return 'Занятие';
            }
        },
        position: {
            my: 'top center'
        },
        show: {
            solo: true,
            event: "click",
            effect: function () {
                $(this).fadeIn(120); // "this" refers to the tooltip
            }
        },
        hide: {
            fixed: true,
            event: null,
            effect: function () {
                $(this).fadeOut(120); // "this" refers to the tooltip
            }
        },
        style: {
            classes: 'qtip-bootstrap'
        },
        events: {
            show: function (event, api) {
                // подключаем форму к тултипу
                var tag = $("#template-lesson-edit");
                api.set('content.text', tag);

                // событие внутри формы не закрывает окно
                var that = this;
                $(that).on("click", function (event) {
                    event.stopPropagation();
                });

                // инициализируем календарь
                $(that).find(".lesson-date").pickmeup_twitter_bootstrap({
                    hide_on_select: true,
                    format: 'd/m/Y',
                    hide: function (e) {
                        $(this).trigger('change');
                    }
                });

                var clickEvent = function () {
                    $(that).unbind("click");
                    $(that).qtip("hide");
                };
                // события клика по кнопки сохранить
                $(that).find(".delete, .save").on("click", clickEvent);
                // событие клика вне формы
                $(document).one("click", clickEvent);
            }
        }
    }
});