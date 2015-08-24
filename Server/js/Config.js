exports.Config = function () {
  return {
    DATABASE: {
      DB_TYPE: "MY_SQL",
      host : "localhost",
      user : "root",
      pass : "root",
      name: "db_site_engine",
      
      TemplateRootID: function() {
        if (this.DB_TYPE == "MY_SQL")
          return 5;
        else {
          return 0;
        }
      },
      ContentItemdID: function() {
        if (this.DB_TYPE == "MY_SQL")
          return 2;
        else {
          return 0;
        }
      },
      BaseTemplateFieldID: function() {
        if (this.DB_TYPE == "MY_SQL")
          return 78;
        else {
          return 0;
        }
      },
      TYPE_FIELD_ID: function () { return 150; },
    },
    
    SERVER: {
      LAYOUT_WRAPPER_PATH: "/SiteEngine/Client/layouts/LayoutWrapper.html",
      SESSION_TIME: 20 * 60 * 1000, // 2 minutes
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