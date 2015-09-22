exports.Config = function () {
  return {
    DATABASE: {
      DB_TYPE: "MY_SQL",

      dbConfig: {
        host: "localhost",
        user: "root",
        pass: "root",
        name: "db_site_engine",
      },

      //host : "localhost",
      //user : "root",
      //pass: "root",
      //name: "db_site_engine",
      //name: "db_site_engine_publish",
      
      TemplateRootID: function() {
        if (this.DB_TYPE === "MY_SQL")
          return 5;
        else {
          return 0;
        }
      },
      ContentItemdID: function() {
        if (this.DB_TYPE === "MY_SQL")
          return 2;
        else {
          return 0;
        }
      },
      BaseTemplateFieldID: function() {
        if (this.DB_TYPE === "MY_SQL")
          return 78;
        else {
          return 0;
        }
      },

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