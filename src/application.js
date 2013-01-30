window.App = {};

(function(_, Backbone) {

	var dispatcher = {}, context = {};
	
	_.extend(dispatcher, Backbone.Events);

	this.getContext = function() {
		return context;
	}

	this.getDispatcher = function() {
		return dispatcher;
	};

}).call(App, _, Backbone);