sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.Register", {
		onInit: function() {
			this._oApp = this.getView().byId("myRegisterSplitApp");
			this._oDetailPage = this.getView().byId("RegisterTablePage");
			this._oMasterPage = this.getView().byId("RegisterMasterPage");

			this.getMasterTableData();
			this.getTeamsData();
		},
		getTeamsData: function() {

		},
		getMasterTableData: function() {
			var oMasterModel = new JSONModel({
				teams: [{team: "Your Team"},
				{team: "Adelaide Dragons"},
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
			this.setTeamData(sItem);
		},
		setTeamData: function(team) {
			var selectedTeam = this.getSelectedTeamData(team);

			var oModel = new JSONModel({players: selectedTeam});
			this.getView().setModel(oModel);

			this.getView().byId("table").bindAggregation("items",{
				path: "/players",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({text:"{name}"}),
						new sap.m.Text({text:"{sex}"}),
						new sap.m.Text({text:"{position}"}),
						new sap.m.Text({text:"{height}"}),
						new sap.m.Text({text:"{age}"})
					]
				})
			}).attachSelectionChange(this.rowSelection,this);
		},
		getSelectedTeamData: function() {

		},
		rowSelection: function() {

		},
		registerTeam: function() {

		},
		navigateToHome: function() {
			window.location.href = "/";
		},
		navigateToLadder: function() {
			window.location.href = "/#/ladders";
		},
		navigateToPlayerStats: function() {
			window.location.href = "/#/player-stats";
		},
		navigateToRegister: function() {
			window.location.href = "/#/register";
		},
		navigateToInfo: function() {
			window.location.href = "/#/info";
		}
  });
});
