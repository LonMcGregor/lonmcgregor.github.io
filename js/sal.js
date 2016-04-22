// SAL Originally by Nicky Case
// More information at http://ncase.me/sight-and-light/
// Used with implicit permission vis-a-vis Creative Commons

// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

	// RAY in parametric: Point + Delta*T1
	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;

	// SEGMENT in parametric: Point + Delta*T2
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;

	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		// Unit vectors are the same.
		return null;
	}

	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;

	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;

	// Return the POINT OF INTERSECTION
	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};

}

///////////////////////////////////////////////////////

// DRAWING
var canvas = document.getElementById("bgCanvas");
var ctx = canvas.getContext("2d");
var segments = [];
var ww = window.innerWidth;
var wh = window.innerHeight;

function makePolygons(){
	var POLY_COUNT = 2;
	var MAX_POLY_EDGES = 4;
	var MIN_POLY_EDGES = 3;
	
	//Add Border
	var newSegments = [ 
		{a:{x:0,y:0}, b:{x:ww,y:0}},
		{a:{x:ww,y:0}, b:{x:ww,y:wh}},
		{a:{x:ww,y:wh}, b:{x:0,y:wh}},
		{a:{x:0,y:wh}, b:{x:0,y:0}}
	];
	
	//Add some random polygons
	for(var i = 0; i < POLY_COUNT; i++){
		var numEdges = randBetween(MIN_POLY_EDGES, MAX_POLY_EDGES);
		var startVertex = {x: randBetween(0, ww), y: randBetween(0, wh)};
		var previousVertex = startVertex;
		for(var j = 1; j < numEdges-1; j++){
			var newVertex = {x: randBetween(0, ww), y: randBetween(0, wh)};
			newSegments.push({a:previousVertex, b:newVertex});
			previousVertex = newVertex;
		}
		newSegments.push({a:previousVertex, b:startVertex});
	}
	
	segments = newSegments;
	
}

function randBetween(small, big){
	return Math.floor((Math.random()*big)+small);
}

///////////////////
// stuff a propos if the web browser is resized

function handleResizeEvents(){

	ww = window.innerWidth;
	wh = window.innerHeight;

	// LINE SEGMENTS
	/*
	segments = [


		// Polygon #1
		{a:{x:100,y:150}, b:{x:120,y:50}},
		{a:{x:120,y:50}, b:{x:200,y:80}},
		{a:{x:200,y:80}, b:{x:140,y:210}},
		{a:{x:140,y:210}, b:{x:100,y:150}},

		// Polygon #2
		{a:{x:100,y:200}, b:{x:120,y:250}},
		{a:{x:120,y:250}, b:{x:60,y:300}},
		{a:{x:60,y:300}, b:{x:100,y:200}},

		// Polygon #3
		{a:{x:200,y:260}, b:{x:220,y:150}},
		{a:{x:220,y:150}, b:{x:300,y:200}},
		{a:{x:300,y:200}, b:{x:350,y:320}},
		{a:{x:350,y:320}, b:{x:200,y:260}},

		// Polygon #4
		{a:{x:340,y:60}, b:{x:360,y:40}},
		{a:{x:360,y:40}, b:{x:370,y:70}},
		{a:{x:370,y:70}, b:{x:340,y:60}},

		// Polygon #5
		{a:{x:450,y:190}, b:{x:560,y:170}},
		{a:{x:560,y:170}, b:{x:540,y:270}},
		{a:{x:540,y:270}, b:{x:430,y:290}},
		{a:{x:430,y:290}, b:{x:450,y:190}},

		// Polygon #6
		{a:{x:400,y:95}, b:{x:580,y:50}},
		{a:{x:580,y:50}, b:{x:480,y:150}},
		{a:{x:480,y:150}, b:{x:400,y:95}}

	];*/

	canvas.width = ww;
	canvas.height = wh;

	makePolygons();

}

handleResizeEvents();
window.addEventListener("resize", function(){handleResizeEvents()});
//


function draw(){

	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// Draw segments
	ctx.strokeStyle = "#999";
	for(var i=0;i<segments.length;i++){
		var seg = segments[i];
		ctx.beginPath();
		ctx.moveTo(seg.a.x,seg.a.y);
		ctx.lineTo(seg.b.x,seg.b.y);
		ctx.stroke();
	}

	// Get all unique points
	var points = (function(segments){
		var a = [];
		segments.forEach(function(seg){
			a.push(seg.a,seg.b);
		});
		return a;
	})(segments);
	var uniquePoints = (function(points){
		var set = {};
		return points.filter(function(p){
			var key = p.x+","+p.y;
			if(key in set){
				return false;
			}else{
				set[key]=true;
				return true;
			}
		});
	})(points);

	// Get all angles
	var uniqueAngles = [];
	for(var j=0;j<uniquePoints.length;j++){
		var uniquePoint = uniquePoints[j];
		var angle = Math.atan2(uniquePoint.y-Mouse.y,uniquePoint.x-Mouse.x);
		uniquePoint.angle = angle;
		uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
	}

	// RAYS IN ALL DIRECTIONS
	var intersects = [];
	for(var j=0;j<uniqueAngles.length;j++){
		var angle = uniqueAngles[j];

		// Calculate dx & dy from angle
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);

		// Ray from center of screen to mouse
		var ray = {
			a:{x:Mouse.x,y:Mouse.y},
			b:{x:Mouse.x+dx,y:Mouse.y+dy}
		};

		// Find CLOSEST intersection
		var closestIntersect = null;
		for(var i=0;i<segments.length;i++){
			var intersect = getIntersection(ray,segments[i]);
			if(!intersect) continue;
			if(!closestIntersect || intersect.param<closestIntersect.param){
				closestIntersect=intersect;
			}
		}

		// Add to list of intersects
		intersects.push(closestIntersect);

	}

	// DRAW ALL RAYS
	ctx.strokeStyle = "#dd3838";
	ctx.fillStyle = "#dd3838";
	for(var i=0;i<intersects.length;i++){

		var intersect = intersects[i];

		// Draw red laser
		ctx.beginPath();
		ctx.moveTo(Mouse.x,Mouse.y);
		ctx.lineTo(intersect.x,intersect.y);
		ctx.stroke();
		
		// Draw red dot
		ctx.beginPath();
	    ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
	    ctx.fill();

	}

}



// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var updateCanvas = true;
function drawLoop(){
    requestAnimationFrame(drawLoop);
    if(updateCanvas){
    	draw();
    	updateCanvas = false;
    }
}
window.onload = function(){
	drawLoop();
};

// MOUSE	
var Mouse = {
	x: canvas.width/2,
	y: canvas.height/2
};
canvas.onmousemove = function(event){	
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	updateCanvas = true;
};


