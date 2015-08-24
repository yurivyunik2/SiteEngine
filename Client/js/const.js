﻿
define(["dataType"], function (DataType) {

  var Const = function () {

    var self;

    var LanguageList = [
      DataType.Language("English", "en", "EN"), 
      DataType.Language("Russian", "ru", "RU"),
      DataType.Language("Danish", "da", "DA"),
    ];
    var LanguageDefault = LanguageList[0];

    return {
      // APPLICATION
      SERVER: function() { return "http://localhost:8082/"; },
      APPLICATION_NAME: function() { return "myApp"; },
      APPLICATION_START_VIEW: function() { return "/Views/start"; },
      APPLICATION_START_PATH: function() { return "index.html#/Views/start"; },

      VIEW_GLOBAL_SELECTOR: function () { return ".dvNgView"; },

        // ITEMS
      TEMPLATES_ROOT_ID: function() { return 5; },
      LAYOUTS_ROOT_ID: function () { return 4; },
      DATA_TYPES_ROOT_ID: function () { return 337; },
      TEMPLATE_FIELD_ID: function() { return 148; },
      FOLDER_TEMPLATE_ID: function() { return 72; },

      INSERT_OPTIONS_FIELD_ID: function() { return 80; },
      RENDERINGS_FIELD_ID: function() { return 81; },
      TYPE_FIELD_ID: function() { return 150; },

      // TYPES
      SINGLE_LINE_TYPE: function () { return 342; },
      INTEGER_TYPE: function () { return 343; },
      RICH_TEXT_TYPE: function () { return 344; },
      IMAGE_TYPE: function () { return 345; },
      NUMBER_TYPE: function () { return 346; },
      DATETIME_TYPE: function () { return 347; },


        // KEYS      
      UP_KEY: function() { return 38; },
      DOWN_KEY: function() { return 40; },
      LEFT_KEY: function() { return 37; },
      RIGHT_KEY: function() { return 39; },
      ENTER_KEY: function() { return 13; },

      IS_CTRL_S_KEY: function(event) { return ((event.ctrlKey && event.which === 83) ? true : false); },
      
      // ACTIONS
      SAVE_ITEM_ACTION: function() { return "saveItem"; },
   
      // LANGUAGE
      LANGUAGE_DEFAULT: function() { return LanguageDefault; },
      LANGUAGE_SELECTOR: function() { return "#selLanguage"; },
      LANGUAGE_LIST: function() { return LanguageList; },

      VERSION_SELECTOR: function () { return "#selVersion"; },
    };
  };
  
  return Const();
});