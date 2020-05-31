'use strict'
// ----------------------------------------------------------------------------------------
// Copyright 2020 David Slik, All rights reserved
// Demo for solar-related visualizations
// ----------------------------------------------------------------------------------------
var timeoutFunction;
var dataArrays = new Object();


function page_load()
{
	var group;

	// Initialize Data Arrays
	dataArrays.elements = 0;
	dataArrays.start = new Date();
	dataArrays.start = Date.now();
	dataArrays.times = new Array();
	dataArrays.day = new Array();
	dataArrays.cloudy = new Array();
	dataArrays.yield = new Array();
	dataArrays.load = new Array();
	dataArrays.batteryCap = new Array();
	dataArrays.batterySOC = new Array();
	dataArrays.grid = new Array();
	dataArrays.gridBuy = new Array();
	dataArrays.gridSell = new Array();
	dataArrays.gridNet = new Array();

	background_update();
}

function background_update()
{
	document.getElementById('tick').value = (parseInt(document.getElementById('tick').value) + 1).toString();
	dataArrays.times[dataArrays.elements] = new Date((dataArrays.start + 3600000 * parseInt(document.getElementById('tick').value))).toISOString();

	document.getElementById('day').value = ((parseInt(document.getElementById('tick').value) + 6) % 24 > 12).toString();
	if(document.getElementById('day').value == "true") {
		dataArrays.day[dataArrays.elements] = 1;
	} else {
		dataArrays.day[dataArrays.elements] = 0;
	}

	document.getElementById('grid').value = ((parseInt(document.getElementById('tick').value) + 6) % 124 < 100).toString();
	if(document.getElementById('grid').value == "true") {
		dataArrays.grid[dataArrays.elements] = 1;
	} else {
		dataArrays.grid[dataArrays.elements] = 0;
	}

	document.getElementById('cloudy').value = (Math.max(0, Math.round(Math.sin((parseInt(document.getElementById('tick').value) / 30)) * 100))).toString();
	dataArrays.cloudy[dataArrays.elements] = parseInt(document.getElementById('cloudy').value);

	document.getElementById('yield').value = (Math.max(0, Math.round(Math.sin(((parseInt(document.getElementById('tick').value) - 6) / 12 * Math.PI)) * 4800 * (1 - (parseInt(document.getElementById('cloudy').value)/100))))).toString();
	dataArrays.yield[dataArrays.elements] = parseInt(document.getElementById('yield').value);

	document.getElementById('load').value = (Math.max(0, Math.round(Math.sin(((parseInt(document.getElementById('tick').value) - 6) / 6 * Math.PI)) * 1200)) + 400).toString();
	dataArrays.load[dataArrays.elements] = parseInt(document.getElementById('load').value);

	// Calculate change in battery
	var battery = parseFloat(document.getElementById('batteryCap').value);
	var orig_battery = battery;
	battery = battery + parseInt(document.getElementById('yield').value) / 1000;
	battery = battery - parseInt(document.getElementById('load').value) / 1000;

	if((document.getElementById('grid').value) == "true") {
		var gridBuy = 0;

		if(battery >= 24) {
			document.getElementById('grid_buy').value = "0";
			document.getElementById('grid_sell').value = (Math.round((battery - 24) * 1000)).toString();

			battery = 24;
		} else {
			gridBuy = 24 - battery;

			if(gridBuy >= 3) {
				gridBuy = 3;
			}

			document.getElementById('grid_buy').value = (Math.round(gridBuy * 1000)).toString();
			document.getElementById('grid_sell').value = "0";

			battery = battery + gridBuy;
		}
	} else {
		if(battery >= 24) {
			document.getElementById('yield').value = ((parseInt(document.getElementById('yield').value) - ((battery - 24) * 1000))).toString();
			dataArrays.yield[dataArrays.elements] = parseInt(document.getElementById('yield').value);

			battery = 24;					
		}
		document.getElementById('grid_buy').value = "0";
		document.getElementById('grid_sell').value = "0";
	}

	document.getElementById('batteryCap').value = battery.toString();
	document.getElementById('battery').value = (Math.round((orig_battery - battery) * 1000)).toString();				
	document.getElementById('grid_net').value = (parseFloat(document.getElementById('grid_net').value) + parseInt(document.getElementById('grid_sell').value) - parseInt(document.getElementById('grid_buy').value)).toString();

	dataArrays.batteryCap[dataArrays.elements] = parseInt(document.getElementById('batteryCap').value) * 1000;
	dataArrays.gridBuy[dataArrays.elements] = parseInt(document.getElementById('grid_buy').value);
	dataArrays.gridSell[dataArrays.elements] = parseInt(document.getElementById('grid_sell').value);
	dataArrays.gridNet[dataArrays.elements] = parseInt(document.getElementById('grid_net').value);

	document.getElementById('batterySOC').value = (Math.round((parseInt(document.getElementById('batteryCap').value)) / 24 * 100)).toString();
	dataArrays.batterySOC[dataArrays.elements] = parseInt(document.getElementById('batterySOC').value);

	dataArrays.elements = dataArrays.elements + 1;
	if(dataArrays.elements > 100) {
		dataArrays.elements = 100;
		dataArrays.times.shift();
		dataArrays.day.shift();
		dataArrays.cloudy.shift();
		dataArrays.yield.shift();
		dataArrays.load.shift();
		dataArrays.batteryCap.shift();
		dataArrays.batterySOC.shift();
		dataArrays.grid.shift();
		dataArrays.gridBuy.shift();
		dataArrays.gridSell.shift();		
		dataArrays.gridNet.shift();		
	}

	var svg = svgen("svg", { width:440, height:440, id:"solar" });
	var group;
	
	group = svgen('g', {transform:"translate(20 20), scale(0.7)" });
	solar_draw(group, (document.getElementById('day').value == "true"), parseInt(document.getElementById('cloudy').value), parseInt(document.getElementById('yield').value), (document.getElementById('grid').value == "true"), parseInt(document.getElementById('grid_buy').value) - parseInt(document.getElementById('grid_sell').value), parseInt(document.getElementById('load').value), parseInt(document.getElementById('battery').value), parseInt(document.getElementById('batterySOC').value), "#FFFFFF");
	svg.appendChild(group)

	var element = document.getElementById('solar');
	element.parentNode.replaceChild(svg, element);

	var svg = svgen("svg", { version:"1.1", preserveAspectRatio:"none", 'viewbox':"0 0 600 70", width: "600", height:"70", id:"chart1", 'xmlns':"http://www.w3.org/2000/svg", 'xmlns:xlink':"http://www.w3.org/1999/xlink"});
	var series = {};
	var chart = new mmaChart(svg);

	series.avg = dataArrays.day;
	series.time = dataArrays.times;
	series.units = "Day";
	series.title = "Enviromental Factors"
	series.label = ""
	series.color = '#FFCC22';
	series.style = "heatstrip";
	series.to = 3700000;
	chart.addSeries(series, 1, 20);

	series.avg = dataArrays.cloudy;
	series.time = dataArrays.times;
	series.yMax = 100;
	series.yMin = 0;
	series.units = "%";
	series.label = "Cloudy";
	series.style = "classic";
	series.to = 3700000;
	chart.addSeries(series, 2, 80);

	chart.draw();
	var element = document.getElementById('chart1');
	element.parentNode.replaceChild(svg, element);

	var svg = svgen("svg", { version:"1.1", preserveAspectRatio:"none", 'viewbox':"0 0 600 170", width: "600", height:"170", id:"chart2", 'xmlns':"http://www.w3.org/2000/svg", 'xmlns:xlink':"http://www.w3.org/1999/xlink"});
	var series = {};
	var chart = new mmaChart(svg);

	series.avg = dataArrays.yield;
	series.time = dataArrays.times;
	series.units = "W";
	series.title = "Solar System"
	series.label = "Yield";
	series.style = "underfill";
	series.color = '#222222';
	series.to = 3700000;
	chart.addSeries(series, 3, 60);

	series.avg = dataArrays.load;
	series.time = dataArrays.times;
	series.yMin = 0;
	series.units = "W";
	series.label = "Load";
	series.style = "underfill";
	series.color = '#FF0000';
	series.to = 3700000;
	chart.addSeries(series, 3, 60);

	series.avg = dataArrays.batteryCap;
	series.time = dataArrays.times;
	series.yMin = 0;
	series.units = "Wh";
	series.label = "Battery";
	series.style = "classic";
	series.to = 3700000;
	chart.addSeries(series, 4, 40);

	chart.draw();
	var element = document.getElementById('chart2');
	element.parentNode.replaceChild(svg, element);

	var svg = svgen("svg", { version:"1.1", preserveAspectRatio:"none", 'viewbox':"0 0 600 160", width: "600", height:"160", id:"chart3", 'xmlns':"http://www.w3.org/2000/svg", 'xmlns:xlink':"http://www.w3.org/1999/xlink"});
	var series = {};
	var chart = new mmaChart(svg);

	series.avg = dataArrays.grid;
	series.time = dataArrays.times;
	series.units = "Connected";
	series.title = "Grid"
	series.label = ""
	series.style = "heatstrip";
	series.to = 3700000;
	chart.addSeries(series, 1, 10);

	series.avg = dataArrays.gridSell;
	series.time = dataArrays.times;
	series.units = "W";
	series.label = "Buy";
	series.color = '#222222';
	series.style = "underfill";
	series.to = 3700000;
	chart.addSeries(series, 2, 45);

	series.avg = dataArrays.gridBuy;
	series.time = dataArrays.times;
	series.label = "Sell";
	series.color = '#FF0000';
	chart.addSeries(series, 2, 45);

	series.avg = dataArrays.gridNet;
	series.time = dataArrays.times;
	series.yMin = 0;
	series.units = "Wh";
	series.label = "Net";
	series.style = "classic";
	series.to = 3700000;
	chart.addSeries(series, 3, 45);

	chart.draw();

	var element = document.getElementById('chart3');
	element.parentNode.replaceChild(svg, element);

	timeoutFunction = window.setTimeout(background_update, 250);
}


