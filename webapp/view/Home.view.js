sap.ui.jsview("aul_fantasy.view.Home", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.Home";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.RegoJS
	 */
	createContent: function(oController) {

// add AUL logo
		var oLogo = new sap.m.Image(this.createId("aulLogo"),{
			src: "./images/aul_logo.png"
		});

		var oText1 = new sap.m.Text({
			text:"Welcome to the AUL Fantasy Website. To see the main site please go to\u00a0"
		});

		var oLink = new sap.m.Link({
			href: 'https://australianultimateleague.com/',
			text: 'https://australianultimateleague.com/'
		});

		var oPanel = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oText1,oLink]
		});

		var oText2 = new sap.m.Text({
			text:'We want to continue to improve the fantasy site in the future, if you have ideas please email contact@australianultimateleague.com'
		});

		var oPanel2 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oText2]
		});

		var oText3 = new sap.m.Text({
			text:"If you are a Javascript developer and would like to help out with maintaining/writing new code please let us know"
		});

		var oPanel3 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oText3]
		});

// common menu set up
		var oToolHeader = new sap.tnt.ToolHeader(this.createId("HomePageHeader"),{});

		var oButton = new sap.m.Button(this.createId("ButtonHome"),{
			//text: "Home",
			icon: "sap-icon://home",
			press: [oController.navigateToHome,oController]
		});
		oToolHeader.addContent(oButton);

		oButton = new sap.m.Button(this.createId("ButtonFantasyTeams"),{
			text: "Fantasy Teams",
			press: [oController.navigateToFantasyTeams,oController]
		});
		oToolHeader.addContent(oButton);

		oButton = new sap.m.Button(this.createId("ButtonTeamStats"),{
			text: "Team Stats",
			press: [oController.navigateToTeamStats,oController]
		});
		oToolHeader.addContent(oButton);

		oButton = new sap.m.Button(this.createId("ButtonPlayerStats"),{
			text: "Player Stats",
			press: [oController.navigateToPlayerStats,oController]
		});
		oToolHeader.addContent(oButton);

		oButton = new sap.m.Button(this.createId("ButtonRegister"),{
			text: "Register",
			press: [oController.navigateToRegister,oController]
		});
		oToolHeader.addContent(oButton);

		var oPage = new sap.m.Page(this.createId("HomePage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: [oLogo,oPanel,oPanel2,oPanel3]
		});

		var app = new sap.m.App(this.createId("myApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
	}

});
