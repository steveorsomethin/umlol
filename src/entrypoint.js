$(function() {
	var context = App.getContext(),
		dispatcher = App.getDispatcher();

	context.workspace = new App.Models.Workspace();
	context.metadata = new App.Models.WorkspaceMetadata();

	var doc = context.workspace;

	var workspaceView = new App.Views.WorkspaceView({model: doc}, {width: 960, height: 500});

	dispatcher.on('workspace:loaded', function() {
		workspaceView.render();
	});
	dispatcher.trigger('workspace:load', {name: 'testWorkspace'});

	var keyState = {};

	$(window).keydown(function(event) {
		switch (event.keyCode) {
			case 16:
				keyState.shift = true;
				break;
			case 17:
			case 91:
				keyState.ctrl = true;
				break;
			case 90:
				if (keyState.ctrl && keyState.shift) {
					dispatcher.trigger('redo');
				} else if (keyState.ctrl) {
					dispatcher.trigger('undo');
				}
				break;
		}
	});

	$(window).keyup(function(event) {
		switch (event.keyCode) {
			case 16:
				keyState.shift = false;
				break;
			case 17:
			case 91:
				keyState.ctrl = false
				break;
		}
	});
});