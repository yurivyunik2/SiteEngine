
var CONST = function (CommonTypes, AppConfig) {
  var self;

  if (CommonTypes) {
    var LanguageList = [
      CommonTypes.Language("English", "en", "EN"),
      CommonTypes.Language("Русский", "ru", "RU"),
      CommonTypes.Language("Українська", "ua", "UA"),
    ];
    var LanguageDefault = LanguageList[0];
  }

  var MediaTypes = {
    IMAGE: function () { return "image"; },
    AUDIO: function () { return "audio"; },
    VIDEO: function () { return "video"; },
    DOC: function () { return "doc"; },
    UNKNOWN: function () { return "unknown"; },
  };


  return {

    SERVER: {
      //PORT: function () { return AppConfig.SERVER.PORT(); },
      //HOST: function () { return AppConfig.SERVER.HOST(); },
      PATH: function () {
        //return "https://" + AppConfig.SERVER.HOST() + ":" + AppConfig.SERVER.PORT() + "/";
        return "https://" + AppConfig.SERVER.HOST() + "/";
      },
      //PATH: function () { return "http://localhost:80/"; },

      //UPLOAD_PATH: function () { return "./SiteEngine/Client/upload/" },
      SITE_RENDERING_LAYOUT_PATH: "/SiteEngine/Client/siteRendering/SiteRenderingLayout.html",
      SESSION_TIME: 200 * 60 * 1000, // 20 minutes
      //SESSION_TIME: 5 * 1000, // 5 seconds
    },

    // APPLICATION
    APPLICATION_NAME: function () { return "myApp"; },
    APPLICATION_START_VIEW: function () { return "/Views/start"; },
    APPLICATION_START_PATH: function () { return "index.html#/Views/start"; },

    VIEW_GLOBAL_SELECTOR: function () { return ".dvNgView"; },

    // MEDIA
    MEDIA_TYPES: function () { return MediaTypes; },

    // ITEMS
    TEMPLATES_ROOT_ID: function () { return 2000; },
    CONTENT_ROOT_ID: function () { return 2; },
    LAYOUTS_ROOT_ID: function () { return 3000; },
    MEDIA_ROOT_ID: function () { return 5000; },
    DATA_TYPES_ROOT_ID: function () { return 4001; },
    
    // TEMPLATES
    TEMPLATE_FIELD_ID: function () { return 2017; },
    FOLDER_TEMPLATE_ID: function () { return 2003; },
    MEDIA_ITEM_TEMPLATE_ID: function () { return 2023; },

    // FIELDS
    INSERT_OPTIONS_FIELD_ID: function () { return 2011; },
    BASE_TEMPLATE_FIELD_ID: function () { return 2009; },
    RENDERINGS_FIELD_ID: function () { return 2012; },
    TYPE_FIELD_ID: function () { return 2018; },
    SRC_MEDIA_FIELDS_ID: function () { return 2024; },
    BLOB_MEDIA_FIELDS_ID: function () { return 2028; },
    WIDTH_MEDIA_FIELDS_ID: function () { return 2025; },
    HEIGHT_MEDIA_FIELDS_ID: function () { return 2026; },
    ALTERNATIVE_TEXT_MEDIA_FIELDS_ID: function () { return 2027; },
    LAYOUT_CONTENT_FIELD_ID: function () { return 5093; },


    // TYPES
    SINGLE_LINE_TYPE: function () { return 4002; },
    INTEGER_TYPE: function () { return 4003; },
    RICH_TEXT_TYPE: function () { return 4004; },
    IMAGE_TYPE: function () { return 4005; },
    NUMBER_TYPE: function () { return 4006; },
    DATETIME_TYPE: function () { return 4007; },
    BLOB_TYPE: function () { return 4008; },

    // KEYS      
    RIGHT_MOUSE_KEY: function () { return 3; },
    UP_KEY: function () { return 38; },
    DOWN_KEY: function () { return 40; },
    LEFT_KEY: function () { return 37; },
    RIGHT_KEY: function () { return 39; },
    ENTER_KEY: function () { return 13; },
    ESCAPE_KEY: function () { return 27; },

    IS_CTRL_S_KEY: function (event) { return ((event.ctrlKey && event.which === 83) ? true : false); },

    //EVENTS
    EVENT_CLICK_BUTTON: function () { return "CLICK_BUTTON"; },
    

    // ACTIONS
    SAVE_ITEM_ACTION: function () { return "saveItem"; },

    // LANGUAGE
    LANGUAGE_DEFAULT: function () { return LanguageDefault; },
    LANGUAGE_SELECTOR: function () { return "#selLanguage"; },
    LANGUAGE_LIST: function () { return LanguageList; },

    VERSION_SELECTOR: function () { return "#selVersion"; },

    // UPLOAD
    UPLOAD_MEDIA_PATH: function () { return "/SiteEngine/Client/upload/"; },

    USERS: {
      ROLE_UNKNOWN: 0,
      ROLE_ADMINISTRATOR: 1,
      ROLE_EDITOR: 2,
      ROLE_MODERATOR: 3,
      ROLE_USER: 4,

      ROLE_ID_DEFAULT: this.ROLE_USER,
    },

  };
};


if (typeof exports != "undefined") {
  exports.CONST = CONST;
}
  
if (typeof define != "undefined") {
  define(["CommonTypes", "AppConfig"], function (CommonTypes, AppConfig) {
    return CONST(CommonTypes, AppConfig);
  });
}