(function(Backbone) {
	var exports = this.Models = {};

	var imagePaths = {
		roundedRect: 'M10,0 h80 a10,10 0 0,1 10,10 v80 a10,10 0 0,1 -10,10 h-80 a10,10 0 0,1 -10,-10 v-80 a10,10 0 0,1 10,-10 Z',
		circle: 'M50,0 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100 Z',
		cylinder: 'M0,20 a50,20 0 1,0 100,0 v60 a50,20 0 1,1 -100,0 v-60 Z a50,20 0 1,1 100,0 a50,20 0 0,1 -100,0 Z'
	};

	var Point = exports.Point = Backbone.SharedModel.extend({
		defaults: {
			x: 0,
			y: 0
		},

		initialize: function() {
			this.tuple = [this.get('x'), this.get('y')];
			this.on('change', function() {
				this.tuple[0] = this.get('x');
				this.tuple[1] = this.get('y');
			});
		}
	});

	var Line = exports.Line = Backbone.SharedModel.extend({
		subDocTypes: {
			head: Point,
			body: Point,
			tail: Point
		},

		defaults: function() {
			return {
				head: new Point(),
				body: new Point(),
				tail: new Point()
			}
		},

		toArray: function() {
			var self = this;
			this.arr = this.arr || [];
			[this.get('head'), this.get('body'), this.get('tail')].forEach(function(point, i) {
				self.arr[i] = point.tuple;
			});

			return this.arr;
		}
	}, {
		HEAD: 0,
		TAIL: 1
	});

	var LineCollection = exports.LineCollection = Backbone.SharedCollection.extend({
		model: Line
	});

	var Shape = exports.Shape = Backbone.SharedModel.extend({
		initialize: function() {
			this.bind('change:image', this.imageChanged);
			this.imageChanged();
		},

		imageChanged: function() {
			this.set({
				svgPath: imagePaths[this.get('image')]
			});
		},

		defaults: {
			label: '',
			x: 0,
			y: 0,
			stroke: '#000000',
			fill: '#f0f0f0',
			image: 'roundedRect',
			svgPath: imagePaths['roundedRect']
		}
	}, {
		TOP: 0,
		RIGHT: 1,
		BOTTOM: 2,
		LEFT: 3
	});

	var ShapeCollection = exports.ShapeCollection = Backbone.SharedCollection.extend({
		model: Shape
	});

	var Link = exports.Link = Backbone.SharedModel.extend({
		defaults: {
			shapeId: '',
			shapeSide: '',
			lineId: '',
			lineEnd: ''
		}
	});

	var LinkCollection = exports.LinkCollection = Backbone.SharedCollection.extend({
		model: Link
	});

	var User = exports.User = Backbone.SharedModel.extend({
		defaults: {
			name: '',
			color: '',
			selection: ''
		}
	});

	var UserCollection = exports.UserCollection = Backbone.SharedCollection.extend({
		model: User
	});

	var Workspace = exports.Workspace = Backbone.SharedModel.extend({
		subDocTypes: {
			shapes: ShapeCollection,
			lines: LineCollection,
			links: LinkCollection,
			users: UserCollection
		},

		defaults: function() {
			return {
				shapes: new ShapeCollection(),
				lines: new LineCollection(),
				links: new LinkCollection(),
				users: new UserCollection()
			};
		}
	});
}).call(App, Backbone);