function ModalConfirm(data) {
//
// Modal form should be bind to the bootstrap modal html:
//
// <div id="main-modal-form" class="modal fade" role="dialog" data-bind="with: modalConfirm">
//    <div class="modal-dialog">
//        <div class="modal-content">
//            <div class="modal-header" data-bind="text: header"></div>
//            <div class="modal-body" data-bind="text: value"> </div>
//            <div class="modal-footer">
//                <button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">Yes</button>
//                <button type="button" class="btn btn-default" data-decline data-dismiss="modal">No</button>
//            </div>
//            <div>
//            </div>
//        </div>
//    </div>
// </div>
//
// create new field in model:
//
//      self.modalConfirm = new ModalConfirm({ modal_selector: "#main-modal-form" })
//
// auto generated modal (require variable_name to be passed and modal_selector should be omitted):
//
//      self.modalConfirm = new ModalConfirm({ variable_name: "modalConfirm" })
//
// call to show dialog:
//
//      self.modalConfirm.show(function() { console.log("Yes") }, function() { console.log("No") })
//
// You can omit second argument and implement only confirm event.
// click on button with "data-confirm" attribute bind to confirm event (first param in show function)
// click on button with "data-decline" attribute bind to decline event (second param in show function)
//

    data = data ? data : {};

    if (data.prototype) {
        return;
    }

    var self = this;

    self.modal_selector = data.modal_selector;
    self.message = ko.observable(data.message);
    self.header = ko.observable(data.header);
    self.variable_name = data.variable_name;

    self.label = { // labels text
        yes: 'Да',
        no: 'Нет'
    };

    self.custom_modal_body = data.custom_modal_body ? data.custom_modal_body : ''; // for extending purposes

    self.callback_confirm = null;
    self.callback_decline = null;

    self._generate_modal = function () {

        if (self.variable_name == null) {
            console.error("One should pass variable_name to use autogenerate modal:\n" +
                "var modalForm = new ModalConfirm({variable_name: 'modalForm'})");
            return;
        }

        var id = 'modal-' + self.variable_name;

        $("#"+id).remove();

        var html = '<div id="' + id + '" class="modal fade" role="dialog" ' +
            'data-bind="with: ' + self.variable_name + '">' + // change knockout context with 'with'
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header" data-bind="text: header"></div>' + // header variable
            '<div class="modal-body">' +
            '<span data-bind="html: message"></span>' // message variable
            + self.custom_modal_body + // some custom content for extending purposes
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-decline data-dismiss="modal">'
            + self.label.no + // label for decline button
            '</button>' +
            '<button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">'
            + self.label.yes + // label for confirm button
            '</button>' +
            '</div></div></div></div>';
        $('body').prepend(html); // add content

        return "#" + id;
    };

    self.init = function () {
        if (self.modal_selector == null) {
            self.modal_selector = self._generate_modal();
        }

        $(self.modal_selector).find("[data-confirm]").unbind("click");
        $(self.modal_selector).find("[data-confirm]").click(function () {
            if (self.callback_confirm)
                self.callback_confirm();
        });

        $(self.modal_selector).find("[data-decline]").unbind("click");
        $(self.modal_selector).find("[data-decline]").click(function () {
            if (self.callback_decline)
                self.callback_decline();
        })
    };

    self.show = function (callback_confirm, callback_decline) {
        self.callback_confirm = callback_confirm === undefined ? null : callback_confirm;
        self.callback_decline = callback_decline === undefined ? null : callback_decline;
        $(self.modal_selector).modal("show");
    };

    self.init();
}