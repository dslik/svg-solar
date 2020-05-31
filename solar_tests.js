'use strict'
// ----------------------------------------------------------------------------------------
// Copyright 2020 David Slik, All rights reserved
// Tests for solar-related visualizations
// ----------------------------------------------------------------------------------------

// Handle range inputs
solar_range.oninput = function() {
	var solar_value = parseInt(this.value);
	var load_value = parseInt(document.getElementById('load_range_value').value);
	var grid_value = parseInt(document.getElementById('grid_range_value').value);
	var battery_value = parseInt(document.getElementById('battery_range_value').value);

	load_value = solar_value + grid_value + battery_value;

	document.getElementById('solar_range_value').value = solar_value.toString();
	document.getElementById('solar_range').value = solar_value.toString();
	document.getElementById('load_range_value').value = load_value.toString();
	document.getElementById('load_range').value = load_value.toString();
	document.getElementById('grid_range_value').value = grid_value.toString();
	document.getElementById('grid_range').value = grid_value.toString();
	document.getElementById('battery_range_value').value = battery_value.toString();
	document.getElementById('battery_range').value = battery_value.toString();

	render_slider_svg();
}

grid_range.oninput = function() {
	var solar_value = parseInt(document.getElementById('solar_range_value').value);
	var load_value = parseInt(document.getElementById('load_range_value').value);
	var grid_value = parseInt(this.value);
	var battery_value = parseInt(document.getElementById('battery_range_value').value);

	load_value = solar_value + grid_value + battery_value;

	document.getElementById('solar_range_value').value = solar_value.toString();
	document.getElementById('solar_range').value = solar_value.toString();
	document.getElementById('load_range_value').value = load_value.toString();
	document.getElementById('load_range').value = load_value.toString();
	document.getElementById('grid_range_value').value = grid_value.toString();
	document.getElementById('grid_range').value = grid_value.toString();
	document.getElementById('battery_range_value').value = battery_value.toString();
	document.getElementById('battery_range').value = battery_value.toString();

	render_slider_svg();
}

battery_range.oninput = function() {
	var solar_value = parseInt(document.getElementById('solar_range_value').value);
	var load_value = parseInt(document.getElementById('load_range_value').value);
	var grid_value = parseInt(document.getElementById('grid_range_value').value);
	var battery_value = parseInt(this.value);

	load_value = solar_value + grid_value + battery_value;

	document.getElementById('solar_range_value').value = solar_value.toString();
	document.getElementById('solar_range').value = solar_value.toString();
	document.getElementById('load_range_value').value = load_value.toString();
	document.getElementById('load_range').value = load_value.toString();
	document.getElementById('grid_range_value').value = grid_value.toString();
	document.getElementById('grid_range').value = grid_value.toString();
	document.getElementById('battery_range_value').value = battery_value.toString();
	document.getElementById('battery_range').value = battery_value.toString();

	render_slider_svg();
}

function render_slider_svg() {
	var svg = svgen("svg", { width:440, height:440, id:"solar2" });

	var group = svgen('g', {transform:"translate(20 20), scale(0.7)" });
	solar_draw(group, true, 50, parseInt(document.getElementById('solar_range').value), true, parseInt(document.getElementById('grid_range_value').value), parseInt(document.getElementById('load_range_value').value), parseInt(document.getElementById('battery_range_value').value), 100, "#FFFFFF");
	svg.appendChild(group)

	var element = document.getElementById('solar2');
	element.parentNode.replaceChild(svg, element);
}

