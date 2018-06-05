sap.ui.jsfragment("aul_fantasy.view.RegisterTeam", {
	createContent: function(oController) {

		var oRegisterPage = new sap.m.Page(this.createId("FragmentPage"),{
			title:"Team Details",
			showNavButton:true,
			navButtonTap:[oController.backToRegister,oController]
		});

		var oSimpleForm = new sap.ui.layout.form.SimpleForm({
			title:"Your Team Details",
			editable:true
		});

		var oLabel = new sap.m.Label({
			text:"First Name"
		});
		var oInput = new sap.m.Input(this.createId("userFirstName"),{
			value:"{userModel>/firstName}"
		});
		oSimpleForm.addContent(oLabel);
		oSimpleForm.addContent(oInput);

		oLabel = new sap.m.Label({
			text:"Last Name"
		});
		oInput = new sap.m.Input(this.createId("userLastName"),{
			value:"{userModel>/lastName}"
		});
		oSimpleForm.addContent(oLabel);
		oSimpleForm.addContent(oInput);

		oLabel = new sap.m.Label({
			text:"Email"
		});
		oInput = new sap.m.Input(this.createId("userEmail"),{
			value:"{userModel>/email}"
		});
		oSimpleForm.addContent(oLabel);
		oSimpleForm.addContent(oInput);

		oLabel = new sap.m.Label({
			text:"Team Name"
		});
		oInput = new sap.m.Input(this.createId("userTeamName"),{
			value:"{userModel>/teamName}"
		});
		oSimpleForm.addContent(oLabel);
		oSimpleForm.addContent(oInput);

		oRegisterPage.addContent(oSimpleForm);

		return [oRegisterPage];
	}
});
