'use strict'
// ----------------------------------------------------------------------------------------
// Copyright 2020 David Slik, All rights reserved
// Library for solar-related visualizations
// ----------------------------------------------------------------------------------------
var debug = true;

// Convenience function that creates an SVG element from type, value and text strings
function svgen(n, v, t) {
	n = document.createElementNS("http://www.w3.org/2000/svg", n);
	for (var p in v)
		if(p == "xlink:href") { n.setAttributeNS("http://www.w3.org/1999/xlink", p, v[p]); }
		else if(p == "xmlns:xlink") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
		else if(p == "xmlns") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
		else if(p == "xml:space") { n.setAttributeNS("http://www.w3.org/XML/1998/namespace", p, v[p]); }
		else { n.setAttributeNS(null, p, v[p]); }
	if(t) n.innerHTML = t;
	return n
}

// Math utility functions
function circleX(centerx, angle, distance) {
	return(distance * Math.cos(-1 * angle / (180/Math.PI)) + centerx);
}

function circleY(centery, angle, distance) {
	return(distance * Math.sin(-1 * angle / (180/Math.PI)) + centery);
}

function tanX(centerx, angle, distance, tandist) {
	return(distance * Math.cos(-1 * angle / (180/Math.PI)) + centerx + tandist * Math.cos(-1 * (angle - 90) / (180/Math.PI)));
}

function tanY(centery, angle, distance, tandist) {
	return(distance * Math.sin(-1 * angle / (180/Math.PI)) + centery + tandist * Math.sin(-1 * (angle - 90) / (180/Math.PI)));
}

