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
	
//three.js vars
	var container,
	scene, 
	camera, 
	renderer, 
	controls;
	var SCREEN_WIDTH = 800, 
	SCREEN_HEIGHT = 600;  //view size in pixels
	var keyboard = new THREEx.KeyboardState();
	var CAMERA_DISTANCE = 20; //distance from camera to player
	
	
//level.js vars
	var originalX = 0;
	var originalY = 0;
	
//car.js vars  
	//car box2d vars
	var car, axle1, axle2, spring1, spring2, wheel1, wheel2, motor1, motor2;
	var wheel1Radius = 0.7;
	var wheel2Radius = 0.7;
	//car webGL vars
	var carBody;
	var frontWheel;
	var rearWheel;
	var CAR_WIDTH = 3;
	var CAR_HEIGHT = 0.6;
	