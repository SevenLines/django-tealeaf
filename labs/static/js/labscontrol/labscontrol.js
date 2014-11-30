(function () {

    function Task(lab, data) {
        var self = this;

        self.lab = lab;
        self.pk = data.id;
        self.users = ko.observableArray(data.users);

        self.description = ko.observable(data.description);
        self.complexity = ko.observable(data.complexity);

        self.base_values = {
            description: ko.observable(data.description),
            complexity: ko.observable(data.complexity),
            users: ko.observableArray(data.users)
        };

        self.changed = ko.pureComputed(function () {
            var users_eq = JSON.stringify(self.users()) == JSON.stringify(self.base_values.users());
            return !users_eq || self.description() != self.base_values.description() ||
                self.complexity() != self.base_values.complexity()
        });

        self.reset = function () {
            self.base_values.description(self.description());
            self.base_values.complexity(self.complexity());
            self.base_values.users(self.users());
        };

        self.setComplex = function (value) {
            self.complexity(value[0]);
        };

        self.complex_css = ko.pureComputed(function () {
            for (var i = 0; i < lab.model.complex_choices().length; ++i) {
                var c = lab.model.complex_choices()[i];
                if (c[0] == self.complexity()) {
                    return c[1];
                }
            }
            return '';
        });

        self.Save = function (action) {
            $.post(action, {
                pk: self.pk,
                description: self.description(),
                complexity: self.complexity(),
                users: self.users().map(function (i) {
                    return i.id
                }),
                remove_users: self.users().length == 0 ? 1 : 0,
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).done(function () {
                self.reset();
                console.log(self.complexity());
                lab.tasks.sort(function (left, right) {
                    if (left.complexity() == right.complexity()) {
                        return left.pk == right.pk ? 0 : left.pk < right.pk ? -1 : 1;
                    } else {
                        return left.complexity() < right.complexity() ? -1 : 1;
                    }

                });
            });
        };

        self.Remove = function (i, event) {
            lab.model.modalConfirm.message("<h2>Удалить задачу:</h2>" + self.description());
            lab.model.modalConfirm.show(function () {
                $.post(lab.model.urls.tasks.remove, {
                    pk: self.pk,
                    csrfmiddlewaretoken: $.cookie("csrftoken")
                }).done(function () {
                    lab.tasks.remove(self);
                })
            });
        }
    }

    function Lab(model, data) {
        var self = this;

        self.model = model;
        self.pk = data.id;
        self.tasks = ko.observableArray([]);
        self.description = ko.observable(data.description);
        self.title = ko.observable(data.title);

        self.Init = function (data) {
            self.tasks.removeAll();

            var i = 0;
            function add_task() {
                if (i < data.tasks.length) {
                    self.tasks.push(new Task(self, data.tasks[i]));
                    ++i;
                    setTimeout(add_task, 0);
                }
            }
            if (data.tasks.length > 0) {
                add_task();
            }
        };

        function getLab(el) {
            return $(el).parents(".lab")[0];
        }

        self.Save = function (i, event) {
            var el = event.currentTarget;
            var action = el.dataset.action;

            self.tasks().every(function (item) {
                if (item.changed()) {
                    item.Save(model.urls.tasks.update);
                }
                return true;
            });

            $.post(action, {
                title: self.title(),
                pk: self.pk,
                description: self.description(),
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).done(function () {
                InterfaceAlerts.showSuccess();
            })
        };

        self.AddTask = function () {
            $.post(model.urls.tasks.add, {
                lab_id: self.pk,
                description: "...",
                csrfmiddlewaretoken: $.cookie("csrftoken")
            }).done(function (r) {
                self.tasks.push(new Task(self, r));
                //new Task()
                //model.previewLabs();
                //model.ReloadTree();
            });
        };

        self.Remove = function () {
            model.modalConfirm.message("Удалить лабораторную?<h2>" + self.title() + "</h2>");
            model.modalConfirm.show(function () {
                $.post(model.urls.labs.remove, {
                    pk: self.pk,
                    csrfmiddlewaretoken: $.cookie("csrftoken")
                }).done(function () {
                    //model.previewLabs();
                    model.labs.remove(self);
                    model.ReloadTree();
                })
            })
        };

        self.Init(data);
    }

    window.LabsTree = function (data) {

        var self = this;

        self.labs = ko.observableArray();
        self.cool = ko.observable("cool");

        self.lastNode = null;
        self.lastNodeID = null;
        self.visible = ko.observable(true);

        self.urls = {
            tasks: {
                update: data.urls.tasks.update,
                users: data.urls.tasks.users,
                add: data.urls.tasks.add,
                remove: data.urls.tasks.remove
            },
            labs: {
                update: data.urls.labs.update,
                remove: data.urls.labs.remove,
                list_json: data.urls.labs.list_json
            },
            tree: data.urls.tree
        };
        self.ckeditor_config = data.ckeditor_config;
        self.modalConfirm = new ModalConfirm({variable_name: "modalConfirm"});

        var labs_preview = $("#labs-preview");
        var tree = $("#tree");
        var labs_tree = $("#labs-tree");
        self.complex_choices = ko.observableArray();

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
                        self.previewLabs(self.lastNode);
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
            if (!node && self.lastNode) {
                node = self.lastNode;
            }

            if (!node) {
                return false;
            }
            self.visible(false);
            $.get(self.urls.labs.list_json, {
                discipline_id: node.data.discipline_id,
                lab_id: node.data.lab_id
            }).done(function (r) {
                self.labs.removeAll();
                self.complex_choices(r.complex_choices);

                var i = 0;

                function add_lab() {
                    if (i < r.labs.length) {
                        self.labs.push(new Lab(self, r.labs[i]));
                        ++i;
                        setTimeout(add_lab, 0);
                    } else {
                        self.lastNode = node;
                    }
                }
                if (r.labs.length > 0) {
                    add_lab();
                }
            }).always(function () {
                self.visible(true);
            });
        };

        self.Init = function () {
            $(window).on("scroll", function (e) {
                $("#tree-holder").css("top", $(this).scrollTop());
            });

            InitTree();

            var node = labs_tree.jstree("get_node", localStorage.lastNodeID);
            if (node) {
                labs_tree.jstree("close_all");
                if (node) {
                    labs_tree.jstree("open_node", node);
                } else {
                    labs_tree.jstree("open_all");
                }
                self.previewLabs(node);
            }
        };

        self.ReloadTree = function () {
            $.get(self.urls.tree).done(function (response) {
                labs_tree.jstree("destroy");
                labs_tree.html(response);
                InitTree();
            });
        };

        self.Init();

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
    };

})();

