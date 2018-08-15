sap.ui.jsview("aul_fantasy.view.TeamStats", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.TeamStats";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.RegoJS
	 */
	createContent: function(oController) {

		var columns = [];

		var oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Name"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Sex"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Position"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Assists"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Goals"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Touches"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Drops"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Throwaways"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Blocks"})
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Total Score"})
		});
		columns.push(oColumn);

		var oTable = new sap.m.Table(this.createId("table"), {
			columns: columns,
			fixedLayout: false,
			mode: sap.m.ListMode.None
		});

		var oDetailPage = new sap.m.Page(this.createId("TeamStatsTablePage"),{
			title: "{i18n>titleTeamStatsDetailView}",
			content: [oTable],
			showFooter:false
		});

		var masterColumns = [];

		oColumn = new sap.m.Column({
			//header: new sap.m.Text({text:"Teams"})
		});
		masterColumns.push(oColumn);

		var oMasterTable = new sap.m.Table(this.createId("masterTable"),{
			columns: masterColumns,
			mode: sap.m.ListMode.SingleSelectMaster
		});

		var oMasterPage = new sap.m.Page(this.createId("TeamStatsMasterPage"),{
			title: "{i18n>titleTeamStatsMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myTeamStatsSplitApp"), {
			initialDetail: oDetailPage,
			initialMaster: oMasterPage
		});
		oSplitApp.addMasterPage(oMasterPage);
		oSplitApp.addDetailPage(oDetailPage);

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

		var oPage = new sap.m.Page(this.createId("TeamStatsPage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: oSplitApp
		});

		var app = new sap.m.App(this.createId("myTeamStatsApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
  }
});