function page_load()
{
	var group;

	render_slider_svg();

	var svg = svgen("svg", { width:740, height:380, id:"icons" });

	// Draw Solar Icons
	group = svgen('g', {transform:"translate(20 20)" });
	panels_draw(group, true, 0)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(140 20)" });
	panels_draw(group, true, 50)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(260 20)" });
	panels_draw(group, true, 75)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(380 20)" });
	panels_draw(group, false, 0)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(500 20)" });
	panels_draw(group, false, 50)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 20)" });
	panels_draw(group, false, 75)
	svg.appendChild(group)

	// Draw Battery Icons
	group = svgen('g', {transform:"translate(20 140)" });
	battery_draw(group, 0)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(140 140)" });
	battery_draw(group, 20)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(260 140)" });
	battery_draw(group, 50)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(380 140)" });
	battery_draw(group, 70)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(500 140)" });
	battery_draw(group, 80)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 140)" });
	battery_draw(group, 100)
	svg.appendChild(group)

	// Draw Misc Icons
	group = svgen('g', {transform:"translate(20 260)" });
	house_draw(group)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(140 260)" });
	grid_draw(group, false)
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(260 260)" });
	grid_draw(group, true)
	svg.appendChild(group)

	var element = document.getElementById('icons');
	element.parentNode.replaceChild(svg, element)

	var svg = svgen("svg", { width:900, height:900, id:"scenarios1" });

	// Draw Solar Scenarios
	// sol, grid, load, bat
	group = svgen('g', {transform:"translate(20 20), scale(0.4)" });
	solar_draw(group, true, 50, 100, true, 0, 100, 0, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "01 Solar -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 20), scale(0.4)" });
	solar_draw(group, true, 50, 100, true, 0, 0, -100, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "02 Solar -> Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 20), scale(0.4)" });
	solar_draw(group, true, 50, 100, true, -100, 0, 0, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "03 Solar -> Grid" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 320), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, 0, 100, 100, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "04 Battery -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 320), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, -100, 0, 100, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "05 Battery -> Grid" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 620), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, 100, 100, 0, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "06 Grid -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 620), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, 100, 0, -100, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "07 Grid -> Battery" ));
	svg.appendChild(group)

	var element = document.getElementById('scenarios1');
	element.parentNode.replaceChild(svg, element)

	var svg = svgen("svg", { width:900, height:1500, id:"scenarios2" });

	// Draw Solar Scenarios
	// sol, grid, load, bat
	group = svgen('g', {transform:"translate(20 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, -30, 30, 0, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "11 Solar -> Load, Grid" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, 0, 30, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "12 Solar -> Load, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, -30, 0, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "13 Solar -> Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 320), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, -30, 30, 60, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "14 Battery -> Load, Grid" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 620), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, 60, 30, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "15 Grid -> Load, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 920), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 30, 60, 0, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "16 Solar, Grid -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 920), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 30, 0, -60, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "17 Solar, Grid -> Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 1220), scale(0.4)" });
	solar_draw(group, true, 50, 0, true, 30, 60, 30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "18 Grid, Battery -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 1220), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 0, 60, 30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "19 Solar, Battery -> Load" ));
	svg.appendChild(group)

	var element = document.getElementById('scenarios2');
	element.parentNode.replaceChild(svg, element)

	// Draw Solar Scenarios
	// sol, grid, load, bat
	var svg = svgen("svg", { width:900, height:900, id:"scenarios3" });

	group = svgen('g', {transform:"translate(20 20), scale(0.4)" });
	solar_draw(group, true, 50, 90, true, -30, 30, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "21 Solar -> Load, Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, -10, 20, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "21 Solar -> Load, Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, -30, 20, -10, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "21 Solar -> Load, Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 320), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, 30, 60, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "22 Solar -> Battery, Load / Grid -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 320), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 60, 30, -60, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "23 Solar -> Battery / Grid -> Load, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(620 320), scale(0.4)" });
	solar_draw(group, true, 50, 10, true, 10, 30, 10, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "24 Solar, Load, Battery -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 620), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 30, 30, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "25 Solar -> Battery / Grid -> Load" ));
	svg.appendChild(group)

	var element = document.getElementById('scenarios3');
	element.parentNode.replaceChild(svg, element)

	// Draw no grid/no battery scenarios
	// sol, grid, load, bat
	var svg = svgen("svg", { width:900, height:900, id:"scenarios4" });

	group = svgen('g', {transform:"translate(20 20), scale(0.4)" });
	solar_draw(group, true, 50, 60, true, -30, 30);
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "11 Solar -> Load, Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 20), scale(0.4)" });
	solar_draw(group, true, 50, 30, true, 30, 60);
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "16 Solar -> Load, Grid, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 320), scale(0.4)" });
	solar_draw(group, true, 50, 60, null, null, 30, -30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "12 Solar -> Battery, Load / Grid -> Load" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(320 320), scale(0.4)" });
	solar_draw(group, true, 50, 30, null, null, 60, 30, 100, "#FFFFFF");
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "19 Solar -> Battery / Grid -> Load, Battery" ));
	svg.appendChild(group)

	group = svgen('g', {transform:"translate(20 620), scale(0.4)" });
	solar_draw(group, true, 50, 30, null, null, 30);
	group.appendChild(svgen('text', { x: 10, y: 10, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "01 Solar, Load, Battery -> Load" ));
	svg.appendChild(group)

	var element = document.getElementById('scenarios4');
	element.parentNode.replaceChild(svg, element)
}


