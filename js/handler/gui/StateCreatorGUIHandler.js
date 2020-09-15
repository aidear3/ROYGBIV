var StateCreatorGUIHandler = function(){

}

StateCreatorGUIHandler.prototype.show = function(){
  terminal.disable();
  terminal.clear();
  terminal.printInfo(Text.USE_GUI_TO_CREATE_STATE);

  selectionHandler.resetCurrentSelection();
  guiHandler.hideAll();

  guiHandler.datGuiStateCreation = new dat.GUI({hideable: false});

  var params = {
    "Name": "",
    "Create": function(){
      terminal.clear();

      var stateName = this["Name"];
      if (!stateName){
        terminal.printError(Text.STATE_NAME_CANNOT_BE_EMPTY);
        return;
      }

      if (decisionHandler.createState(stateName)){
        stateCreatorGUIHandler.addStateFolder(stateName);
        terminal.printInfo(Text.STATE_CREATED);
      }else{
        terminal.printError(Text.NAME_MUST_BE_UNIQUE);
      }
    },
    "Done": function(){
      terminal.clear();
      terminal.enable();
      guiHandler.hide(guiHandler.guiTypes.STATE_CREATION);
      terminal.printInfo(Text.GUI_CLOSED);
    }
  };

  guiHandler.datGuiStateCreation.add(params, "Name");
  guiHandler.datGuiStateCreation.add(params, "Create");
  guiHandler.datGuiStateCreation.add(params, "Done");

  var statesInScene = decisionHandler.statesBySceneName[sceneHandler.getActiveSceneName()] || {};

  for (var stateName in statesInScene){
    this.addStateFolder(stateName);
  }
}

StateCreatorGUIHandler.prototype.addStateFolder = function(stateName){
  var stateFolder = guiHandler.datGuiStateCreation.addFolder(stateName);

  stateFolder.add({
    "Destroy": function(){
      terminal.clear();
      decisionHandler.destroyState(stateName);
      guiHandler.datGuiStateCreation.removeFolder(stateFolder);
      terminal.printInfo(Text.STATE_DESTROYED);
    }
  }, "Destroy");
}