// ----------------------------------------------------------------------------------------
// Solar Power Flow Visualization
// ----------------------------------------------------------------------------------------
function solar_draw(svg, day, cloudy, sol_watts, grid_connected, grid_watts, load_watts, bat_watts, bat_soc, background_color) {
	var ratio = 0;

	svg.appendChild(svgen('ellipse', { cx: 300, cy: 300, rx: 128, ry: 128, "stroke-width": 40, stroke:'#22220A', "fill": 'none' }));

	flow_draw(svg, 180, 90, 40, 0, 0, 0, '#22220A', false, false);
	flow_draw(svg, 90, 0, 40, 0, 0, 0, '#22220A', false, false);
	flow_draw(svg, 0, 270, 40, 0, 0, 0, '#22220A', false, false);
	flow_draw(svg, 270, 180, 40, 0, 0, 0, '#22220A', false, false);

	// Debug gridlines (Set debug to true at top of file to enable)
	if(debug) { svg.appendChild(svgen('path', { d: "M300,0 l0,600", stroke:'#444444', "stroke-width": 1 })) }
	if(debug) { svg.appendChild(svgen('path', { d: "M0,300 l600,0", stroke:'#444444', "stroke-width": 1 })) }

	var panels = svgen('g', {transform:"translate(0 250)" });
	panels_draw(panels, day, cloudy);
	svg.appendChild(panels)

	var house = svgen('g', {transform:"translate(500 250)" });
	house_draw(house);
	svg.appendChild(house)

	var grid = svgen('g', {transform:"translate(250 10)" });
	grid_draw(grid, grid_connected);
	svg.appendChild(grid)

	var battery = svgen('g', {transform:"translate(250 470)" });
	battery_draw(battery, bat_soc);
	svg.appendChild(battery)

	// -------------------------------------

	if(grid_watts == 0 && bat_watts == 0 && sol_watts > 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "01" )) }
		flow_draw(svg, 180, 0, 40, 0, 0, 0, '#FFCC99',);
	}

	if(grid_watts == 0 && bat_watts < 0 && sol_watts > 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "02" )) }
		flow_draw(svg, 270, 180, 40, 0, 0, 0, '#FFCC99', true);
	}

	if(grid_watts < 0 && bat_watts == 0 && sol_watts > 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "03" )) }
		flow_draw(svg, 180, 90, 40, 0, 0, 0, '#FFCC99');
	}

	if(grid_watts == 0 && bat_watts > 0 && sol_watts == 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "04" )) }
		flow_draw(svg, 0, 270, 40, 0, 0, 0, '#9999CC', true);
	}

	if(grid_watts < 0 && bat_watts > 0 && sol_watts == 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "05" )) }
		flow_draw(svg, 90, 270, 40, 0, 0, 0, '#9999CC', true);
	}

	if(grid_watts > 0 && bat_watts == 0 && sol_watts == 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "06" )) }
		flow_draw(svg, 90, 0, 40, 0, 0, 0, '#CC6666');
	}

	if(grid_watts > 0 && bat_watts < 0 && sol_watts == 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "07" )) }
		flow_draw(svg, 90, 270, 40, 0, 0, 0, '#CC6666');
	}

	// -------------------------------------
	
	if(grid_watts < 0 && bat_watts == 0 && sol_watts > 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "11" )) }
		flow_draw(svg, 180, 90, 40 * ((grid_watts * -1) / sol_watts), 20 * (load_watts / sol_watts), 0, 20 * (load_watts / sol_watts), '#FFCC99');
		flow_draw(svg, 180, 0, 40 * (load_watts / sol_watts), -20 * ((grid_watts * -1) / sol_watts), 0, -20 * ((grid_watts * -1) / sol_watts), '#FFCC99');
	}
	
	if(grid_watts == 0 && bat_watts < 0 && sol_watts > 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "12" )) }
		flow_draw(svg, 180, 0, 40 * (load_watts / sol_watts), 20 * ((bat_watts * -1) / sol_watts), 0, 0, '#FFCC99');
		flow_draw(svg, 270, 180, 40 * ((bat_watts * -1) / sol_watts), 0, -20 * (load_watts / sol_watts), 0, '#FFCC99', true);
	}

	if(grid_watts < 0 && bat_watts < 0 && sol_watts > 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "13" )) }
		flow_draw(svg, 180, 90, 40 * ((grid_watts * -1) / sol_watts), 20 * ((bat_watts * -1) / sol_watts), 0, 0, '#FFCC99');
		flow_draw(svg, 270, 180, 40 * ((bat_watts * -1) / sol_watts), 0, -20 * ((grid_watts * -1) / sol_watts), 0, '#FFCC99', true);
	}

	if(bat_watts > 0 && sol_watts == 0 && load_watts > 0 && grid_watts < 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "14" )) }
		flow_draw(svg, 0, 270, 40 * (load_watts / bat_watts), 0, -20 * ((grid_watts * -1) / bat_watts), 20 * ((grid_watts * -1) / bat_watts), '#9999CC', true);
		flow_draw(svg, 90, 270, 40 * ((grid_watts * -1) / bat_watts), 0, 20 * (load_watts / bat_watts), -20 * (load_watts / bat_watts), '#9999CC', true);
	}

	if(grid_watts > 0 && (bat_watts * -1) > 0 && sol_watts == 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "15" )) }
		flow_draw(svg, 90, 0, 40 * (load_watts/grid_watts), 20 * ((bat_watts * -1) / grid_watts), 0, 20 * ((bat_watts * -1) / grid_watts), '#CC6666');
		flow_draw(svg, 90, 270, 40 * ((bat_watts * -1) / grid_watts), -20 * (load_watts/grid_watts), 0, -20 * (load_watts/grid_watts), '#CC6666');
	}
	
	if(grid_watts > 0 && bat_watts == 0 && sol_watts > 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "16" )) }
		flow_draw(svg, 180, 0, 40 * (sol_watts / load_watts), 0, 20 * (grid_watts / load_watts), -20 * (grid_watts / load_watts), '#FFCC99');
		flow_draw(svg, 90, 0, 40 * (grid_watts / load_watts), 0, -20 * (sol_watts / load_watts), 20 * (sol_watts / load_watts), '#CC6666');
	}

	if(grid_watts > 0 && bat_watts < 0 && sol_watts > 0 && load_watts == 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "17" )) }
		flow_draw(svg, 270, 180, 40 * (sol_watts / (bat_watts * -1)), 20 * (grid_watts / (bat_watts * -1)), 0, 0, '#FFCC99', true);
		flow_draw(svg, 90, 270, 40 * (grid_watts / (bat_watts * -1)), 0, -20 * (sol_watts / (bat_watts * -1)), 0, '#CC6666');
	}

	if(grid_watts > 0 && bat_watts > 0 && sol_watts == 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "18" )) }
		flow_draw(svg, 90, 0, 40 * (grid_watts / load_watts), 0, -20 * (bat_watts / load_watts), 0, '#CC6666');
		flow_draw(svg, 0, 270, 40 * (bat_watts / load_watts), 20 * (grid_watts / load_watts), 0, 0, '#9999CC', true);
	}

	// -------------------------------------
	
	if(grid_watts < 0 && bat_watts < 0 && sol_watts > 0 && load_watts > 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "21" )) }
		flow_draw(svg, 180, 90, 40 * ((grid_watts * -1) / sol_watts), 20 * ((load_watts + (bat_watts * -1)) / sol_watts), 0, 20 * ((load_watts + (bat_watts * -1)) / sol_watts), '#FFCC99');
		flow_draw(svg, 180, 0, 40 * (load_watts / sol_watts), -40 * ((grid_watts * -1) / sol_watts) + 40 * (load_watts / sol_watts), 0, -20 * (((grid_watts * -1) + (bat_watts * -1)) / sol_watts), '#FFCC99');
		flow_draw(svg, 270, 180, 40 * ((bat_watts * -1) / sol_watts), 0, -20 * ((load_watts + (grid_watts * -1)) / sol_watts), 0, '#FFCC99', true);
	}

	if((bat_watts * -1) + load_watts == sol_watts + grid_watts && (bat_watts * -1) < sol_watts && grid_watts < load_watts && sol_watts > 0 && load_watts > 0 && grid_watts > 0 && bat_watts < 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "22" )) }
		flow_draw(svg, 90, 0, 40 * (grid_watts / (sol_watts + grid_watts)), 0, -20 * (sol_watts / (sol_watts + grid_watts)), 20 * (sol_watts / (sol_watts + grid_watts)), '#CC6666');
		flow_draw(svg, 270, 180, 40 * (sol_watts / (sol_watts + grid_watts)), 0, -20 * (grid_watts / (sol_watts + grid_watts)), 0, '#FFCC99', true);
		flow_draw(svg, 180, 0, 40 * ((load_watts - grid_watts) / (sol_watts + grid_watts)), 20 * (sol_watts / (sol_watts + grid_watts)), 0, 0, '#FFCC99');
	}

	if((bat_watts * -1) + load_watts == sol_watts + grid_watts && (bat_watts * -1) > sol_watts && grid_watts > load_watts && sol_watts > 0 && load_watts > 0 && grid_watts > 0 && bat_watts < 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "23" )) }
		flow_draw(svg, 90, 0, 40 * (grid_watts / (sol_watts + grid_watts)), 20 * (sol_watts / (sol_watts + grid_watts)), 0, 20 * (sol_watts / (sol_watts + grid_watts)), '#CC6666');
		flow_draw(svg, 270, 180, 40 * (sol_watts / (sol_watts + grid_watts)), 10, 0, 0, '#FFCC99', true);
		flow_draw(svg, 90, 270, 40 * (sol_watts / (sol_watts + grid_watts)), -20 * (grid_watts / (sol_watts + grid_watts)), -20 * (grid_watts / (sol_watts + grid_watts)), -20 * (grid_watts/(sol_watts + grid_watts)), '#CC6666');
	}

	if(grid_watts == load_watts && sol_watts == (bat_watts * -1) && sol_watts != 0 && grid_watts != 0) {
		if(debug) { group.appendChild(svgen('text', { x: 10, y: 40, "text-anchor":"start", "fill":"#CCCCCC", "font-size":32, "font-family":"Arial"}, "24" )) }
		flow_draw(svg, 90, 0, 40 * (grid_watts/(sol_watts + grid_watts)), 0, 0, 0, '#CC6666');
		flow_draw(svg, 270, 180, 40 * (sol_watts/(sol_watts + grid_watts)), 0, 0, 0, '#FFCC99', true);
	}
}

