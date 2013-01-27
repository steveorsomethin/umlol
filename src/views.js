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

			this.bindModel();
		},

		bindModel: function() {
			var self = this;

			self.stopListening();

			this.listenTo(this.model, 'change:shapes change:lines', function() {
				self.bindModel();
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
		events: {
			'mousedown': 'onMouseDown'
		},

		initialize: function() {
			this.setElement(createSvg('path'));

			var drag = d3.behavior.drag()
				.on('dragstart', this.onDragStart.bind(this))
				.on('drag', this.onDrag.bind(this))
				.on('dragend', this.onDragEnd.bind(this));

			d3.select(this.el).call(drag);

			this.model.on('change', this.render.bind(this));

			this.render();
		},

		render: function() {
			var x = (this.drag ? this.drag.x : this.model.get('x')).toString(),
				y = (this.drag ? this.drag.y : this.model.get('y')).toString(),
				transform = ['translate(', x, ' ', y, ')'].join('');

			d3.select(this.el)
				.attr('stroke', this.model.get('stroke'))
				.attr('fill', this.model.get('fill'))
				.attr('transform', transform)
				.attr('d', this.model.get('svgPath'));
		},

		onDragStart: function() {
			this.drag = {x: this.model.get('x'), y: this.model.get('y')};
		},

		onDrag: function() {
			this.drag.x += d3.event.dx;
			this.drag.y += d3.event.dy;
			this.render();
		},

		onDragEnd: function() {
			this.model.set({x: this.drag.x, y: this.drag.y});
			this.drag = null;
		},

		onMouseDown: function() {
			dispatcher.trigger('selectShape', this.model);
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