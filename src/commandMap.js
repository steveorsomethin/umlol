(function(_, Backbone) {
	var exports = this.Core = {};

	// Helper function to get a value from a Backbone object as a property
	// or as a function.
	var getValue = function(object, prop) {
		if (!(object && object[prop])) return null;
		return _.isFunction(object[prop]) ? object[prop]() : object[prop];
	};

	//CommandMap constructor, accepts a hash of options, and Backbone.Events object
	var CommandMap = exports.CommandMap = function(eventMap, options) {
		if (!eventMap) throw new Error('Parameter eventMap cannot be undefined');
		this.eventMap = eventMap;
		this.initialize.apply(this, arguments);
		this.mapCommands();
	};

	//Sort of a hack, but we want to use backbone's extend functionality
	CommandMap.extend = Backbone.Model.extend;

	CommandMap.prototype = {
		// Initialize is an empty function by default. Override it with your own
		// initialization logic.
		initialize: function(){},

		// Set callbacks, where `this.events` is a hash of
		//
		// *{"application event name": "callback or hash containing async api functions"}*
		//
		//     {
		//       'fetchUser':  'fetchUser',
		//       'saveWorksheet': function(e) { ... }
		//     }
		//
		// pairs. Callbacks will be bound to the shared event emitter, with `this` set properly.
		mapCommands: function(events) {
			if (!(events || (events = getValue(this, 'events')))) return;

			for (var key in events) {
				var method = events[key];
				if (!_.isFunction(method)) method = this[events[key]];
				if (!method) throw new Error('Event "' + events[key] + '" does not exist');
				this.eventMap.on(key, method);
			}
		}
	};
}).call(App, _, Backbone);