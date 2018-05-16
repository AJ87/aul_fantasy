sap.ui.jsview("aul_fantasy.view.FantasyTeams", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.FantasyTeams";
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
			header: new sap.m.Text({text:"Team"})
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
			mode: sap.m.ListMode.None
		});

		var oDetailPage = new sap.m.Page(this.createId("FantasyTeamsTablePage"),{
			title: "{i18n>titleFantasyTeamsDetailView}",
			content: [oTable],
			showFooter:false
		});

		var masterColumns = [];

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Rank"})
		});
		masterColumns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Name"})
		});
		masterColumns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Total Score"})
		});
		masterColumns.push(oColumn);

		var oMasterTable = new sap.m.Table(this.createId("masterTable"),{
			columns: masterColumns,
			mode: sap.m.ListMode.SingleSelectMaster
		});

		var oMasterPage = new sap.m.Page(this.createId("FantasyTeamsMasterPage"),{
			title: "{i18n>titleFantasyTeamsMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myFantasyTeamsSplitApp"), {
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

		oButton = new sap.m.Button(this.createId("ButtonInfo"),{
			text: "Info",
			press: [oController.navigateToInfo,oController]
		});
		oToolHeader.addContent(oButton);

		var oPage = new sap.m.Page(this.createId("FantasyTeamsPage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: oSplitApp
		});

		var app = new sap.m.App(this.createId("myFantasyTeamsApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
  }
});
