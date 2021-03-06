(function(async, Backbone) {
	var exports = this.Commands = {};

	var context = this.getContext();
	var dispatcher = this.getDispatcher();

	var S4 = function() {
		return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
	};

	var initializeWorkspace = function(workspace) {
		var rect, circle, cylinder, rectCircleLine, circleCylinderLine, cylinderRectLine;

		rect = new App.Models.Shape({
			image: 'roundedRect',
			x: 50,
			y: 100
		});

		circle = new App.Models.Shape({
			image: 'circle',
			x: 200,
			y: 25
		});

		cylinder = new App.Models.Shape({
			image: 'cylinder',
			x: 350,
			y: 100
		});

		workspace.get('shapes').add([rect, circle, cylinder]);

		rectCircleLine = new App.Models.Line();
		circleCylinderLine = new App.Models.Line();
		cylinderRectLine = new App.Models.Line();

		workspace.get('lines').add([rectCircleLine, circleCylinderLine, cylinderRectLine]);

		workspace.get('links').add([
			new App.Models.Link({
				shapeId: rect.get('id'),
				shapeSide: App.Models.Shape.RIGHT,
				lineId: rectCircleLine.get('id'),
				lineEnd: App.Models.Line.HEAD
			}),
			new App.Models.Link({
				shapeId: circle.get('id'),
				shapeSide: App.Models.Shape.LEFT,
				lineId: rectCircleLine.get('id'),
				lineEnd: App.Models.Line.TAIL
			}),
			new App.Models.Link({
				shapeId: circle.get('id'),
				shapeSide: App.Models.Shape.RIGHT,
				lineId: circleCylinderLine.get('id'),
				lineEnd: App.Models.Line.HEAD
			}),
			new App.Models.Link({
				shapeId: cylinder.get('id'),
				shapeSide: App.Models.Shape.LEFT,
				lineId: circleCylinderLine.get('id'),
				lineEnd: App.Models.Line.TAIL
			})
		]);
	};

	var WorkspaceCommands = exports.WorkspaceCommands = this.Core.CommandMap.extend({
		events: {
			'workspace:load': 'loadWorkspace',
			'workspace:select': 'selectItems'
		},

		loadWorkspace: function(event) {
			var workspace = context.workspace,
				metadata = context.metadata,
				name = event.name;

			workspace.documentName = name;
			metadata.documentName = name + ':metadata';

			async.parallel([
				function(callback) {
					workspace.share(function(error, root, created) {
						if (error) return callback(error);

						if (created) {
							initializeWorkspace(workspace);
						} 

						return callback();
					});
				},
				function(callback) {
					metadata.share(function(error, root, created) {
						if (error) return callback(error);

						if (created) {
							var user = new App.Models.User({
								name: 'Anon ' + S4(),
								color: '#00F000'
							});

							metadata.get('users').add(user);

							context.currentUserId = user.get('id');
							localStorage.setItem('currentUserId', context.currentUserId);
						} else {
							context.currentUserId = localStorage.getItem('currentUserId');
						}

						return callback();
					});
				}], 
				function(error) {
					if (error) throw error;

					dispatcher.trigger('workspace:loaded', {workspace: workspace, metadata: metadata});
				}
			);
		},

		selectItems: function(event) {
			var selected = context.workspace.get('shapes').filter(function(shape) {
				var x = shape.get('x'), y = shape.get('y');

				return x > event.x && x < event.x + event.width && y > event.y && y < event.y + event.height;
			});

			dispatcher.trigger('shape:select', {shapes: selected});
		}
	});

	var ShapeCommands = exports.ShapeCommands = this.Core.CommandMap.extend({
		events: {
			'shape:select': 'selectShapes'
		},

		selectShapes: function(event) {
			var currentUser = context.metadata.getUser(context.currentUserId),
				currentSelection = context.metadata.getSelectionsByUser(context.currentUserId),
				newSelections = event.shapes.map(function(shape) {
					return new App.Models.Selection({
						userId: context.currentUserId,
						selectedId: shape.get('id')
					});
				});

			context.metadata.get('selections').remove(currentSelection);
			context.metadata.get('selections').add(newSelections);
		}
	});

	var AppCommands = exports.AppCommands = this.Core.CommandMap.extend({
		events: {
			'undo': 'undo',
			'redo': 'redo'
		},

		undo: function() {
			context.workspace.undo();
		},

		redo: function() {
			context.workspace.redo();
		}
	});

	//No telling when the GC might try to reclaim these if they aren't attached to something
	this.Commands.ShapeInstance = new ShapeCommands(dispatcher);
	this.Commands.WorkspaceInstance = new WorkspaceCommands(dispatcher);
	this.Commands.AppInstance = new AppCommands(dispatcher);

}).call(App, async, Backbone);