/******************
* File: Game.js
* Author: Scott Larson, Eric Satterness, Paul Bolanowski
* Date: 15 Oct 2012
*
*Notes:
*
*TODO:
* - fix box2d Step world function to use deltaTime and not fixed (1/60) ratio
* - fix camera to follow box2d world and coordinates
* - modify three.js detector message for no webGL support
*******************/

//global vars for example spheres
	var b2Circles = new Array();
	var glSpheres = new Array();
	var glTracks = new Array();
	var numSpheres = 0;
	
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
	//bodyDef.position.Set(0, 80);
	//world.CreateBody(bodyDef).CreateFixture(fixDef); //bottom of box
	fixDef.shape.SetAsBox(1, 80);
	bodyDef.position.Set(0, 0);
	world.CreateBody(bodyDef).CreateFixture(fixDef); //left wall
	//bodyDef.position.Set(120, 0);
	//world.CreateBody(bodyDef).CreateFixture(fixDef); //right wall
            
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
			
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,-150);
	scene.add(light);
	//var ambientLight = new THREE.AmbientLight(0xffffff);
	//scene.add(ambientLight);   
	
	
	
	//create some example objects
	bodyDef.type = b2Body.b2_dynamicBody;
	for(var i = 0; i < numSpheres; ++i) 
	{
		fixDef.shape = new b2CircleShape(
			1.0 //radius
		);
		bodyDef.position.x = Math.random() * 5 + 4;
		bodyDef.position.y = Math.random() * 5 - 10;
		var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
		b2Circles.push(body);
	}
	
	//create car
	CreateCar();

	//load level
	LoadLevel(2);
	
	//add listeners for our controls
	document.addEventListener("keydown", function(e) {
		//down arrow key
		if (e.keyCode == 40) {
			applyBrake = true;
		}
		//right arrow key
		else if (e.keyCode == 39) {
			tiltRight = true;
		}
		//left arrow key
		else if (e.keyCode == 37) {
			tiltLeft = true;
		}
    }, true);
	
	document.addEventListener("keyup", function(e) {
		//down arrow key
		if (e.keyCode == 40) {
			applyBrake = false;
		}
		//right arrow key
		else if (e.keyCode == 39) {
			tiltRight = false;
		}
		//left arrow key
		else if (e.keyCode == 37) {
			tiltLeft = false;
		}
    }, true);
			

	//sphere parameters: radius, segments along width, segments along height
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	//create some spheres (to use with b2Circles created earlier)
	for(var i = 0; i < numSpheres; ++i) 
	{ 
		var sphereGeometry = new THREE.SphereGeometry( 1.0, 20, 16 ); 
		var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x95F717} ); 
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(b2Circles[i].m_body.GetPosition().x, 
							b2Circles[i].m_body.GetPosition().y,
							0);
		scene.add(sphere);
		glSpheres.push(sphere);
        
	}

    for (var i = 0; i < glTracks.length; ++i) {
        var trackGeometry = new THREE.CubeGeometry(glTracks[i].length, glTracks[i].height, 1, 1, 1, 1);

        var trackMaterial = new THREE.MeshLambertMaterial({ color: glTracks[i].color});
        var track = new THREE.Mesh(trackGeometry, trackMaterial);
      track.rotation.z = glTracks[i].angle;
		
        track.position.set(glTracks[i].x,
							glTracks[i].y,
							0);
        //track.rotation.z = glTracks[i].angle;
		
     scene.add(track);
 
    }
	
	
	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	var axes = new THREE.AxisHelper();
	axes.scale.set( 0.1, 0.1, 0.1 );
	scene.add( axes );
	
	// create skybox
	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xdddddd } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
	scene.add(skyBox);
	
	//background filler texture
	// note: 4x4 checkboard pattern scaled so that each square is 10 meters by 10 meters.
	var backTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	backTexture.wrapS = backTexture.wrapT = THREE.RepeatWrapping; 
	backTexture.repeat.set( 100, 100 );
	var backMaterial = new THREE.MeshBasicMaterial( { map: backTexture } );
	var backGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var background = new THREE.Mesh(backGeometry, backMaterial);
	background.position.y = -5;
	background.position.x = -5;
	background.position.z = 10;
	background.rotation.x = d2r(90);
	background.doubleSided = true;
	scene.add(background);
	 
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
	//update box2d world
	updateWorld();
	updateSpheres();
	updateCar();
	updateCamera();
	updateDebugDraw();
    updateGameState();
    updateText();
	
}

function updateGameState(){
    if(carBody.position.x > xMax){
        gameWon = true;
    }
    if(carBody.position.y > yMax){
        gameLost = true;
    }


}

function updateText(){
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#339933"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    ctx.font = "20px monospace";	//
    
    if(!isOnGround){
        ctx.fillText("Nice Air", canvas.width/2, canvas.height/2);
    }

    if(gameLost)
    {
        ctx.fillText("Game Over", canvas.width/2, (canvas.height*3)/4);
    } else if (gameWon){
        ctx.fillText("Great Job! You Won!", canvas.width/2, canvas.height/2);
    }

}

//gl render scene
function render() 
{	
	renderer.render( scene, camera );
}

function updateCar()
{
	//Reset the motor in the car axles to give it a spring effect
	spring1.SetMaxMotorForce(suspension+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
	spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);
	spring2.SetMaxMotorForce(suspension+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
	spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));
	
	if (tiltRight) {
		car.ApplyTorque(CAR_TILT);
	}
	if (tiltLeft) {
		car.ApplyTorque(-CAR_TILT);
	}
	if (applyBrake) {
		//motor1.EnableLimit(true);
		motor2.EnableLimit(true);
	}
	else {
		//motor1.EnableLimit(false);
		motor2.EnableLimit(false);
	}
	
	frontWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						0);
	rearWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						0);
	carBody.position.set(car.GetPosition().x ,
						car.GetPosition().y ,
						0);
	carBody.rotation.z = car.GetAngle();
}

function updateDebugDraw()
{
	debugDraw.x = 50;
	debugDraw.y = 50;
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

	camera.position.set(carBody.position.x,
						carBody.position.y - 2,
						-CAMERA_DISTANCE);
	//camera.lookAt(carBody.position.x, carBody.position.y, 0);
	
	
}



function createMovingObject(x,y){
     bodyDef.type = Box2D.Dynamics.b2_kinematicBody; //this will be a kinematic body
     bodyDef.position.Set(x, y);
     fixDef.shape.SetAsBox(2,2);
     var movingBody = world.CreateBody(bodyDef).CreateFixture(fixDef);
    // movingBody.SetLinearVelocity(new b2Vec2(0,1));
    
}