// Draw individual flows
function flow_draw(svg, startAngle, endAngle, width, startoffset, endoffset, inneroffset, color, reverse = false, arrow = true) {
	var centerx = 300;
	var centery = 300;
	var inner = 0;
	var endcurve = 0;
	var offset = 2;

	if(startoffset < 0 && endoffset > 0 && inneroffset > 0) inner = 1;
	if(endoffset < 0 && inneroffset > 0) endcurve = 0;

	svg.appendChild(svgen('path', { d: "M" + tanX(centerx, startAngle, 172, startoffset) + "," + tanY(centery, startAngle, 172, startoffset) + " " +
									     "L" + tanX(centerx, startAngle, 156 + inneroffset, startoffset) + "," + tanY(centery, startAngle, 156 + inneroffset, startoffset) + " " +
									     "A28,28 0 0,0 " + circleX(centerx, startAngle - (10 - inneroffset/4) - startoffset/2, 128 + inneroffset) + "," + circleY(centery, startAngle - (10 - inneroffset/4) - startoffset/2, 128 + inneroffset) + " " + 
									     "A" + (128 + inneroffset) + "," + (128 + inneroffset) + " 0 " + inner + "1 " + circleX(centerx, endAngle + (10 - inneroffset/4) - endoffset/2, 128+ inneroffset) + "," + circleY(centery, endAngle + (10 - inneroffset/4) - endoffset/2, 128 + inneroffset) + " " +
									     "A" + (28 + endcurve) + "," + (28 + endcurve) + " 0 0,0 " + tanX(centerx, endAngle, 156 + inneroffset, endoffset) + "," + tanY(centery, endAngle, 156 + inneroffset, endoffset) + " " +
									     "L" + tanX(centerx, endAngle, 172, endoffset) + "," + tanY(centery, endAngle, 172, endoffset)
									     , fill:'none', stroke: color, 'stroke-width': width }));

	if(arrow) {
		if(!reverse) {
			[startAngle, endAngle] = [endAngle, startAngle];
			[startoffset, endoffset] = [endoffset, startoffset];
		}

		svg.appendChild(svgen('path', { d: "M" + tanX(centerx, startAngle, 172, startoffset + width/offset) + "," + tanY(centery, startAngle, 172, startoffset + width/offset) + " " +
								    		 "L" + tanX(centerx, startAngle, 172 + width/4, startoffset) + "," + tanY(centery, startAngle, 172 + width/4, startoffset) + " " +
								    		 "L" + tanX(centerx, startAngle, 172, startoffset - width/offset) + "," + tanY(centery, startAngle, 172, startoffset - width/offset)
								     		 , fill: color }));

		[startAngle, endAngle] = [endAngle, startAngle];
		[startoffset, endoffset] = [endoffset, startoffset];

		if((startoffset != 0)) {
			width = 40;
			startoffset = 0;
		}

		svg.appendChild(svgen('path', { d: "M" + tanX(centerx, startAngle, 172, startoffset + width/offset) + "," + tanY(centery, startAngle, 172, startoffset + width/offset) + " " +
										   "L" + tanX(centerx, startAngle, 172 + width/4, startoffset + width/offset) + "," + tanY(centery, startAngle, 172 + width/4, startoffset + width/offset) + " " +
										   "L" + tanX(centerx, startAngle, 172, startoffset) + "," + tanY(centery, startAngle, 172, startoffset) + " " +
										   "L" + tanX(centerx, startAngle, 172 + width/4, startoffset - width/offset) + "," + tanY(centery, startAngle, 172 + width/4, startoffset - width/offset) + " " +
										   "L" + tanX(centerx, startAngle, 172, startoffset - width/offset) + "," + tanY(centery, startAngle, 172, startoffset - width/offset), fill: color }));
	}
}


