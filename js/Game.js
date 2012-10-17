/******************
* File: Game.js
* Author: Scott Larson
* Date: 15 Oct 2012
*
*Notes:
*
*TODO:
* - fix box2d Step world function to use deltaTime and not fixed (1/60) ratio
* - fix camera to follow box2d world and coordinates
* - modify three.js detector message for no webGL support
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
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
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
	var SCALE_FACTOR = 20;
	
	//for example spheres
	var b2Circles = new Array();
	var glSpheres = new Array();
	var numSpheres = 20;
	
function updateWorld() 
{
	//TODO Fix Step to use delta time
	world.Step(1 / 60, 10, 10);
	world.DrawDebugData();
	world.ClearForces();
};

function init() 
{
	
	/***BOX2D SETUP***/
         
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(12, 0.1);
	bodyDef.position.Set(0, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(0, 8);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(0.1, 8);
	bodyDef.position.Set(0, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(12, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
            
	//create some objects
	bodyDef.type = b2Body.b2_dynamicBody;
	for(var i = 0; i < numSpheres; ++i) 
	{
		fixDef.shape = new b2CircleShape(
			0.5 //radius
		);
		bodyDef.position.x = Math.random() * 5;
		bodyDef.position.y = Math.random() * 5;
		var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
		//alert("body" + body.m_body.GetPosition().x);
		b2Circles.push(body);
	}
	
	//create car
	createCar();
	
	//setup debug draw
	var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
		debugDraw.SetDrawScale(10.0);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
			

	/***WEBGL SETUP***/
	//check to make sure webGL is available, if not populate message div with message
	//TODO: modify standard message?
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	// get the DOM element to attach to
	container = document.getElementById('container');
	// start the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	// attach the render-supplied DOM element
	container.appendChild(renderer.domElement);

	//create scene
	scene = new THREE.Scene();
	
	//camera attributes
	var VIEW_ANGLE = 45,
	ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
	NEAR = 1,
	FAR = 10000;
	//create camera
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	// the camera starts at 0,0,0
	// so move it back
	camera.position.set(0,200,600);
	camera.lookAt(scene.position);
	// add the camera to the scene
	scene.add(camera);
	
	//give us some control
	controls = new THREE.TrackballControls( camera );

	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	//var ambientLight = new THREE.AmbientLight(0xffffff);
	//scene.add(ambientLight);   

	//sphere parameters: radius, segments along width, segments along height
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	//create some spheres (to use with b2Circles created earlier)
	for(var i = 0; i < numSpheres; ++i) 
	{
		//0.5 is radius of box 2d circles (then scale up)
		var sphereGeometry = new THREE.SphereGeometry( 0.5 * SCALE_FACTOR, 20, 16 ); 
		var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x111fff} ); 
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(b2Circles[i].m_body.GetPosition().x * SCALE_FACTOR, 
							b2Circles[i].m_body.GetPosition().y * SCALE_FACTOR,
							0);
		//alert(b2Circles[i].m_body.GetPosition().x);
		scene.add(sphere);
		glSpheres.push(sphere);
	}
	
	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	var axes = new THREE.AxisHelper();
	axes.scale.set( 1, 1, 1 );
	scene.add( axes );
	
    // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.doubleSided = true;
	scene.add(floor);
	
	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
	scene.add(skyBox);
	 
	animate();
};

//gl animate loop
function animate() 
{
    requestAnimationFrame( animate ); //this is where the example had it placed, also I've read it should be placed immediately before render()
	render(); //draw updated game
	update(); //update game state
	
}

//gl loop, updates on every requestAnimationFrame
function update()
{

	// functionality provided by THREEx.KeyboardState.js
	if ( keyboard.pressed("1") )
		document.getElementById('message').innerHTML = 'Pressed 1';	
	if ( keyboard.pressed("2") )
		document.getElementById('message').innerHTML = 'Pressed 2 ';	
	
	//three.js provided pan and rotate with mouse
	controls.update();
	
	//update box2d world
	updateWorld();
	
	updateSpheres();
	
}

//gl render scene
function render() 
{	
	renderer.render( scene, camera );
}

function updateSpheres()
{
	for(var i = 0; i < numSpheres; ++i) 
	{
		
		glSpheres[i].position.set(b2Circles[i].m_body.GetPosition().x * SCALE_FACTOR, 
							b2Circles[i].m_body.GetPosition().y * SCALE_FACTOR,
							0);
	}
};

function createCar()
{
	//create car
	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.density = 30;
	fixDef.friction = 10;
	fixDef.restitution = 0.1;
	fixDef.shape = new b2CircleShape(0.6);
	
	//  wheel1
	bodyDef.position.Set(4,5);
	var wheel1=world.CreateBody(bodyDef);
	wheel1.CreateFixture(fixDef);
	//  wheel2
	bodyDef.position.Set(6,5);
	var wheel2=world.CreateBody(bodyDef);
	wheel2.CreateFixture(fixDef);
	 
	//  Car body
	bodyDef.position.Set(5,5);
	//  just change the fixDef.shape and keep other properties
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(0.5,0.1);
	var car = world.CreateBody(bodyDef);
	car.CreateFixture(fixDef);
	 
	//  Revolute Joints
	var revoluteJointDef1 = new b2RevoluteJointDef();
	revoluteJointDef1.Initialize(car, wheel1, wheel1.GetWorldCenter());
	revoluteJointDef1.maxMotorTorque = 3000.0;
	revoluteJointDef1.motorSpeed = 6.0;
	revoluteJointDef1.enableMotor = true;
	revoluteJointA = world.CreateJoint(revoluteJointDef1);
	
	var revoluteJointDef2 = new b2RevoluteJointDef();
	revoluteJointDef2.Initialize(car, wheel2, wheel2.GetWorldCenter());
	revoluteJointDef2.maxMotorTorque = 3000.0;
	revoluteJointDef2.motorSpeed = 6.0;
	revoluteJointDef2.enableMotor = true;
	revoluteJointB = world.CreateJoint(revoluteJointDef2);
}