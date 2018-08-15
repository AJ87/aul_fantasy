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
			header: new sap.m.Text({text:"Name"}),
			minScreenWidth: "",
			demandPopIn: false
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Team"}),
			minScreenWidth: "1400px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Sex"}),
			minScreenWidth: "1400px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Position"}),
			minScreenWidth: "1400px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Assists"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Goals"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Touches"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Drops"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Throwaways"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Blocks"}),
			minScreenWidth: "1000px",
			demandPopIn: true
		});
		columns.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Total Score"}),
			minScreenWidth: "",
			demandPopIn: false
		});
		columns.push(oColumn);

		var oTable = new sap.m.Table(this.createId("table"), {
			columns: columns,
			fixedLayout: false,
			mode: sap.m.ListMode.None
		});

		var oScroll = new sap.m.ScrollContainer(this.createId("scroll"), {
			vertical: true,
			height: "100%",
			content: [oTable]
		});

		var oDetailPage = new sap.m.Page(this.createId("FantasyTeamsTablePage"),{
			title: "{i18n>titleFantasyTeamsDetailView}",
			content: [oScroll],
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
