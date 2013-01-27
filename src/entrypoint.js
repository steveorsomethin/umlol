$(function() {
	var S4 = function() {
		return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
	};

	var context = App.getContext();

	context.workspace = new App.Models.Workspace();
	context.workspace.documentName = 'testDocument';

	var doc = context.workspace;

	var workspaceView = new App.Views.WorkspaceView({model: doc}, {width: 960, height: 500});

	doc.share(function(error, root, created) {
		if (created) {
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

			doc.get('shapes').add([rect, circle, cylinder]);

			rectCircleLine = new App.Models.Line();
			circleCylinderLine = new App.Models.Line();
			cylinderRectLine = new App.Models.Line();

			doc.get('lines').add([rectCircleLine, circleCylinderLine, cylinderRectLine]);

			doc.get('links').add([
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

			var user = new App.Models.User({
				name: 'Anon ' + S4(),
				color: '#00F000'
			});

			doc.get('users').add(user);

			context.currentUserId = user.get('id');
			localStorage.setItem('currentUserId', context.currentUserId);
		} else {
			context.currentUserId = localStorage.getItem('currentUserId');
		}

	// 	selected = doc.get('shapes').at(0);

	// 	svg.append("rect")
	// 		.attr("width", width)
	// 		.attr("height", height)
	// 		.on("mousedown", mousedown);

	// 	svg.append("path")
	// 		.datum(points.toArray())
	// 		.attr("class", "line")
	// 		.call(redraw);

	// 	d3.select(window)
	// 		.on("mousemove", mousemove)
	// 		.on("mouseup", mouseup)
	// 		.on("keydown", keydown)
	// 		.on("keyup", keyup);

	// 	d3.select("#interpolate")
	// 			.on("change", change)
	// 		.selectAll("option")
	// 			.data([
	// 				"linear",
	// 				"step-before",
	// 				"step-after",
	// 				"basis",
	// 				"basis-open",
	// 				"basis-closed",
	// 				"cardinal",
	// 				"cardinal-open",
	// 				"cardinal-closed",
	// 				"monotone"
	// 			])
	// 		.enter().append("option")
	// 			.attr("value", function(d) { return d; })
	// 			.text(function(d) { return d; });

	// 	points.on('change', function() {
	// 		redraw();
	// 	});

	// 	setTimeout(function() { redraw(); redraw();}, 0);

	// 	svg.node().focus();
	});

	// function redraw() {
	// 	var db = "M0,20 a50,20 0 1,0 100,0 v60 a50,20 0 1,1 -100,0 v-60 Z a50,20 0 1,1 100,0 a50,20 0 0,1 -100,0 Z";
	// 	svg.select("path").attr("d", line);
	// 	var circles = _.clone(points.toArray());

	// 	if (dragGhost) {
	// 		circles[points.indexOf(dragged)] = dragGhost;
	// 	}

	// 	var circle = svg.selectAll("circle")
	// 			.data(circles, function(d) { return d; });

	// 	circle.enter().append("circle")
	// 			.attr("r", 1e-6)
	// 			.on("mousedown", function(d) { 
	// 				selected = 
	// 				dragged = 
	// 				points.filter(function(point) { return _.isEqual(point.tuple, d); })[0]; redraw(); 

	// 				dragGhost = _.clone(dragged).tuple;
	// 			})
	// 		.transition()
	// 			.duration(750)
	// 			.ease("elastic")
	// 			.attr("r", 6.5);

	// 	circle
	// 		.classed("selected", function(d) { return selected && _.isEqual(selected.tuple, d); })
	// 		.attr("cx", function(d) { return d[0]; })
	// 		.attr("cy", function(d) { return d[1]; });

	// 	circle.exit().remove();

	// 	if (d3.event) {
	// 		d3.event.preventDefault();
	// 		d3.event.stopPropagation();
	// 	}
	// }

	// function change() {
	// 	line.interpolate('cardinal');
	// 	redraw();
	// }

	// function mousedown() {
	// 	var svgPoint = d3.mouse(svg.node());
	// 	points.add(selected = dragged = new Point({x: svgPoint[0], y: svgPoint[1]}));
	// 	redraw();
	// }

	// function mousemove() {
	// 	if (!dragged || !dragGhost) return;
	// 	var m = d3.mouse(svg.node());
	// 	dragGhost[0] = Math.max(0, Math.min(width, m[0]));
	// 	dragGhost[1] = Math.max(0, Math.min(height, m[1]));
	// 	redraw();
	// }

	// function mouseup() {
	// 	if (!dragged || !dragGhost) return;
	// 	var m = d3.mouse(svg.node());
	// 	dragged.set({
	// 		x: Math.max(0, Math.min(width, m[0])),
	// 		y: Math.max(0, Math.min(height, m[1]))
	// 	});

	// 	mousemove();
	// 	dragged = null;
	// 	dragGhost = null;
	// }

	// var ctrl = false, shift = false;

	// function keydown() {
	// 	var i;
	// 	if (!selected) return;
	// 	console.log(d3.event.keyCode);
	// 	switch (d3.event.keyCode) {
	// 		case 91:
	// 		case 17:
	// 			ctrl = true;
	// 			break;
	// 		case 16:
	// 			shift = true;
	// 			break;
	// 		case 90:
	// 			if (shift && ctrl) selected.redo();
	// 			else if (ctrl) selected.undo();
	// 			break;
	// 		case 8: // backspace
	// 		case 46: { // delete
	// 			i = points.indexOf(selected);
	// 			points.remove(selected);
	// 			selected = points.length ? points.at(i > 0 ? i - 1 : 0) : null;
	// 			redraw();
	// 			break;
	// 		}
	// 	}
	// }

	// function keyup() {
	// 	var i;
	// 	if (!selected) return;
	// 	console.log(d3.event.keyCode);
	// 	switch (d3.event.keyCode) {
	// 		case 91:
	// 		case 17:
	// 			ctrl = false;
	// 			break;
	// 		case 16:
	// 			shift = false;
	// 			break;
	// 	}
	// }
});