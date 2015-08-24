define([], function() {
  function DataType() {
    return {
      
      Language: function (name, code, regionCode) {
        return {
          name: name,
          code: code,
          regionCode: regionCode,
        };
      },
      
    };
  };
  return (new DataType());
});