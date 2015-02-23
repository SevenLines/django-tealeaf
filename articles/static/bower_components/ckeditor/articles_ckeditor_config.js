/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (config) {
    config.extraPlugins = 'insertpre,saveme,div,image,sourcedialog,bootstrap-collapse,bootstrap-message,showblocks,justify,' +
    'divarea,colordialog,colorbutton,liststyle,eqneditor';
    config.floatSpaceDockedOffsetY = 10;
    config.allowedContent = {
      pre: {
          classes: ['linenums', 'prettyprint']
      }
    };

    config.toolbarGroups = [
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'links'},
        {name: 'insert'},
        {name: 'forms'},
        {name: 'tools'},
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'styles'},
        {name: 'colors'},
        {name: 'about'}
    ];
};
