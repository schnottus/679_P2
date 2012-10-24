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
	sideCamera,
	chaseCamera,
	renderer,
	controls;
	var SCREEN_WIDTH = 1600, 
		SCREEN_HEIGHT = 600;
	var keyboard = new THREEx.KeyboardState();
	var CAMERA_DISTANCE = 15; //distance from camera to player
	var VIEW_ANGLE = 45; //camera view angle

//shader vars
	var uniforms = {
					time: { type: "f", value: 1.0 },
					resolution: { type: "v2", value: new THREE.Vector2() }
				};
	var utils;
	
//level.js vars
	var originalX = 0;
	var originalY = 0;
	var gameLost = false;
	var gameWon = false;
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
		//body2Points.push( new THREE.Vector2 (  2.4,  0.3 ) );
		//body2Points.push( new THREE.Vector2 (  2.2, 0.0 ) );

//game.js variables
	var webGLTrackPieces = [];
	var currentLevel = 1;
	var timeElapsed = 0;