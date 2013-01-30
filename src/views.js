(function(Backbone, d3) {
	var exports = this.Views = {};

	var context = this.getContext();
	var dispatcher = this.getDispatcher();

	var createSvg = function(tag) {
		return document.createElementNS('http://www.w3.org/2000/svg', tag);
	};

	var WorkspaceView = exports.WorkspaceView = Backbone.View.extend({
		initialize: function() {
			var svg = d3.select('body').append('svg')
				.attr('width', this.options.width)
				.attr('height', this.options.height);

			this.setElement(svg.node());

			this.bindModelEvents();
			this.render();
		},

		bindModelEvents: function() {
			var self = this;

			self.stopListening();

			this.listenTo(this.model, 'change:shapes change:lines', function() {
				self.bindModelEvents();
				self.render();
			});

			this.listenTo(this.model.get('shapes'), 'add', this.shapeAdded.bind(this));
			this.listenTo(this.model.get('lines'), 'add', this.lineAdded.bind(this));
		},

		shapeAdded: function(model) {
			var shapeView = new App.Views.ShapeView({model: model});
			this.el.appendChild(shapeView.el);
		},

		lineAdded: function(model) {
			var lineView = new App.Views.LineView({model: model});
			this.el.appendChild(lineView.el);
		},

		render: function() {
			while (this.el.lastChild) {
				this.el.removeChild(this.el.lastChild);
			}

			this.model.get('shapes').forEach(this.shapeAdded.bind(this));
			this.model.get('lines').forEach(this.lineAdded.bind(this));
		}
	});

	var ShapeView = exports.ShapeView = Backbone.View.extend({
		//Delegating to the workspace view might be preferable, but svg doesn't mix with jQuery delegation
		events: {
			'mousedown': 'onMouseDown'
		},

		initialize: function() {
			this.setElement(createSvg('path'));

			var drag = d3.behavior.drag()
				.on('dragstart', this.onDragStart.bind(this))
				.on('drag', this.onDrag.bind(this))
				.on('dragend', this.onDragEnd.bind(this));

			d3.select(this.el).attr('class', 'shape').call(drag);

			this.strokeColors = [];
			this.bindModelEvents();
			this.render();
		},

		bindModelEvents: function() {
			var self = this;

			this.stopListening();

			this.listenTo(context.metadata, 'change', function() {
				self.bindModelEvents();
				self.render();
			});

			this.listenTo(this.model, 'change', this.render.bind(this));
			this.listenTo(context.metadata.get('selections'), 'add', this.selectionAdded.bind(this));
			this.listenTo(context.metadata.get('selections'), 'remove', this.selectionRemoved.bind(this));
		},

		selectionAdded: function(selection) {
			if (selection.get('selectedId') === this.model.get('id')) {
				var user = context.metadata.getUser(selection.get('userId')),
					color = user.get('color');

				if (this.strokeColors.indexOf(color) === -1) {
					this.strokeColors.push(color);
				}
			}

			this.render();
		},

		selectionRemoved: function(selection) {
			if (selection.get('selectedId') === this.model.get('id')) {
				var user = context.metadata.getUser(selection.get('userId')),
					color = user.get('color');

				this.strokeColors.splice(this.strokeColors.indexOf(color), 1);
			}

			this.render();
		},

		render: function() {
			var x = (this.dragState ? this.dragState.x : this.model.get('x')).toString(),
				y = (this.dragState ? this.dragState.y : this.model.get('y')).toString(),
				transform = ['translate(', x, ' ', y, ')'].join(''),
				selectionInfo = this.model.get('selectionInfo');

			d3.select(this.el)
				.attr('class', 'shape')
				.attr('stroke', this.strokeColors.length ? this.strokeColors[0] : this.model.get('stroke'))
				.attr('fill', this.model.get('fill'))
				.attr('transform', transform)
				.attr('d', this.model.get('svgPath'));
		},

		onDragStart: function() {
			this.dragState = {x: this.model.get('x'), y: this.model.get('y')};
		},

		onDrag: function() {
			this.dragState.x += d3.event.dx;
			this.dragState.y += d3.event.dy;
			this.render();
		},

		onDragEnd: function() {
			this.model.set({x: this.dragState.x, y: this.dragState.y});
			this.dragState = null;
		},

		onMouseDown: function() {
			dispatcher.trigger('shape:select', {shapes: [this.model]});
		}
	});

	var LineView = exports.LineView = Backbone.View.extend({
		initialize: function() {
			this.line = d3.svg.line().interpolate('cardinal');
			this.setElement(createSvg('path'));

			this.model.on('change', this.render.bind(this));

			this.render();
		},

		render: function() {
			d3.select(this.el)
				.datum(this.model.toArray())
				.attr('class', 'line')
				.attr('d', this.line);
		}
	});

}).call(App, Backbone, d3);