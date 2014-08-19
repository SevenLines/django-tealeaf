function ModalConfirm(modal_selector, message) {

    //
    // modal form should be bind to the bootstrap modal form:
    //
    //    <div id="main-modal-form" class="modal fade modal_remove" role="dialog">
    //        <div class="modal-footer">
    //            <button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">Yes</button>
    //            <button type="button" class="btn btn-default" data-decline data-dismiss="modal">No</button>
    //        </div>
    //    </div>
    //
    // create new field in model:
    //
    //      self.modalConfirm = new ModalConfirm("#main-modal-form")
    //
    // Call to show dialog:
    //
    //      self.modalConfirm.show(function() { console.log("Yes pressed") }, function() { console.log("no") })
    //
    // You can omit second argument and implement only confirm event.
    // click on button with "data-confirm" attribute bind to confirm event (first param in show function)
    // click on button with "data-decline" attribute bind to decline event (second param in show function)
    //

    var self = this;
    self.message = ko.observable(message);

    self.callback_confirm = null;
    self.callback_decline = null;

    self.init_events = function () {
        $(modal_selector).find("[data-confirm]").click(function () {
            if (self.callback_confirm)
                self.callback_confirm();
        });
        $(modal_selector).find("[data-decline]").click(function () {
            if (self.callback_decline)
                self.callback_decline();
        })
    };

    self.show = function (callback_confirm, callback_decline) {
        self.callback_confirm = callback_confirm === undefined ? null : callback_confirm;
        self.callback_decline = callback_decline === undefined ? null : callback_decline;
        $(modal_selector).modal("show");
    };

    self.init_events();
}