sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.InputStats", {
		onInit: function() {
			this._oApp = this.getView().byId("myApp");
			this._oSplitApp = this.getView().byId("myInputStatsSplitApp");
			this._oSplitAppPage = this.getView().byId("splitAppPage");
			this._oRoundPage = this.getView().byId("InputStatsPage");
			this._oDetailPage = this.getView().byId("InputStatsTablePage");
			this._oMasterPage = this.getView().byId("InputStatsMasterPage");
			this._oMasterTable = this.getView().byId("masterTable");

			this._oTableTitle = this.getView().byId("tableTitle");
			this._oTable = this.getView().byId("table");
			this._oButtonEdit = this.getView().byId("buttonEdit");
			this._oButtonSave = this.getView().byId("buttonSave");
			this._oButtonCancel = this.getView().byId("buttonCancel");
			this._oButtonUpdate = this.getView().byId("buttonUpdate");

			this._oReadOnlyTemplate = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({text:"{name}"}),
								new sap.m.Text({text:"{goals}"}),
								new sap.m.Text({text:"{assists}"}),
								new sap.m.Text({text:"{touches}"}),
								new sap.m.Text({text:"{drops}"}),
								new sap.m.Text({text:"{throwaways}"}),
								new sap.m.Text({text:"{blocks}"})
							]
						});
			this._oEditableTemplate = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({text:"{name}"}),
								new sap.m.Input({value: "{goals}", type: 'Number'}),
								new sap.m.Input({value: "{assists}", type: 'Number'}),
								new sap.m.Input({value: "{touches}", type: 'Number'}),
								new sap.m.Input({value: "{drops}", type: 'Number'}),
								new sap.m.Input({value: "{throwaways}", type: 'Number'}),
								new sap.m.Input({value: "{blocks}", type: 'Number'})
							]
						});

			this.getMasterTableData();
			this.rebindTable(this._oReadOnlyTemplate, "Navigation");
		},
		getTeamsData: function() {
			// initial AJAX call to populate all the teams
			var url = `/ajax/stats/round/${this._round}`;

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						that._teamsData = {teams: jQuery.parseJSON(this.response)};
						that.setTeamData("Adelaide Dragons");

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

			this.setTeamData(sItem);
			this.reset();
		},
		setTeamData: function(team) {
			var selectedTeam = this.getSelectedTeamData(team);
			this._oTableTitle.setText(team);

			var oModel = new JSONModel({players: selectedTeam});
			this.getView().setModel(oModel);
		},
		getSelectedTeamData: function(teamName) {
			this._currentTeam = teamName;
			// guard against nothing being set yet
			if (!this._teamsData) {
				return null;
			}
			for (var team of this._teamsData.teams) {
				if (team.name == teamName) {
					return team.players;
				}
			}
			// team does not yet exist so add it
			this._teamsData.teams.push({name:teamName,players:[]});
		},
		rebindTable: function(oTemplate, sKeyboardMode) {
			this._oTable.bindItems({
				path: "/players",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},
		onEdit: function(oEvent) {
			this._oButtonEdit.setVisible(false);
			this._oButtonSave.setVisible(true);
			this._oButtonCancel.setVisible(true);
			this._oButtonUpdate.setEnabled(false);
			this._oMasterTable.setMode("None");
			this._oldTeamsData = jQuery.extend(true,{},this._teamsData);
			this.rebindTable(this._oEditableTemplate, "Edit");
		},
		onSave: function(oEvent) {
			this.reset();
		},
		onCancel: function(oEvent) {
			this._teamsData = this._oldTeamsData;
			this.setTeamData(this._currentTeam);
			this.reset();
		},
		updateTeam: function(oEvent) {
			// initial AJAX call to populate all the teams
			var url = `/ajax/stats/round/${this._round}/team/${this._currentTeam}`;

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						var msg = "Successfully updated database";
						sap.m.MessageToast.show(msg);

					} else {

						msg = "Failed to update database. Try again or contact administrator";
						sap.m.MessageToast.show(msg);

					}
				}
			};

			xhttp.open("PUT", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhttp.send(this.getView().getModel().getJSON());
		},
		reset: function() {
			this._oButtonEdit.setVisible(true);
			this._oButtonSave.setVisible(false);
			this._oButtonCancel.setVisible(false);
			this._oButtonUpdate.setEnabled(true);
			this._oMasterTable.setMode("SingleSelectMaster");
			this.rebindTable(this._oReadOnlyTemplate, "Navigation");
		},
		navigateToRound1: function() {
			this._round = 1;
			this.getTeamsData();
			this.navigateToSplitApp();
		},
		navigateToRound2: function() {
			this._round = 2;
			this.getTeamsData();
			this.navigateToSplitApp();
		},
		navigateToRound3: function() {
			this._round = 3;
			this.getTeamsData();
			this.navigateToSplitApp();
		},
		navigateToRound4: function() {
			this._round = 4;
			this.getTeamsData();
			this.navigateToSplitApp();
		},
		navigateToRound5: function() {
			this._round = 5;
			this.getTeamsData();
			this.navigateToSplitApp();
		},
		navigateToSplitApp: function() {
			this._oSplitAppPage.setTitle(`Input Stats for Round ${this._round}`);
			this._oApp.to(this._oSplitAppPage);
		},
		backToRounds: function() {
			this._oMasterTable.removeSelections();
			this._oApp.backToPage(this._oRoundPage.getId());
		}
  });
});
