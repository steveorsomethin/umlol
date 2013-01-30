$(function() {
	var context = App.getContext(),
		dispatcher = App.getDispatcher();

	context.workspace = new App.Models.Workspace();
	context.metadata = new App.Models.WorkspaceMetadata();

	var doc = context.workspace;

	var workspaceView = new App.Views.WorkspaceView({model: doc}, {width: 960, height: 500});
	dispatcher.trigger('workspace:load', 'testWorkspace');
});