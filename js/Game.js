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


		b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
	//car variables
	var car, axle1, axle2, spring1, spring2, wheel1, wheel2, motor1, motor2;
	


//global vars for example spheres
	var b2Circles = new Array();
	var glSpheres = new Array();
	var glTracks = new Array();
	var numSpheres = 15;
	
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
    fixDef.shape.SetAsBox(120, 1);
	//bodyDef.position.Set(0, 0);
	//world.CreateBody(bodyDef).CreateFixture(fixDef); //top of box
	bodyDef.position.Set(0, 80);
	world.CreateBody(bodyDef).CreateFixture(fixDef); //bottom of box
	fixDef.shape.SetAsBox(1, 80);
	bodyDef.position.Set(0, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef); //left wall
	bodyDef.position.Set(120, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef); //right wall
            
	//create some objects
	bodyDef.type = b2Body.b2_dynamicBody;
	for(var i = 0; i < numSpheres; ++i) 
	{
		fixDef.shape = new b2CircleShape(
			1.0 //radius
		);
		bodyDef.position.x = Math.random() * 5;
		bodyDef.position.y = Math.random() * 5 - 10;
		var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
		//alert("body" + body.m_body.GetPosition().x);
		b2Circles.push(body);
	}
	
	//create car
	CreateCar();

	//load level
	LoadLevel(0);

	
	//setup debug draw
	var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
		debugDraw.SetDrawScale(4.0);
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
	NEAR = 0.01,
	FAR = 1500;
	//create camera
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	// the camera starts at 0,0,0
	// so move it
	camera.position.set(0,10,-50);
	camera.lookAt(scene.position);
	// add the camera to the scene
	scene.add(camera);
	
	//rotate camera view to match box2d coordinate system ( x:0 and y:0 in upper left)
	//with this rotation positive z axis is going away from the camera
	camera.rotation.x = d2r(180);
	camera.rotation.z = d2r(0);
	camera.updateMatrix();
	
	//give us some control
	//controls = new THREE.TrackballControls( camera );
	
	
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,-250);
	scene.add(light);
	//var ambientLight = new THREE.AmbientLight(0xffffff);
	//scene.add(ambientLight);   

	//sphere parameters: radius, segments along width, segments along height
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	//create some spheres (to use with b2Circles created earlier)
	for(var i = 0; i < numSpheres; ++i) 
	{
		//box 2d circles 
		var sphereGeometry = new THREE.SphereGeometry( 1.0, 20, 16 ); 
		var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x95F717} ); 
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(b2Circles[i].m_body.GetPosition().x, 
							b2Circles[i].m_body.GetPosition().y,
							0);

		//alert(b2Circles[i].m_body.GetPosition().x);
		scene.add(sphere);
		glSpheres.push(sphere);
        
	}

    for (var i = 0; i < glTracks.length; ++i) {
        var trackGeometry = new THREE.CubeGeometry(glTracks[i].length, .2, 1, 1, 1, 1);

        var trackMaterial = new THREE.MeshLambertMaterial({ color: 0x11ffff });
        var track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.position.set(glTracks[i].x,
							glTracks[i].y,
							0);
        track.rotation.z = glTracks[i].angle;
		
     scene.add(track);
 
    }
	
	
	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	var axes = new THREE.AxisHelper();
	axes.scale.set( 0.1, 0.1, 0.1 );
	scene.add( axes );
	
	
	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xdddddd } );
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
	//Reset the motor in the car axles to give it a spring effect
	spring1.SetMaxMotorForce(30+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
	spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);
	spring2.SetMaxMotorForce(20+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
	spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));
	
	//update box2d world
	updateWorld();
	updateSpheres();
	updateCamera();
	
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
		
		glSpheres[i].position.set(b2Circles[i].m_body.GetPosition().x , 
							b2Circles[i].m_body.GetPosition().y ,
							0);
	}
};

//move camera to follow player
function updateCamera()
{
	camera.position.set(glSpheres[0].position.x,
						glSpheres[0].position.y,
						-CAMERA_DISTANCE);
	
	
}



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

function createTrack(length, height, angle) {

    var X_pivot = originalX;
    var Y_pivot = originalY;

    originalX = X_pivot + Math.cos(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));
    originalY = Y_pivot + Math.sin(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));


    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    //originalY = originalY + (height / 2);

    // fixDef.shape.SetAsBox(2, .1);
    fixDef.shape.SetAsOrientedBox(length / 2, height / 2, new b2Vec2(-(length / 2), -(height / 2)), angle);
    bodyDef.position.Set(originalX, originalY);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    var track = {
    "x" : bodyDef.position.x,
    "y": bodyDef.position.y,
    "length" : length,
    "angle" : angle,
    };
    glTracks.push(track);

    originalY = Y_pivot + length * Math.sin(angle);
    originalX = X_pivot + length * Math.cos(angle);

};

function LoadLevel(level) {

    if (level == 0) {
        LoadLevel1();
    }

}

function LoadLevel1() {
    originalX = 0;
    originalY = 0;

    for (var j = 0; j < 50; j++) {
        createTrack(2, .1, Math.random());
    }

}
