sap.ui.jsview("aul_fantasy.view.InputStats", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.InputStats";
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
      header: new sap.m.Text({text:"Goals"})
    });
    columns.push(oColumn);

    oColumn = new sap.m.Column({
      header: new sap.m.Text({text:"Assists"})
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

		var oButtonEdit = new sap.m.Button(this.createId("buttonEdit"),{
			text: "Edit",
			type: "Transparent",
			press: [oController.onEdit,oController]
		});

		var oButtonSave = new sap.m.Button(this.createId("buttonSave"),{
			text: "Save",
			type: "Transparent",
			visible: false,
			press: [oController.onSave,oController]
		});

		var oButtonCancel = new sap.m.Button(this.createId("buttonCancel"),{
			text: "Cancel",
			type: "Transparent",
			visible: false,
			press: [oController.onCancel,oController]
		});

		var oTitle = new sap.m.Title(this.createId("tableTitle"), {
			text: "Adelaide Dragons",
			level: "H2"
		});

		var oSpacer = new sap.m.ToolbarSpacer();

		var oHeaderToolbar = new sap.m.OverflowToolbar(this.createId("overflowToolbar"), {
			content: [oTitle, oSpacer, oButtonEdit, oButtonSave, oButtonCancel]
		});

    var oTable = new sap.m.Table(this.createId("table"), {
      columns: columns,
			growing: true,
			headerToolbar: oHeaderToolbar,
			mode: sap.m.ListMode.SingleSelectNone
    });

		var oButtonUpdate = new sap.m.Button(this.createId("buttonUpdate"), {
			text:"Update Team",
			type:"Accept",
			press:[oController.updateTeam,oController]
		});

		var oBar = new sap.m.Bar({
			contentRight:[oButtonUpdate]
		});

    var oDetailPage = new sap.m.Page(this.createId("InputStatsTablePage"),{
			title: "{i18n>titleInputStatsDetailView}",
			content: [oTable]
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

		var oMasterPage = new sap.m.Page(this.createId("InputStatsMasterPage"),{
			title: "{i18n>titleInputStatsMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myInputStatsSplitApp"), {
			initialDetail: oDetailPage,
			initialMaster: oMasterPage
		});
		oSplitApp.addMasterPage(oMasterPage);
		oSplitApp.addDetailPage(oDetailPage);

		var oSplitAppPage = new sap.m.Page(this.createId("splitAppPage"),{
			showNavButton:true,
			navButtonTap:[oController.backToRounds,oController],
			content: [oSplitApp],
			showFooter:true,
			footer:[oBar]
		});

		var button1 = new sap.m.Button(this.createId("Button1"),{
			text: "Round 1",
			press: [oController.navigateToRound1,oController]
		});

		var button2 = new sap.m.Button(this.createId("Button2"),{
			text: "Round 2",
			press: [oController.navigateToRound2,oController]
		});

		var button3 = new sap.m.Button(this.createId("Button3"),{
			text: "Round 3",
			press: [oController.navigateToRound3,oController]
		});

		var button4 = new sap.m.Button(this.createId("Button4"),{
			text: "Round 4",
			press: [oController.navigateToRound4,oController]
		});

		var button5 = new sap.m.Button(this.createId("Button5"),{
			text: "Round 5",
			press: [oController.navigateToRound5,oController]
		});

		var panel1 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			justifyContent: "Center",
			content:[button1]
		});

		var panel2 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[button2]
		});

		var panel3 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[button3]
		});

		var panel4 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[button4]
		});

		var panel5 = new sap.m.Panel({
			class:"SapUiResponsiveMargin",
			width:"100%",
			content:[button5]
		});

		var oFlexBox = new sap.m.FlexBox(this.createId("FlexBox"),{
			alignItems: "Center",
			direction: "Column",
			items: [panel1,panel2,panel3,panel4,panel5]
		});

		var oVertLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [oFlexBox]
		});

		var oPage = new sap.m.Page(this.createId("InputStatsPage"),{
			title: "{i18n>titleInputStats}",
			content: [oVertLayout]
		});

		var app = new sap.m.App(this.createId("myApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		app.addPage(oSplitAppPage);
		return app;
  }
});
