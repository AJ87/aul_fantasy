sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.Stats", {
		onInit: function() {
			this._oApp = this.getView().byId("myStatsSplitApp");
			this._oDetailPage = this.getView().byId("StatsTablePage");
			this._oMasterPage = this.getView().byId("StatsMasterPage");

			this.getMasterTableData();
			this.getStatsData();
		},
		getStatsData: function() {
			// initial AJAX call to populate all the stats
			var url = "/ajax/stats/categories";

			var that = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					that.status = this.status;
					if (this.status === 200) {

						that._statsData = {stats: jQuery.parseJSON(this.response)};
						that.setCategoryData('totalScore');

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
				categories: [{category: "Total Score"},
				{category: "Assists"},
				{category: "Goals"},
				{category: "Touches"},
				{category: "Drops"},
				{category: "Throwaways"},
				{category: "Blocks"}]
			});
			this.getView().setModel(oMasterModel,"masterModel");

			this.getView().byId("masterTable").bindAggregation("items",{
				path: "masterModel>/categories",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({text:"{masterModel>category}"})
					]
				})
			}).attachSelectionChange(this.masterRowSelection,this);
		},
		masterRowSelection: function(oEvent) {
			var oMasterSelectedItem = oEvent.getParameter("listItem");
			var sItem = oMasterSelectedItem.getBindingContext("masterModel").getProperty("category");

			let category;

			switch (sItem) {
				case 'Total Score':
					category = 'totalScore';
					break;
				case 'Assists':
					category = 'assists';
					break;
				case 'Goals':
					category = 'goals';
					break;
				case 'Touches':
					category = 'touches';
					break;
				case 'Drops':
					category = 'drops';
					break;
				case 'Throwaways':
					category = 'throwaways';
					break;
				case 'Blocks':
					category = 'blocks';
					break;
			}

			this._oDetailPage.setTitle(sItem);
			this.setCategoryData(category);
		},
		setCategoryData: function(category) {
			var selectedCategory = this.getSelectedCategoryData(category);

			var oModel = new JSONModel(selectedCategory);
			this.getView().setModel(oModel);

			this.getView().byId("tableWomen").bindAggregation("items",{
				path: "/women",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({text:"{rank}"}),
						new sap.m.Text({text:"{name}"}),
						new sap.m.Text({text:"{team}"}),
						new sap.m.Text({text:"{quantity}"})
					]
				})
			});

			this.getView().byId("tableMen").bindAggregation("items",{
				path: "/men",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({text:"{rank}"}),
						new sap.m.Text({text:"{name}"}),
						new sap.m.Text({text:"{team}"}),
						new sap.m.Text({text:"{quantity}"})
					]
				})
			});
		},
		getSelectedCategoryData: function(category) {
			// guard against nothing being set yet
			if (!this._statsData) {
				return null;
			}
			for (var stat of this._statsData.stats) {
				if (stat.category == category) {
					return stat;
				}
			}
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
