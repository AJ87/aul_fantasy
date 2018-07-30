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
			text:"To register a fantasy team you will need to have become a member of a franchise. Use the same email you used in the process on the Register page when you submit your fantasy team."
		});

		var oPanel2 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oText2]
		});

		var oText3 = new sap.m.Text({
			text:"To register a team go to Register and select 6 men and 6 women from the different franchises. Then go to Your Team and click Register Team. Fill in the details and Submit. Once the league starts you will be able to see your team's stats on the Fantasy Teams page."
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

		oButton = new sap.m.Button(this.createId("ButtonInfo"),{
			text: "Info",
			press: [oController.navigateToInfo,oController]
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
