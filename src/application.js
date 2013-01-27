window.App = {};

(function(_, Backbone) {
	var dispatcher = {};
	_.extend(dispatcher, Backbone.Events);

	var context = {};

	this.getContext = function() {
		return context;
	}

	this.getDispatcher = function() {
		return dispatcher;
	};

}).call(App, _, Backbone);