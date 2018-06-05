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
      header: new sap.m.Text({text:"Sex"})
    });
    columns.push(oColumn);

    oColumn = new sap.m.Column({
      header: new sap.m.Text({text:"Position"})
    });
    columns.push(oColumn);

		oColumn = new sap.m.Column({
      header: new sap.m.Text({text:"Height (cm)"})
    });
    columns.push(oColumn);

		oColumn = new sap.m.Column({
      header: new sap.m.Text({text:"Age"})
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
			content: [oTable],
			showFooter:true,
			footer:[oBar]
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
			initialMaster: oMasterPage,
			showNavButton:true,
			navButtonTap:[oController.backToRounds,oController]
		});
		oSplitApp.addMasterPage(oMasterPage);
		oSplitApp.addDetailPage(oDetailPage);

		return oSplitApp;
  }
});
