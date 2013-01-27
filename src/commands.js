(function(Backbone) {
	var exports = this.Commands = {};

	var context = this.getContext();
	var dispatcher = this.getDispatcher();

	var ShapeCommands = exports.ShapeCommands = this.Core.CommandMap.extend({
		events: {
			'selectShape': 'selectShape'
		},

		selectShape: function(shape) {
			var currentUser = context.workspace.get('users').filter(function(user) {
				return user.get('id') === context.currentUserId;
			})[0];

			console.log('Select shape by ' + currentUser.toJSON());
		}
	});

	new ShapeCommands(dispatcher);

}).call(App, Backbone);