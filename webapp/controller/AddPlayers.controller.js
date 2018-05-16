sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.AddPlayers", {
		onInit: function() {
			this._oApp = this.getView().byId("myAddPlayersSplitApp");
			this._oDetailPage = this.getView().byId("AddPlayersTablePage");
			this._oMasterPage = this.getView().byId("AddPlayersMasterPage");

			this.getMasterTableData();
		},
		getMasterTableData: function() {
			var oMasterModel = new JSONModel({
				teams: [{team: "Adelaide Dragons"},
				{team: "Brisbane Breakers"},
				{team: "Canberra Freeze"},
				{team: "Melbourne Flames"},
				{team: "Perth Power"},
				{team: "Sydney Suns"}]
			});
			this.getView().setModel(oMasterModel,"masterModel");

			this.getView().byId("masterTable").bindAggregation("items",{
				path: "masterModel>/teams",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({text:"{masterModel>team}"})
					]
				})
			}).attachSelectionChange(this.masterRowSelection,this);
		},
		masterRowSelection: function(oEvent) {
			var oMasterSelectedItem = oEvent.getParameter("listItem");
			var sItem = oMasterSelectedItem.getBindingContext("masterModel").getProperty("team");

			this._oDetailPage.setTitle(sItem);
			//this.setTeamData(sItem);
		}
  });
});
