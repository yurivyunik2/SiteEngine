exports.Config = function () {
  return {
    DATABASE: {
      dbConfig: {
        host: "localhost",
        user: "root",
        pass: "root",
        name: "db_site_engine",
      },
      
      TemplateRootID: function () { return 5; },
      ContentItemdID: function () { return 2; },

      BASE_TEMPLATE_FIELD_ID: function () { return 78; },
      RENDERINGS_FIELD_ID: function () { return 81; },
      TYPE_FIELD_ID: function () { return 150; },
      BLOB_TYPE_ID: function () { return 2058; },
    },
    
    SERVER: {
      LAYOUT_WRAPPER_PATH: "/SiteEngine/Client/layouts/LayoutWrapper.html",
      SESSION_TIME: 200 * 60 * 1000, // 20 minutes
      //SESSION_TIME: 5 * 1000, // 5 seconds
    },
    
    USERS: {
      ROLE_UNKNOWN: 0,
      ROLE_ADMINISTRATOR: 1,
      ROLE_EDITOR: 2,
      ROLE_MODERATOR: 3,
      ROLE_USER: 4,
      
      ROLE_ID_DEFAULT: this.ROLE_USER,
    },
  };
}