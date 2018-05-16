sap.ui.jsview("aul_fantasy.view.AddPlayers", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.AddPlayers";
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
      header: new sap.m.Text({text:"Height"})
    });
    columns.push(oColumn);

		oColumn = new sap.m.Column({
      header: new sap.m.Text({text:"Age"})
    });
    columns.push(oColumn);

    var oTable = new sap.m.Table(this.createId("table"), {
      columns: columns,
			mode: sap.m.ListMode.SingleSelectMaster
    });

		var oButtonUpdate = new sap.m.Button({
			text:"Update Team",
			type:"Accept",
			press:[oController.updateTeam,oController]
		});

		var oBar = new sap.m.Bar({
			contentRight:[oButtonUpdate]
		});

    var oDetailPage = new sap.m.Page(this.createId("AddPlayersTablePage"),{
			title: "{i18n>titleAddPlayersDetailView}",
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

		var oMasterPage = new sap.m.Page(this.createId("AddPlayersMasterPage"),{
			title: "{i18n>titleRegisterMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myAddPlayersSplitApp"), {
			initialDetail: oDetailPage,
			initialMaster: oMasterPage
		});
		oSplitApp.addMasterPage(oMasterPage);
		oSplitApp.addDetailPage(oDetailPage);

		return oSplitApp;
  }
});
