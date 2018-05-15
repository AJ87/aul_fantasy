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
			// initial AJAX call to populate all the teams
			var url = "/ajax/teams";

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						that._teamsData = {teams: jQuery.parseJSON(this.response)};

					} else {
						var message = "Submission failed";
					}
				}
			};

			xhttp.open("GET", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhttp.send();
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
		getSelectedTeamData: function(team) {
			// guard against nothing being set yet
			if (!this._teamsData) {
				return null;
			}
			for (var team of this._teamsData.teams) {
				if (team.name == team) {
					return team.players;
				}
			}
		},
		rowSelection: function() {

		},
		registerTeam: function() {

		},
		navigateToHome: function() {
			window.location.href = "/";
		},
		navigateToFantasyTeams: function() {
			window.location.href = "/#/fantasy-teams";
		},
		navigateToTeamStats: function() {
			window.location.href = "/#/team-stats";
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
