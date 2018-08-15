sap.ui.jsview("aul_fantasy.view.Stats", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.Stats";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.RegoJS
	 */
	createContent: function(oController) {

		var columnsMen = [];
		var columnsWomen = [];

		var oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Rank"})
		});
		columnsWomen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Name"})
		});
		columnsWomen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Team"})
		});
		columnsWomen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Quantity"})
		});
		columnsWomen.push(oColumn);

		var oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Rank"})
		});
		columnsMen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Name"})
		});
		columnsMen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Team"})
		});
		columnsMen.push(oColumn);

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Quantity"})
		});
		columnsMen.push(oColumn);

		var oTableWomen = new sap.m.Table(this.createId("tableWomen"), {
			headerText: "Women",
			columns: columnsWomen,
			mode: sap.m.ListMode.None
		});

		var oTableMen = new sap.m.Table(this.createId("tableMen"), {
			headerText: "Men",
			columns: columnsMen,
			mode: sap.m.ListMode.None
		});

		var oFlexBox = new sap.m.FlexBox(this.createId("FlexBox"),{
			alignItems: "Start",
			justifyContent: "Center",
			height: "100%",
			items: [oTableWomen,oTableMen]
		});

		var oVertLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [oFlexBox]
		});

		var oDetailPage = new sap.m.Page(this.createId("StatsTablePage"),{
			title: "{i18n>titleStatsDetailView}",
			content: [oVertLayout],
			showFooter:false
		});

		var masterColumns = [];

		oColumn = new sap.m.Column({
			//header: new sap.m.Text({text:"Category"})
		});
		masterColumns.push(oColumn);

		var oMasterTable = new sap.m.Table(this.createId("masterTable"),{
			columns: masterColumns,
			mode: sap.m.ListMode.SingleSelectMaster
		});

		var oMasterPage = new sap.m.Page(this.createId("StatsMasterPage"),{
			title: "{i18n>titleStatsMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myStatsSplitApp"), {
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

		var oPage = new sap.m.Page(this.createId("StatsPage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: oSplitApp
		});

		var app = new sap.m.App(this.createId("myStatsApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
  }
});
