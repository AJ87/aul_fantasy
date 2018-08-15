sap.ui.jsview("aul_fantasy.view.Register", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "aul_fantasy.controller.Register";
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

		oColumn = new sap.m.Column({
			header: new sap.m.Text({text:"Player Number"})
		});
		columns.push(oColumn);

    var oTable = new sap.m.Table(this.createId("table"), {
      columns: columns,
			fixedLayout: false,
			mode: sap.m.ListMode.SingleSelectMaster
    });

		var oButtonRegister = new sap.m.Button(this.createId("buttonRegister"),{
			text:"Register Team",
			type:"Accept",
			enabled:false,
			press:[oController.registerTeam,oController]
		});

		var oButtonAccept = new sap.m.Button(this.createId("buttonAccept"),{
			text:"Submit",
			type:"Accept",
			visible:false,
			press:[oController.handleRegisterTeam,oController]
		});

		var oButtonCancel = new sap.m.Button(this.createId("buttonCancel"),{
			text:"Cancel",
			type:"Reject",
			visible:false,
			press:[oController.handleCancelRegister,oController]
		});

		var oBar = new sap.m.Bar({
			contentRight:[oButtonAccept,oButtonCancel,oButtonRegister]
		});

    var oDetailPage = new sap.m.Page(this.createId("RegisterTablePage"),{
			title: "{i18n>titleRegisterDetailView}",
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

		var oMasterPage = new sap.m.Page(this.createId("RegisterMasterPage"),{
			title: "{i18n>titleRegisterMasterView}",
			content: [oMasterTable]
		});

		var oSplitApp = new sap.m.SplitApp(this.createId("myRegisterSplitApp"), {
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

		var oPage = new sap.m.Page(this.createId("RegisterPage"),{
			title: "{i18n>title}",
			showHeader: true,
			customHeader: oToolHeader,
			content: oSplitApp,
			showFooter: true,
			footer: [oBar]
		});

		var app = new sap.m.App(this.createId("myRegisterApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
  }
});
