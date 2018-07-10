sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller,JSONModel,MessageBox) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.Register", {
		onInit: function() {
			this._oApp = this.getView().byId("myRegisterSplitApp");
			this._oDetailPage = this.getView().byId("RegisterTablePage");
			this._oMasterPage = this.getView().byId("RegisterMasterPage");
			this._oRegisterButton = this.getView().byId("buttonRegister");
			this._oAcceptButton = this.getView().byId("buttonAccept");
			this._oCancelButton = this.getView().byId("buttonCancel");

			this._oRegisterTeamPage = sap.ui.jsfragment("aul_fantasy.view.RegisterTeam", this);
			this._oApp.addPage(this._oRegisterTeamPage);

			var oUserModel = new JSONModel({
				firstName:"",
				lastName:"",
				email:"",
				teamName:""
			});
			this.getView().setModel(oUserModel,"userModel");

			this.getMasterTableData();
			this.getTeamsData();
			this._onYourTeam = true;
			this._maleCount = 0;
			this._femaleCount = 0;
		},
		getTeamsData: function() {
			// initial AJAX call to populate all the teams
			var url = "/ajax/teams";

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {

						that._teamsData = {teams: jQuery.parseJSON(this.response)};
						// "Your Team" does not yet exist so add it
						that._teamsData.teams.push({name:"Your Team",players:[]});

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
			if (sItem === "Your Team") {
				this._onYourTeam = true;
				this.getView().byId("buttonRegister").setVisible(true);
			} else {
				this._onYourTeam = false;
				this.getView().byId("buttonRegister").setVisible(false);
			}
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
		getSelectedTeamData: function(teamName) {
			// guard against nothing being set yet
			if (!this._teamsData) {
				return null;
			}
			for (var team of this._teamsData.teams) {
				if (team.name == teamName) {
					return team.players;
				}
			}
		},
		rowSelection: function(oEvent) {
			this._oSelectedItem = oEvent.getParameter("listItem");
			var sItem = this._oSelectedItem.getBindingContext().getProperty("name");
			this._sex = this._oSelectedItem.getBindingContext().getProperty("sex");

// reset selections so row can be reselected
			this.getView().byId("table").removeSelections();

			this._add = this.checkPlayerNotOnTeam(sItem);

			if (this._add && this.checkTooManyOneSex()) {
				var tooManyOneSex = 'You already have the maximum number of players of that sex';
				sap.m.MessageToast.show(tooManyOneSex);
			} else {
				this.createMessageBox(this._add, sItem);
			}
		},
		checkPlayerNotOnTeam: function(name) {
			this._yourTeam = this.getSelectedTeamData("Your Team");

			for (var player of this._yourTeam) {
				if (player.name === name) {
					return false;
				}
			}
			return true;
		},
		checkTooManyOneSex: function() {

			if (this._sex === "Male") {
				if (this._maleCount === 6) {
					return true;
				}
			} else {
				if (this._femaleCount === 6) {
					return true;
				}
			}

			return false;
		},
		createMessageBox: function(add, name) {
			var that = this;

			var msg = add ? `Do you want to add ${name} to your team?` : `Do you want to remove ${name} from your team?`;
			var title = add ? "Add" : "Remove";

			var callback = function(oAction) {
				if (oAction === MessageBox.Action.OK) {
					if (that._add) {
						// add person to "Your Team"
						var item = that._oSelectedItem.getBindingContext();
						that._yourTeam.push({
							name: item.getProperty("name"),
							teamName: that._oDetailPage.getTitle(),
							sex: item.getProperty("sex"),
							position: item.getProperty("position"),
							height: item.getProperty("height"),
							age: item.getProperty("age")});

						if (that._sex === "Male") {
							that._maleCount++;
						} else {
							that._femaleCount++;
						}

						// if team full enable register button
						if (that._maleCount === 6 && that._femaleCount === 6) {
							that._oRegisterButton.setEnabled(true);
						}

					} else {
						// remove person from "Your Team"
						var index = 0;
						for (var player of that._yourTeam) {
							if (player.name === name) {
								that._yourTeam.splice(index,1);
							}
							index++;
						}

						if (that._onYourTeam) {
							// refresh the Your Team view
							that.setTeamData("Your Team");
						}

						if (that._sex === "Male") {
							that._maleCount--;
						} else {
							that._femaleCount--;
						}

						that._oRegisterButton.setEnabled(false);
					}

					var text = that._add ? `${name} was added to your team` : `${name} was removed from your team`;
					sap.m.MessageToast.show(text);
				}
			};

			MessageBox.confirm(msg,callback,title).bind(this);
		},
		registerTeam: function() {
			this._oRegisterButton.setVisible(false);
			this._oAcceptButton.setVisible(true);
			this._oCancelButton.setVisible(true);
			this._oApp.to(this._oRegisterTeamPage);
		},
		handleRegisterTeam: function() {
			// AJAX call to register a user's team
			var data = JSON.parse(this.getView().getModel("userModel").getJSON());
			data.players = JSON.parse(this.getView().getModel().getJSON()).players;
			var url = `/ajax/fantasy-team/${data.teamName}`;

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {

						var submitSuccess = 'You have successfully registered your team';
						sap.m.MessageToast.show(submitSuccess);

					} else {
						var submitFail = `Updated failed. ${this.response}`;
						sap.m.MessageToast.show(submitFail);
					}
				}
			};

			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhttp.send(JSON.stringify(data));
		},
		handleCancelRegister: function() {
			this.backToRegister();
		},
		backToRegister: function() {
			this._oRegisterButton.setVisible(true);
			this._oAcceptButton.setVisible(false);
			this._oCancelButton.setVisible(false);
			this._oApp.backToPage(this._oDetailPage.getId());
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
