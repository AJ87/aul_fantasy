sap.ui.jsview("aul_fantasy.view.Info", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.Info";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.RegoJS
	 */
	createContent: function(oController) {

		var oTitle1 = new sap.m.Title(this.createId("Title"),{
			titleStyle: "H2",
			text: "How do we calculate total score"
		});

		var oText1 = new sap.m.Text({
			text:"We use the formula: Goals + Assists + Blocks - Drops - Throwaways"
		});

		var oPanel = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oText1]
		});

		var oPanel2 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[oTitle1,oPanel]
		});

		var oFlexBox = new sap.m.FlexBox(this.createId("FlexBox"),{
			alignItems: "Start",
			justifyContent: "Center",
			height: "100px",
			items: [oPanel2]
		});

		var oVertLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [oFlexBox]
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

		var oPage = new sap.m.Page(this.createId("InfoPage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: [oVertLayout]
		});

		var app = new sap.m.App(this.createId("myInfoApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
  }
});
