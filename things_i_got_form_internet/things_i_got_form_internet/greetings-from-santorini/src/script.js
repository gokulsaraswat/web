$(document).ready(function () {
	setScene();

	$("#refresh").click(function () {
		setScene();
	});

	function setScene() {
		$(".wrapper").remove();

		var setCubeSize = getRandomInt(60, 200);

		var items = ["door-1", "door-2", "window-2"];
		document.documentElement.style.setProperty("--cube-size", setCubeSize + "px");

		var columnWidth = setCubeSize * 1.4;
		var columnHeight = $(window).height();
		var containerWidth = $(window).width();
		var columnCubeCount = Math.round(columnHeight / (setCubeSize * 1.2));
		var createColumn = Math.round(containerWidth / columnWidth);

		var createColumnCubes = columnCubeCount;
		var createColumns = createColumn;

		for (i = -2; i < createColumns; i++) {
			$("body").append(`<div class="wrapper"></div>`);
		}

		var itemRight = items[Math.floor(Math.random() * items.length)];
		var itemLeft = items[Math.floor(Math.random() * items.length)];

		for (j = -1; j < createColumnCubes; j++) {
			createCube(itemRight, itemLeft);
		}

		function createCube(itemRight, itemLeft) {
			$(".wrapper")
				.append(
					`<div class="container"><div class="cube"><div class="side front"></div><div class="side left ${itemLeft}"></div><div class="side right ${itemRight}"></div><div class="side back"></div><div class="side top"></div><div class="side bottom"></div></div></div>`
				)
				.delay(800)
				.queue(function (next) {
					$(".cube").addClass("rotate");
					next();
				});
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		console.log("Cube Size: " + setCubeSize);
		console.log("Column Count: " + createColumns);
		console.log("Cubes per Column: " + createColumnCubes);
	}
});