// ----------------------------------------------------------------------------------------
// Icons
// ----------------------------------------------------------------------------------------

function panels_draw(svg, is_day, cloudcover) {
	var panelFill = "#6666FF";
	var sunStroke = "#FFCC22";

	// Uncomment to show bounding rect
	//svg.appendChild(svgen('rect', { x: 0, y: 0, width: 100, height: 100, stroke:'#FF0000', "stroke-width": 5 }));

	if(cloudcover >= 75) {
		sunStroke = "#FFCC22";
	}

	if(is_day == true) {
		svg.appendChild(svgen('path', { d: "M30,56 A28,28 0 0,1 86,56 Z", "stroke-linejoin": "round", fill: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 5, 34) + "," + circleY(56, 5, 34) + " L" + circleX(58, 5, 44) + "," + circleY(56, 5, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 33, 34) + "," + circleY(56, 33, 34) + " L" + circleX(58, 33, 44) + "," + circleY(56, 33, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 61, 34) + "," + circleY(56, 61, 34) + " L" + circleX(58, 61, 44) + "," + circleY(56, 61, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 90, 34) + "," + circleY(56, 90, 34) + " L" + circleX(58, 90, 44) + "," + circleY(56, 90, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 118, 34) + "," + circleY(56, 118, 34) + " L" + circleX(58, 118, 44) + "," + circleY(56, 118, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 146, 34) + "," + circleY(56, 146, 34) + " L" + circleX(58, 146, 44) + "," + circleY(56, 146, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 175, 34) + "," + circleY(56, 175, 34) + " L" + circleX(58, 175, 44) + "," + circleY(56, 175, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
	} else {
		panelFill = "#333399";

		svg.appendChild(svgen('path', { d: "M30,56 A28,28 0 0,1 86,56 Z", "stroke-linejoin": "round", fill: "#DDDDDD" }));
		svg.appendChild(svgen('ellipse', { cx: 44, cy: 42, rx: 6, ry: 6, "fill": '#AAAAAA' }));
		svg.appendChild(svgen('ellipse', { cx: 49, cy: 49, rx: 5, ry: 5, "fill": '#999999' }));
		svg.appendChild(svgen('ellipse', { cx: 64, cy: 46, rx: 5, ry: 5, "fill": '#BBBBBB' }));
	}

	if(cloudcover >= 50) {
		svg.appendChild(svgen('ellipse', { cx: 30, cy: 36, rx: 10, ry: 10, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 45, cy: 31, rx: 12, ry: 12, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 58, cy: 38, rx: 7.5, ry: 7.5, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 66, cy: 42, rx: 4, ry: 4, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('rect', { x: 30, y: 33, width: 15, height: 10, fill:'#FFFFFF'}));
		svg.appendChild(svgen('rect', { x: 30, y: 41, width: 36, height: 5, fill:'#FFFFFF'}));
		svg.appendChild(svgen('path', { d: "M30,46 l36,0", stroke:'#EEEEEE', "stroke-width": 1 }));
	}

	if(cloudcover >= 75) {
		svg.appendChild(svgen('ellipse', { cx: 60, cy: 46, rx: 10, ry: 10, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 75, cy: 41, rx: 12, ry: 12, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 88, cy: 48, rx: 7.5, ry: 7.5, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 96, cy: 52, rx: 4, ry: 4, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('rect', { x: 60, y: 43, width: 15, height: 10, fill:'#FFFFFF'}));
		svg.appendChild(svgen('rect', { x: 60, y: 51, width: 36, height: 5, fill:'#FFFFFF'}));
		svg.appendChild(svgen('path', { d: "M60,56 l36,0", stroke:'#EEEEEE', "stroke-width": 1 }));
	}

	svg.appendChild(svgen('path', { d: "M0,90 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
	svg.appendChild(svgen('path', { d: "M28,90 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
	svg.appendChild(svgen('path', { d: "M56,90 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
}

function battery_draw(svg, percent) {
	var width = (percent / 100) * 72;
	var color = "#99CC99";

	if(percent <= 70) color = "#FFFF66";
	if(percent <= 50) color = "#CC6666";

	// Uncomment to show bounding rect
	// svg.appendChild(svgen('rect', { x: 0, y: 0, width: 100, height: 100, stroke:'#FF0000', "stroke-width": 5 }));

	svg.appendChild(svgen('path', { d: "M10,35 l" + width + ",0 l0,30 l-" + width + ",0 Z", "stroke-linejoin": "round", fill: color }));
	svg.appendChild(svgen('path', { d: "M10,35 l73,0 l0,9 l7,0 l0,14 l-7,0 l0,9 l-73,0 Z", "stroke-linejoin": "round", "stroke-width": 5, stroke: "#9999CC", fill: "none"  }));
}

function house_draw(svg) {
	// Uncomment to show bounding rect
	// svg.appendChild(svgen('rect', { x: 0, y: 0, width: 100, height: 100, stroke:'#FF0000', "stroke-width": 5 }));

	svg.appendChild(svgen('path', { d: "M20,86 l20,0 l0,-30 l20,0 l0,30 l20,0 l0,-50 l-30,-10 l-30,10 Z", "stroke-linejoin": "round", fill: "#CC99CC" }));
	svg.appendChild(svgen('path', { d: "M50,15 l-40,14 l2,5 L50,21 L50,15 l40,14 l-2,5 L50,21 Z", "stroke-linejoin": "round", "stroke-width": 5, fill: "#CC99CC" }));
	svg.appendChild(svgen('path', { d: "M80,15 l-10,0 l0,10 l10,4 Z", "stroke-linejoin": "round", "stroke-width": 5, fill: "#CC99CC" }));
}

function grid_draw(svg, energized) {
	// Uncomment to show bounding rect
	// svg.appendChild(svgen('rect', { x: 0, y: 0, width: 100, height: 100, stroke:'#FF0000', "stroke-width": 5 }));

	svg.appendChild(svgen('path', { d: "M27,90 l15,-50", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M67,90 l-15,-50", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M27,90 l32,-25 l-24,0 l32,25", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M41,40 l16,25", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M53,40 l-16,25", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M27,40 l40,0 l-20,-10 Z", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M27,20 l40,0 l-20,-10 Z", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M41,40 l0,-25", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M53,40 l0,-25", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M33,40 l0,5", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M61,40 l0,5", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M33,20 l0,5", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));
	svg.appendChild(svgen('path', { d: "M61,20 l0,5", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": 3, stroke: "#AAAAAA", fill: "none" }));

	if(energized) {
		svg.appendChild(svgen('path', { d: "M75,20 l0,5 l5,0 l-5,10 l0,-5 l-5,0 l5,-10 Z", fill: "#FFFF66" }));
		svg.appendChild(svgen('path', { d: "M25,50 l0,5 l5,0 l-5,10 l0,-5 l-5,0 l5,-10 Z", fill: "#FFFF66" }));
	} else {
		svg.appendChild(svgen('path', { d: "M75,20 l0,5 l5,0 l-5,10 l0,-5 l-5,0 l5,-10 Z", "stroke-width": 1, stroke: "#AAAAAA" }));
		svg.appendChild(svgen('path', { d: "M25,50 l0,5 l5,0 l-5,10 l0,-5 l-5,0 l5,-10 Z", "stroke-width": 1, stroke: "#AAAAAA" }));
	}
}

