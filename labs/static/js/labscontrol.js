(function () {

    window.LabsTree = function (data) {

        var self = this;
        self.lastNode = null;
        self.lastNodeID = null;

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

            //labs_tree.jstree("open_all");
            var node = labs_tree.jstree("get_node", localStorage.lastNodeID);
            labs_tree.jstree("close_all");
            if (node) {
                labs_tree.jstree("open_node", node);
            }else {
                labs_tree.jstree("open_all");
            }
            self.previewLabs(node);
        }

        self.previewLabs = function (node) {
            var request;
            if (node == null || node.data == null) {
                labs_preview.html("<h2>Ничего не выбрано</h2>");
                return;
            }
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
                labs_preview.html(r);
                self.lastNode = node;
                localStorage.lastNodeID = node.id;
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

        //  удаление лабы
        labs_preview.on("click", ".form-button-remove-lab", function () {
            MethodPostDataset(this, {
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).success(function () {
                InterfaceAlerts.showSuccess();
                self.previewLabs(self.lastNode);
                self.ReloadTree();
            });
        });

        // добавление задачи
        labs_preview.on("click", ".form-button-add-task", function () {
            MethodPostDataset(this, {
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).success(function () {
                InterfaceAlerts.showSuccess();
                self.previewLabs(self.lastNode);
                self.ReloadTree();
            });
        });

        // обновление лабы
        labs_preview.on("click", ".form-button-update-lab", function () {
            var description = $(this).parents(".lab").find(".lab-description").html();
            var title = $(this).parents(".lab").find(".lab-title").html();
            MethodPostDataset(this, {
                description: description,
                title: title,
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
                var parent_node = labs_tree.jstree("get_node", self.lastNode.parent);
                if (self.lastNode.data.discipline_id) {
                    discipline_id = self.lastNode.data.discipline_id;
                } else if (parent_node && parent_node.data.discipline_id) {
                    discipline_id = parent_node.data.discipline_id;
                }
            }
            $.post(this.action, {
                csrfmiddlewaretoken: $.cookie("csrftoken"),
                title: this.title.value,
                description: this.title.description,
                discipline_id: discipline_id
            }).done(function () {
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


