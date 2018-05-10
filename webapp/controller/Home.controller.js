sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller,JSONModel,MessageBox) {
	"use strict";

	return Controller.extend("aul_fantasy.controller.Home", {
		onInit: function() {

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
