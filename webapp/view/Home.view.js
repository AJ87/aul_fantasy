sap.ui.jsview("SMADJS.view.Home", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.RegoJS
	 */
	getControllerName: function() {
		return "SMADJS.controller.Home";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.RegoJS
	 */
	createContent: function(oController) {

		var oPage = new sap.m.Page(this.createId("HomePage"),{
			title: "{i18n>title}",
		});

		var app = new sap.m.App(this.createId("myApp"), {
			initialPage: "oPage"
		});
		app.addPage(oPage);
		return app;
	}

});
