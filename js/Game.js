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

function updateWorld() 
{
	//TODO Fix Step to use delta time
	world.Step(1 / 60, 10, 10);
	world.DrawDebugData();
	world.ClearForces();
};

//gl animate loop
function animate() 
{
	//timeElapsed++;
	//Check if the level is completed
	if (gameWon) {
	//if (timeElapsed >= 500) {
		requestAnimationFrame(levelCompleted);
	}
	else {
		requestAnimationFrame( animate ); //this is where the example had it placed, also I've read it should be placed immediately before render()
		render(); //draw updated game
		update(); //update game state
	}
}

//gl loop, updates on every requestAnimationFrame
function update()
{

	//var delta = clock.getDelta(); // seconds.
	
	//update box2d world
	updateWorld();
	updateSpheres();
	updateCar();
	updateCameras();
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

	chaseCamera.aspect =  (0.5 * SCREEN_WIDTH) / SCREEN_HEIGHT;
	sideCamera.aspect =  (0.5 * SCREEN_WIDTH) / SCREEN_HEIGHT;
	chaseCamera.updateProjectionMatrix();
	sideCamera.updateProjectionMatrix();
	
	renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.clear();
	
	//setViewport(x,y,width,height);
	// left side
	renderer.setViewport( 0, 0, 0.5 * SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.render( scene, sideCamera );
	
	// upper right side
	renderer.setViewport( 0.5 * SCREEN_WIDTH , 0,  0.5 * SCREEN_WIDTH , SCREEN_HEIGHT );
	renderer.render( scene, chaseCamera );
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
	
	var frontX = wheel1.GetPosition().x;
	var frontY = wheel1.GetPosition().y;
	var rearX = wheel2.GetPosition().x;
	var rearY = wheel2.GetPosition().y;
	FRWheel.position.set(frontX, frontY, WHEEL1_OFFSET);
	FLWheel.position.set(frontX, frontY, -WHEEL1_OFFSET);
	RRWheel.position.set(rearX, rearY, WHEEL2_OFFSET);
	RLWheel.position.set(rearX, rearY, -WHEEL2_OFFSET);
	
	carBody.position.set(car.GetPosition().x ,
						car.GetPosition().y ,
						(-0.5*CAR_WIDTH));
	carBody.rotation.z = car.GetAngle();
	
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
function updateCameras()
{

	sideCamera.position.set(carBody.position.x - 4,
						carBody.position.y - 6,
						-CAMERA_DISTANCE);
	//alert("x: " + carBody.position.x + "\n y: " + carBody.position.y + "\n z: " + carBody.position.z);
	sideCamera.lookAt(carBody.position);
	sideCamera.rotation.z = d2r(0);
	
	chaseCamera.position.set(carBody.position.x - 6,
						carBody.position.y - 4,
						0);
	//alert("x: " + carBody.position.x + "\n y: " + carBody.position.y + "\n z: " + carBody.position.z);
	chaseCamera.lookAt(new THREE.Vector3( carBody.position.x,
						carBody.position.y - 1,
						0 ));
	chaseCamera.rotation.z = d2r(270);
	//chaseCamera.rotation.x = d2r(0);
}

function levelCompleted() {
	clearCanvas();
	
	//Display appropriate menu
	switch(currentLevel) {
		case 1: {
			showInterimMenu();
			break;
		}
		case 2: {
			showInterimMenu();
			break;
		}
		case 3: {
			showInterimMenu();
			break;
		}
		case 4: {
			showInterimMenu();
			break;
		}
		case 5: {
			showInterimMenu();
			break;
		}
		case 6: {
			var divEndMenu = document.getElementById("endMenu");
			divEndMenu.style.display = "block";
			break;
		}
		default: { //Restart if there was an error
			var divStartMenu = document.getElementById("startMenu");
			divStartMenu.style.display = "block";
			currentLevel = 1;
			gameLost = false;
			gameWon = false;
			break;
		}
	}
}

//show the appropriate menu after completing a level
function showInterimMenu() {
	var divInterimMenu = document.getElementById("interimMenu");	
	divInterimMenu.style.display = "block";
	
	var nextLevel = currentLevel + 1;
	var btnNextLevel = document.getElementById("btnNextLevel");
	btnNextLevel.setAttribute("onclick","startLevel(" + nextLevel + ");")
	btnNextLevel.innerHTML = "Level " + nextLevel;
}

//show canvases, hide menus, and reset level variables
function startLevel(level) {
	//WebGL, debugDraw, and menu html divs
	var	divWebGL = document.getElementById("container");
	var divDebugDraw = document.getElementById("debugDraw");
	var divStartMenu = document.getElementById("startMenu");
	var divInterimMenu = document.getElementById("interimMenu");

	divWebGL.style.display = "block";
	divDebugDraw.style.display = "block";
	divStartMenu.style.display = "none";
	divInterimMenu.style.display = "none";
	
	gameLost = false;
	gameWon = false;
	currentLevel = level;
	timeElapsed = 0;
	
	if (level == 1)
		init();
	else {
		LoadLevel(level);
		CreateCar(3);
		drawWebGLTrack();
		animate();
	}
}

function clearCanvas() {
	clearBox2DCanvas();
	clearWebGLCanvas();

	//Hide canvases
	var	divWebGL = document.getElementById("container");
	var divDebugDraw = document.getElementById("debugDraw");
	divWebGL.style.display = "none";
	divDebugDraw.style.display = "none";
}

//Remove all bodies and joints from the box2D canvas
function clearBox2DCanvas() {
	while (world.GetBodyCount() > 0) {
		world.DestroyBody(world.GetBodyList());
	}
	while (world.GetJointCount() > 0) {
		world.DestroyJoint(world.GetJointList());
	}
}

function clearWebGLCanvas() {
	//Remove the car from WebGL
	scene.remove(carBody);
	scene.remove(FRWheel);
	scene.remove(FLWheel);
	scene.remove(RRWheel);
	scene.remove(RLWheel);
	
	//Remove the tracks from WebGL
	for (var i = 0; i < webGLTrackPieces.length; ++i) {
		scene.remove(webGLTrackPieces[i]);
	}
	webGLTrackPieces = [];
	glTracks = [];
}