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
	if(DRAW_DEBUGDRAW) world.DrawDebugData();
	world.ClearForces();
};

//gl animate loop
function animate()
{
	/*timeElapsed++;
	if (reloadLevelBool) { //Check if we need to reload the level
		requestAnimationFrame(reloadLevel);
	}
	else if (gameWon) { //Check if the level was completed
	//else if (timeElapsed >= 100) {
		requestAnimationFrame(levelCompleted);
	}
	else {*/
		requestAnimationFrame( animate ); //this is where the example had it placed, also I've read it should be placed immediately before render()
		render(); //draw updated game
		update(); //update game state
	//}
}

//gl loop, updates on every requestAnimationFrame
function update()
{

	var delta = clock.getDelta(); // seconds since last call
	
	//update box2d world
	updateWorld();
	updateCar();
	updateCameras();
    updateGameState();
    if(DRAW_DEBUGDRAW) updateText();
	
}

function updateGameState(){
    if(carBody.position.x > xMax && carBody.position.y < yMin){
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
	//for shader
	uniforms.time.value += 0.05;
	
	renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.clear();
	
	var leftCam,
		upperRightCam,
		lowerRightCam;
		
	switch(mainCam)
	{
	case 1:
		leftCam = camera1;
		upperRightCam = camera2;
		lowerRightCam = camera3;
	break;
	case 2:
		leftCam = camera2;
		upperRightCam = camera1;
		lowerRightCam = camera3;
	break;
	case 3:
		leftCam = camera3;
		upperRightCam = camera1;
		lowerRightCam = camera2;
	break;
	default:
		leftCam = camera1;
		upperRightCam = camera2;
		lowerRightCam = camera3;
	}
	
	//setViewport(x,y,width,height);
	// left side
	renderer.setViewport( 0, 0, 0.7 * SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.render( scene, leftCam );
	
	// upper right side
	renderer.setViewport( 0.7 * SCREEN_WIDTH , 0.5 * SCREEN_HEIGHT,  0.3 * SCREEN_WIDTH , 0.5 * SCREEN_HEIGHT );
	renderer.render( scene, upperRightCam );
	
	// lower right side
	renderer.setViewport( 0.7 * SCREEN_WIDTH , 0,  0.3 * SCREEN_WIDTH , 0.5 * SCREEN_HEIGHT );
	renderer.render( scene, lowerRightCam );
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
	FRWheel.position.set(frontX, frontY, -wheel1_offset);
	FLWheel.position.set(frontX, frontY, wheel1_offset);
	RRWheel.position.set(rearX, rearY, -wheel2_offset);
	RLWheel.position.set(rearX, rearY, wheel2_offset);
	
	carBody.position.set(car.GetPosition().x ,
						car.GetPosition().y ,
						(-0.5*CAR_WIDTH));
	carBody.rotation.z = car.GetAngle();
	
}

//move camera to follow player
function updateCameras()
{

	camera1.position.set(carBody.position.x - 3.5,
						carBody.position.y - 5,
						-CAMERA1_DISTANCE);
	//alert("x: " + carBody.position.x + "\n y: " + carBody.position.y + "\n z: " + carBody.position.z);
	camera1.lookAt(carBody.position);
	camera1.rotation.z = d2r(0);
	
	camera2.position.set(carBody.position.x - 24,
						carBody.position.y -6,
						-CAMERA2_DISTANCE);
	
	//camera2.rotation.y = d2r(340);
	camera2.lookAt(new THREE.Vector3( carBody.position.x,
						carBody.position.y - 6,
						4-CAMERA2_DISTANCE ));
	camera2.rotation.z = d2r(0);
	//camera2.rotation.y = d2r(-65);
	
	//camera2.rotation.y = d2r(180);
	//camera2.rotation.x = d2r(0);
	//alert("cam2 rotY: " + camera2.rotation.y + "\n cam2 rotX: " + camera2.rotation.x + "\n cam2 rotZ: " + camera2.rotation.z);
	
	camera3.position.set(carBody.position.x,
						carBody.position.y - 25,
						-CAMERA3_DISTANCE);
	camera3.lookAt(carBody.position);
	camera3.rotation.z = d2r(0);
	//camera3.rotation.y = d2r(-65);
}

//Level completed, show the menu screen
function levelCompleted() {
	clearCanvases();
	var nextLevel = currentLevel + 1;
	showMenu(nextLevel);
}

//Reload the current level
function reloadLevel() {
	clearCanvases();
	showMenu(currentLevel);
}

//Display appropriate menu
function showMenu(level) {
	if (level <= 1) {
		showStartMenu();
	}
	else if (level <= GetNumberOfLevels()) {
		showInterimMenu(level);
	}
	else {
		showEndMenu();
	}
}

function showStartMenu() {
	var divStartMenu = document.getElementById("startMenu");
	divStartMenu.style.display = "block";
	currentLevel = 1;
}

function showInterimMenu(level) {
	var divInterimMenu = document.getElementById("interimMenu");	
	divInterimMenu.style.display = "block";
	
	var interimHeader = document.getElementById("interimHeader");
	interimHeader.innerHTML = "LEVEL " +  (level - 1) + " COMPLETE";
	
	var btnNextLevel = document.getElementById("btnNextLevel");
	btnNextLevel.setAttribute("onclick","startLevel(" + level + ");")
	btnNextLevel.innerHTML = "Level " + level;
}

function showEndMenu() {
	var divEndMenu = document.getElementById("endMenu");
	divEndMenu.style.display = "block";
}

//Show canvases, hide menus, and reset level variables
function startLevel(level) {
	//WebGL, debugDraw, and menu html divs
	var	divWebGL = document.getElementById("container");
	if(DRAW_DEBUGDRAW) var divDebugDraw = document.getElementById("debugDraw");
	var divStartMenu = document.getElementById("startMenu");
	var divInterimMenu = document.getElementById("interimMenu");

	divWebGL.style.display = "block";
	if(DRAW_DEBUGDRAW) divDebugDraw.style.display = "block";
	divStartMenu.style.display = "none";
	divInterimMenu.style.display = "none";
	
	
	if (level == 1 && !reloadLevelBool) //First level and not a reload
		init();
	else {
		//Reset level variables
		reloadLevelBool = false;
		gameLost = false;
		gameWon = false;
		currentLevel = level;
		timeElapsed = 0;
	
		LoadLevel(level);
		CreateCar(carBodyNum);
		drawWebGLTrack();
		animate();
	}
}

//Clear the car and track from the canvases and then hide the canvases
function clearCanvases() {
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
		//GetBodyList returns only one body, not a list
		world.DestroyBody(world.GetBodyList());
	}
	while (world.GetJointCount() > 0) {
		//GetJointList returns only one joint, not a list
		world.DestroyJoint(world.GetJointList());
	}
}

//Remove the car and track from the WebGL canvas
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
	
	//Clear our list of tracks
	webGLTrackPieces = [];
	glTracks = [];
}