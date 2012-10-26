/******************
* File: Global.js
* Author: Scott Larson, Eric Satterness, Paul Bolanowski
* Date: 21 Oct 2012
*******************/

/***GLOBAL VARIABLES***/

//box2d vars
	var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
        ;
    var world = new b2World
	(
        new b2Vec2(0, 10),   //gravity
		true                 //allow sleep
    );
	var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;    //raise for more bounce     
    var bodyDef = new b2BodyDef;
	var DEBUGDRAW_SCALE = 1; //make smaller to see whole level, higher numbers zoom in (on origin)
	var DRAW_DEBUGDRAW = false;  //must also uncomment div in index.html to enable
	
//car controls
	var tiltLeft = false;
	var tiltRight = false;
	var applyBrake = false;
	var reloadLevelBool = false;

	var yMax;
	var xMax;
	var yMin;

	var isOnGround;
	var groundCount = 0;

//three.js vars
	var container,
	scene, 
	camera1,
	camera2,
	camera3,
	renderer,
	controls;
	var SCREEN_WIDTH = 1400, 
		SCREEN_HEIGHT = 800;
	var keyboard = new THREEx.KeyboardState();
	var CAMERA1_DISTANCE = 15; //distance from camera to player
	var CAMERA2_DISTANCE = 10; //distance from side of track for level camera
	var CAMERA3_DISTANCE = 100; //side camera
	var VIEW_ANGLE = 45; //camera view angle
	var mainCam = 1;  //which camera goes in the large (left) portion of screen
	var clock = new THREE.Clock();

//shader vars
	var uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() }
	};
	var woodUniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		LightPos: { type: "v3", value: new THREE.Vector3(0.0, 0.0, 4.0) },
		Scale: { type: "f", value: 2.0 },
		LightWood: { type: "v3", value: new THREE.Vector3(0.6, 0.3, 0.1) },
		//LightWood: { type: "v3", value: new THREE.Vector3(0.9, 0.6, 0.4) },
		DarkWood: { type: "v3", value: new THREE.Vector3(0.4, 0.2, 0.07) },
		//DarkWood: { type: "v3", value: new THREE.Vector3(0.7, 0.5, 0.37) },
		//RingFreq: { type: "f", value: 4.0 },
		RingFreq: { type: "f", value: 3.0 },
		LightGrains: { type: "f", value: 1.0 },
		//LightGrains: { type: "f", value: 0.0 },
		DarkGrains: { type: "f", value: 0.0 },
		//GrainThreshold: { type: "f", value: 0.5 },
		GrainThreshold: { type: "f", value: 0.3 },
		NoiseScale: { type: "v3", value: new THREE.Vector3(0.5, 0.1, 0.1) },
		Noisiness: { type: "f", value: 3.0 },
		GrainScale: { type: "f", value: 27.0 },
		MarbleColor: { type: "v3", value: new THREE.Vector3(0.40, 0.37, 0.34) },
		VeinColor: { type: "v3", value: new THREE.Vector3(0.20, 0.17, 0.14) },
	}
	var utils;
	
//level.js vars
	var originalX = 0;
	var originalY = 0;
	var gameLost = false;
	var gameWon = false;
	var distanceTraveled = 0;
	//gl vars
	var TRACK_WIDTH = 5;
	
//car.js vars
	//Constants
	var CAR_WIDTH = 3;
	var CAR_HEIGHT = 0.6;
	var CAR_X = 4;
	var CAR_Y = 4;
	var CAR_ANGLE = 210;
	var CAR_TILT = 30;
	
	//Adjustable by player
	var wheel1Radius;
	var wheel2Radius;
	var wheel1Width = 0.7;
	var wheel2Width = 1.2;
	var wheelFriction;
	var suspension; //Higher number gives a firmer spring
	var carDensity;
	var carBodyNum;
	
	//Constants for the adjustable values
	var wheelRadiusLow = 0.4;
	var wheelRadiusMed = 0.7;
	var wheelRadiusHigh = 0.9;
	var wheelFrictionLow = 1;
	var wheelFrictionMed = 5;
	var wheelFrictionHigh = 9;
	var suspensionLow = 5;
	var suspensionMed = 20;
	var suspensionHigh = 35;
	var carDensityLow = 0.5;
	var carDensityMed = 2;
	var carDensityHigh = 3.5;
	
	//Car box2d vars
	var car, axle1, axle2, spring1, spring2, wheel1, wheel2, motor1, motor2;
	
	//car webGL vars
	var carBody1;
	var carBody2;
	var carBody3;
	var FRWheel; //front right wheel
	var FLWheel; //front left wheel
	var RRWheel; //rear right
	var RLWheel; //rear left
	var CAR_Z_HALF_WIDTH = 1.0;
	//todo, change if we are going to have adjustable wheel radius
	//var WHEEL1_OFFSET = (CAR_Z_HALF_WIDTH + wheel1Radius);
	//var WHEEL2_OFFSET = (CAR_Z_HALF_WIDTH + wheel2Radius);
	var wheel1_offset, wheel2_offset;
	var body1Points = []; //box body
		body1Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
		body1Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH,	0.5 * CAR_HEIGHT ) );
		body1Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	0.5 * CAR_HEIGHT ) );
		body1Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
	var body2Points = [];
		body2Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
		body2Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH,	0.5 * CAR_HEIGHT ) );
		body2Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	0.5 * CAR_HEIGHT ) );
		body2Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
		

//game.js variables
	var webGLTrackPieces = [];
	var currentLevel = 1;
	var timeElapsed = 0;