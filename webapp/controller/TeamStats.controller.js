sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

  return Controller.extend("aul_fantasy.controller.TeamStats", {
		onInit: function() {

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
