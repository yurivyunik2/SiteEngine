define(["application", "CONST", "Utils"], function (application, CONST, Utils) {
  
  return function ($scope) {

    var self;
    var idInterval;

    var formSelector = "#createTemplateForm";
    var selTypeSelector = "#selType";

    var createTemplateFormCtrl = {
      constructor: function() {
        self = this;
        $scope.clickAddField = this.clickAddField;
        $scope.clickRemoveField = this.clickRemoveField;

        self.initialize();

        idInterval = setInterval(function() {
          var $newField = $(formSelector).find("#newField");
          var $inName = $newField.find(".inName");
          var val = $inName.val();
          if (val && val !== "" && $inName.hasClass("inputError")) {
            $inName.removeClass("inputError");
          }
        }, 300);
      },

      initialize: function (data) {
        if (data && data.isChange && data.selectedItem) {
          var selItem = data.selectedItem;
          var countChildren = 0;
          if (selItem && selItem.children && selItem.children.length > 0) {
            countChildren = selItem.children.length;
            var indexChildren = 0;
            _.each(selItem.children, function(child) {
              application.getItemFields(child, function() {
                indexChildren++;
                if (indexChildren == countChildren) {
                  self.initializeCallback(data);
                }
              });
            });
          } else {
            self.initializeCallback(data);
          }
        } else {
          self.initializeCallback(data);
        }
      },

      initializeCallback: function (data) {
        var dataTypes = application.getDataTypesItems();

        if (data && data.isChange && data.selectedItem) {
          $scope.newTemplateName = data.selectedItem.name;
          var fields = [];
          _.each(data.selectedItem.children, function(child) {
            var typeName = "";
            var idType = -1;
            if (child.fields) {
              var found = _.findWhere(child.fields, { fieldId: CONST.TYPE_FIELD_ID() });
              if (found) {
                idType = found.value;
                var typeFound = _.findWhere(dataTypes, { id: parseInt(idType) });
                if (typeFound && typeFound.name) {
                  typeName = typeFound.name;
                }
              }
              
            }
            var field = { id: child.id, name: child.name, templateId: CONST.TEMPLATE_FIELD_ID(), fields: [{ fieldId: CONST.TYPE_FIELD_ID(), value: idType, typeName: typeName }] };
            fields.push(field);
          });
          $scope.addFields = fields;
        } else {
          $scope.newTemplateName = "";
          $scope.addFields = [];
        }
        $scope.removeFields = [];
        try {
          //$scope.$apply();
        } catch (ex) { }

        var $dvTemplateNameElem = $("#dvTemplateName");
        var $inName = $dvTemplateNameElem.find(".inName");
        $inName.val($scope.newTemplateName);
        $inName.focus();

        var $selTypeElem = $(selTypeSelector);
        $selTypeElem.html("");        
        _.each(dataTypes, function (type) {
          $selTypeElem.append("<option value='" + type.id + "'>" + type.name + "</option>");
        });
      },

      keyDownEventFunc: function (event) {
        if (event && event.which == CONST.ENTER_KEY()) {
          var $dvFieldElem = $(formSelector).find(".dvField");
          var $inputFieldElem = $dvFieldElem.find("input");
          if ($inputFieldElem.is(":focus")) {
            self.clickAddField();
            return true;
          }
        }
        return false;
      },

    show: function (data) {
        self.initialize(data);
      },

      isValidate: function (error) {
        var templateName = $("#dvTemplateName").find(".inName").val();
        var isNameFilled = (templateName != "");
        if (error && !isNameFilled) {
          error.message = "Template name must be filled!";
        }
        return isNameFilled;
      },

      clickOK: function (dataRequest) {
        if (!dataRequest || !dataRequest.selectedItem || (!dataRequest.selectedTemplate && !dataRequest.isChange))
          return;

        $scope.newTemplateName = $("#dvTemplateName").find(".inName").val();

        var action;
        if (dataRequest.isChange)
          action = "updateTemplate";
        else 
          action = "addTemplate";

        var _templateId;
        var _parentId;
        if (dataRequest.isChange) {
          _templateId = dataRequest.selectedItem.templateId;
          if(dataRequest.selectedItem.parentObj)
            _parentId = dataRequest.selectedItem.parentObj.id;
        } else {
          if (dataRequest.selectedTemplate)
            _templateId = dataRequest.selectedTemplate.id;
          _parentId = dataRequest.selectedItem.id;
        }

        var curLanguage = Utils.getLanguageCurrent();

        var data = {
          action: action,
          item: {
            id: dataRequest.selectedItem.id,
            name: $scope.newTemplateName,
            parentId: _parentId,
            templateId: _templateId,            
          },
          fields: $scope.addFields,
          removeFields: $scope.removeFields,
          lang: curLanguage.code,
        };

        application.httpRequest(data, function (response) {
          $scope.isShowModalForm = false;
          if (response.isOK) {
            var item = response.requestData.item;
            var fields = response.requestData.fields;
            var removeFields = response.requestData.removeFields;

            var treeGrid = application.getEngineTree().getTreeGrid();
            if (!dataRequest.isChange) {
              //application.getEngineTree().refresh(true);
              treeGrid.addChildNode({ id: item.parentId }, item);
              treeGrid.hashParentItems[item.id] = item;
            } else {
              if (response.requestData) {

              }
            }
            
            _.each(removeFields, function (field) {
              treeGrid.removeChildNode(field);
            });

            _.each(fields, function (field) {
              treeGrid.addChildNode(item, field);
            });

            // "openCloseNode" for parent item(re-rendering: arrows for node of the new created template)
            if (item.parentObj && item.parentObj.trElem)
              treeGrid.openCloseNode(item.parentObj.trElem, true);

            // open the node of the new created template
            if (item.trElem) {
              item.isOpened = true;
              treeGrid.openCloseNode(item.trElem, true);
              $(item.trElem).mousedown();
            }
          }
        }, function (response, status, headers, config) {
          
        });
      },

      clickAddField: function ($event) {
        var $newField = $("#newField");
        var $dvName = $newField.find(".inName");
        if ($dvName.val() == "") {
          $dvName.addClass("inputError");
          return;
        }
        //var $dvType = $newField.find(".inType");
        var $selTypeElem = $newField.find(selTypeSelector);
        var idType = $selTypeElem.val();
        var typeName = $selTypeElem[0].selectedOptions[0].text;

        var field = { name: $dvName.val(), templateId: CONST.TEMPLATE_FIELD_ID(), fields: [{ fieldId: CONST.TYPE_FIELD_ID(), value: idType, typeName: typeName }] };
        $dvName.val("");
        $scope.addFields.push(field);
        try {
          $scope.$apply();
        } catch (ex) {
        }
      },
      
      clickRemoveField: function ($event) {
        var $dvFieldArea = $($event.currentTarget).parents(".dvFieldArea");
        var $dvName = $dvFieldArea.find(".inName");
        var arFound = _.where($scope.addFields, { name: $dvName.val() });
        _.each(arFound, function (item) {
          $scope.addFields = _.without($scope.addFields, item);
          $scope.removeFields.push(item);
        });
      },
      
    };

    createTemplateFormCtrl.constructor();
    return createTemplateFormCtrl;
  };
});