sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.FantasyTeams", {
		onInit: function() {
			this._oApp = this.getView().byId("myFantasyTeamsSplitApp");
			this._oDetailPage = this.getView().byId("FantasyTeamsTablePage");
			this._oMasterPage = this.getView().byId("FantasyTeamsMasterPage");

			this.getFantasyLadderData();
		},
		getFantasyLadderData: function() {
			// initial AJAX call to populate the fantasy ladder
			var url = "/ajax/fantasy-ladder";

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						that.oMasterModel = {ladder: jQuery.parseJSON(this.response)};
						that.getView().setModel(oMasterModel,"masterModel");
						that.getTeamData(that.oMasterModel.ladder[0].id);
						that._oDetailPage.setTitle(that.oMasterModel.ladder[0].name);

						that.getView().byId("masterTable").bindAggregation("items",{
							path: "masterModel>/ladder",
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({text:"{masterModel>rank}"}),
									new sap.m.Text({text:"{masterModel>name}"}),
									new sap.m.Text({text:"{masterModel>score}"})
								]
							})
						}).attachSelectionChange(that.masterRowSelection,that);

					} else {
						var message = "Submission failed";
					}
				}
			};

			xhttp.open("GET", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhttp.send();
		},
		masterRowSelection: function(oEvent) {
			var oMasterSelectedItem = oEvent.getParameter("listItem");
			var sItem = oMasterSelectedItem.getBindingContext("masterModel").getProperty("name");
			var teamID = oMasterSelectedItem.getBindingContext("masterModel").getProperty("id");

			this._oDetailPage.setTitle(sItem);
			this.getTeamData(teamID);
		},
		getTeamData: function(teamID) {
			if (!teamID) {
				return null;
			}

			// AJAX call to populate the selected team
			var url = `/ajax/fantasy-team/${teamID}`;

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						var oModel = new JSONModel({players: jQuery.parseJSON(this.response)});
						that.getView().setModel(oModel);

						that.getView().byId("table").bindAggregation("items",{
							path: "/players",
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({text:"{name}"}),
									new sap.m.Text({text:"{team}"}),
									new sap.m.Text({text:"{sex}"}),
									new sap.m.Text({text:"{position}"}),
									new sap.m.Text({text:"{assists}"}),
									new sap.m.Text({text:"{goals}"}),
									new sap.m.Text({text:"{touches}"}),
									new sap.m.Text({text:"{drops}"}),
									new sap.m.Text({text:"{throwaways}"}),
									new sap.m.Text({text:"{blocks}"})
								]
							})
						});

					} else {
						var message = "Submission failed";
					}
				}
			};

			xhttp.open("GET", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhttp.send();
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
