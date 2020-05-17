'use strict'
// ----------------------------------------------------------------------------------------
// Copyright 2020 David Slik, All rights reserved
// Library for solar-related visualizations
// ----------------------------------------------------------------------------------------

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
// Icons
// ----------------------------------------------------------------------------------------

function panels_draw(svg, is_day, cloudcover) {
	var panelFill = "#6666FF";
	var sunStroke = "#FFCC22";

	// Uncomment to show bounding rect
	//svg.appendChild(svgen('rect', { x: 0, y: 0, width: 100, height: 100, stroke:'#FF0000', "stroke-width": 5 }));

	if(cloudcover >= 0.75) {
		sunStroke = "#FFCC22";
	}

	if(is_day == true) {
		svg.appendChild(svgen('path', { d: "M30,66 A28,28 0 0,1 86,66 Z", "stroke-linejoin": "round", fill: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 5, 34) + "," + circleY(66, 5, 34) + " L" + circleX(58, 5, 44) + "," + circleY(66, 5, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 33, 34) + "," + circleY(66, 33, 34) + " L" + circleX(58, 33, 44) + "," + circleY(66, 33, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 61, 34) + "," + circleY(66, 61, 34) + " L" + circleX(58, 61, 44) + "," + circleY(66, 61, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 90, 34) + "," + circleY(66, 90, 34) + " L" + circleX(58, 90, 44) + "," + circleY(66, 90, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 118, 34) + "," + circleY(66, 118, 34) + " L" + circleX(58, 118, 44) + "," + circleY(66, 118, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 146, 34) + "," + circleY(66, 146, 34) + " L" + circleX(58, 146, 44) + "," + circleY(66, 146, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
		svg.appendChild(svgen('path', { d: "M" + circleX(58, 175, 34) + "," + circleY(66, 175, 34) + " L" + circleX(58, 175, 44) + "," + circleY(66, 175, 44), "stroke-linecap": "round", "stroke-width": 5, stroke: sunStroke }));
	} else {
		panelFill = "#333399";

		svg.appendChild(svgen('path', { d: "M30,66 A28,28 0 0,1 86,66 Z", "stroke-linejoin": "round", fill: "#DDDDDD" }));
		svg.appendChild(svgen('ellipse', { cx: 44, cy: 52, rx: 6, ry: 6, "fill": '#AAAAAA' }));
		svg.appendChild(svgen('ellipse', { cx: 49, cy: 59, rx: 5, ry: 5, "fill": '#999999' }));
		svg.appendChild(svgen('ellipse', { cx: 64, cy: 56, rx: 5, ry: 5, "fill": '#BBBBBB' }));
	}

	if(cloudcover >= 0.5) {
		svg.appendChild(svgen('ellipse', { cx: 30, cy: 46, rx: 10, ry: 10, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 45, cy: 41, rx: 12, ry: 12, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 58, cy: 48, rx: 7.5, ry: 7.5, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 66, cy: 52, rx: 4, ry: 4, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('rect', { x: 30, y: 43, width: 15, height: 10, fill:'#FFFFFF'}));
		svg.appendChild(svgen('rect', { x: 30, y: 51, width: 36, height: 5, fill:'#FFFFFF'}));
		svg.appendChild(svgen('path', { d: "M30,56 l36,0", stroke:'#EEEEEE', "stroke-width": 1 }));
	}

	if(cloudcover >= 0.75) {
		svg.appendChild(svgen('ellipse', { cx: 60, cy: 56, rx: 10, ry: 10, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 75, cy: 51, rx: 12, ry: 12, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 88, cy: 58, rx: 7.5, ry: 7.5, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('ellipse', { cx: 96, cy: 62, rx: 4, ry: 4, "fill": '#FFFFFF', stroke:'#EEEEEE', "stroke-width": 1 }));
		svg.appendChild(svgen('rect', { x: 60, y: 53, width: 15, height: 10, fill:'#FFFFFF'}));
		svg.appendChild(svgen('rect', { x: 60, y: 61, width: 36, height: 5, fill:'#FFFFFF'}));
		svg.appendChild(svgen('path', { d: "M60,66 l36,0", stroke:'#EEEEEE', "stroke-width": 1 }));
	}

	svg.appendChild(svgen('path', { d: "M0,100 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
	svg.appendChild(svgen('path', { d: "M28,100 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
	svg.appendChild(svgen('path', { d: "M56,100 l20,0 l20,-30 l-20,0 l-20,30 Z", "stroke-linejoin": "round", fill: panelFill }));
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

