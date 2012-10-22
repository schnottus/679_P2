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
	var DEBUGDRAW_SCALE = 16; //make smaller to see whole level, higher numbers zoom in (on origin)
	
	//car controls
	var tiltLeft = false;
	var tiltRight = false;
	var applyBrake = false;

	var yMax;
	var xMax;

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
	
	
//level.js vars
	var originalX = 0;
	var originalY = 0;
	var gameLost = false;
	var gameWon = true;
	//gl vars
	var TRACK_WIDTH = 5;
	
//car.js vars
	//constants
	var CAR_WIDTH = 3;
	var CAR_HEIGHT = 0.6;
	var CAR_X = 4;
	var CAR_Y = 4;
	var CAR_ANGLE = 210;
	var CAR_TILT = 30;
	
	//adjustable by player
	//Wheel radius, friction, suspension, body mass/density, body shape?
	var wheel1Radius = 0.7;
	var wheel2Radius = 0.7;
	var wheelFriction = 5;
	var suspension = 20; //Higher number gives a firmer spring
	var carDensity = 2;
	
	//car box2d vars
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
	var WHEEL1_OFFSET = (CAR_Z_HALF_WIDTH + wheel1Radius);
	var WHEEL2_OFFSET = (CAR_Z_HALF_WIDTH + wheel2Radius);
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
	