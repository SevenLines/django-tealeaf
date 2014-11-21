(function () {

    window.LabsTree = function (data) {

        var self = this;
        self.lastNode = null;

        self.urls = {
            tasks: {
                update: data.urls.tasks.update
            },
            labs: {
                update: data.urls.labs.update,
                list: data.urls.labs.list
            },
            tree: data.urls.tree
        };

        var labs_preview = $("#labs-preview");
        var tree = $("#tree");
        var labs_tree = $("#labs-tree");


        function InitTree() {
            // настройка дерева
            labs_tree.jstree({
                "core": {
                    "check_callback": function (op, node, node_parent) {
                        if (op == 'move_node') {
                            if (node.data.lab_id && node_parent.data.discipline_id
                                || node.data.task_id && node_parent.data.lab_id) {
                                return true;
                            }
                            return false;
                        }
                    },
                    "multiple": false
                },
                "dnd": {
                    inside_pos: "last",
                    is_draggable: function (info) {
                        if (info[0].data.lab_id) {
                            return true;
                        }
                    }
                },
                "plugins": ["dnd", "wholerow", "state"]
            }).on("move_node.jstree", function (e, info) {
                if (info.node.data.lab_id) { // если перетаскиваем лабу
                    var discipline_id = $("#" + info.node.parent)[0].dataset.discipline_id;
                    $.post(self.urls.labs.update, {
                        pk: info.node.data.lab_id,
                        position: info.position,
                        discipline_id: discipline_id,
                        csrfmiddlewaretoken: $.cookie("csrftoken")
                    }).done(function () {
                        InterfaceAlerts.showSuccess();
                    }).fail(function () {
                        InterfaceAlerts.showFail();
                    })
                }
                if (info.node.data.task_id) { // если перетаскиваем задание
                    var lab_id = $("#" + info.node.parent)[0].dataset.lab_id;
                    $.post(self.urls.tasks.update, {
                        pk: info.node.data.task_id,
                        position: info.position,
                        lab_id: lab_id,
                        csrfmiddlewaretoken: $.cookie("csrftoken")
                    }).done(function () {
                        InterfaceAlerts.showSuccess();
                    }).fail(function () {
                        InterfaceAlerts.showFail();
                    })
                }
            }).on("select_node.jstree", function (e, info) {
                self.previewLabs(info.node);
            });
        }

        self.previewLabs = function (node) {
            var request;
            if (node.data.lab_id) {
                request = {
                    lab_id: node.data.lab_id
                }
            } else if (node.data.discipline_id) {
                request = {
                    discipline_id: node.data.discipline_id
                }
            } else {
                return;
            }
            request.csrfmiddlewaretoken = $.cookie("csrftoken");
            $.post(self.urls.labs.list, request).done(function (r) {
                $("#labs-preview").html(r);
                self.lastNode = node;
            }).fail(function () {
                InterfaceAlerts.showFail();
            });
        };

        self.Init = function () {
            //$(window).on("scroll", function (e) {
            //    $("#tree").css("margin-top", $(this).scrollTop());
            //});
            InitTree();
        };

        self.ReloadTree = function () {
            $.get(self.urls.tree).done(function (response) {
                labs_tree.jstree("destroy");
                labs_tree.html(response);
                InitTree();
            });
        };

        self.Init();

        // добавление задачи и удаление лабы
        labs_preview.on("click", ".form-button", function () {
            MethodPostDataset(this, {
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).success(function () {
                InterfaceAlerts.showSuccess();
                self.previewLabs(self.lastNode);
                self.ReloadTree();
            });
        });

        // добавление лабы
        tree.on("submit", "#form-lab-add", function () {
            var discipline_id;
            if (self.lastNode) {
               discipline_id = self.lastNode.data.discipline_id;
            }
            $.post(this.action, {
                csrfmiddlewaretoken: $.cookie("csrftoken"),
                title: this.title.value,
                description: this.title.description,
                discipline_id: discipline_id
            }).done(function () {
                console.log(self.lastNode);
                self.ReloadTree();
            });
            return false;
        });

        // смена сложности задачи
        labs_preview.on("click", ".menu-complexity-item", function () {
            var task = $(this).parents(".task.item");

            task.removeClass(task[0].dataset.complexity);
            task[0].dataset.complexity = this.dataset.value;
            task.addClass(this.dataset.value);
        });

        // сохранение задачи
        labs_preview.on("click", "a.save", function () {
            var task = $(this).parents(".task.item");
            console.log(self.urls.tasks.update);

            $.post(self.urls.tasks.update, {
                pk: task[0].dataset.id,
                complexity: task[0].dataset.complexity,
                description: task.find(".description").html(),
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).done(function () {
                InterfaceAlerts.showSuccess();
            }).fail(function () {
                InterfaceAlerts.showFail();
            });

            return false;
        });

        // удаление задачи
        labs_preview.on("click", "a.remove", function () {

            $.get(this.href).done(function () {
                InterfaceAlerts.showSuccess();
                self.previewLabs(self.lastNode);
            }).fail(function () {
                InterfaceAlerts.showFail();
            });

            return false;
        });

    };
})();


