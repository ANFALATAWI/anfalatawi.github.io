---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

Hello there!
<html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.min.js"></script>
<script   src="https://code.jquery.com/jquery-3.6.0.min.js"   integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="   crossorigin="anonymous"></script>
<div id="rain">
	<h1>RAIN</h1>
	<script>
		function Drop() {
		this.x = random(width);
		this.y = random(-500, -50);
		this.z = random(0, 20);
		this.len = map(this.z, 0, 20, 10, 20);
		this.yspeed = map(this.z, 0, 20, 1, 20);

		this.fall = function() {
		this.y = this.y + this.yspeed;
		var grav = map(this.z, 0, 20, 0, 0.2);
		this.yspeed = this.yspeed + grav;

		if (this.y > height) {
		  this.y = random(-200, -100);
		  this.yspeed = map(this.z, 0, 20, 4, 10);
		}
		}

		this.show = function() {
		var thick = map(this.z, 0, 20, 1, 3);
		strokeWeight(thick);
		stroke("#ec407a");
		line(this.x, this.y, this.x, this.y + this.len);
		}
		}
		var drops = [];

		function setup() {
		  createCanvas(windowWidth, windowHeight);
		  // canvas.parent('rain');
		  for (var i = 0; i < 500; i++) {
		    drops[i] = new Drop();
		  }
		}

		function draw() {
		  background("#fce4ec");
		  for (var i = 0; i < drops.length; i++) {
		    drops[i].fall();
		    drops[i].show();
		  }
		}
	</script>
</div>
<script>
	let rain = $("#rain");

	// rain.hide();

	$(document).ready(function() {
		$("html").on("click", () => {
			rain.show();
			alert("You clicked!");
		})
	});
</script>
</html>