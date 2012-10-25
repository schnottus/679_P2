//global vars for example spheres

	var glTracks = new Array();


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
	if(DRAW_DEBUGDRAW)
	{
		var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
			debugDraw.SetDrawScale(DEBUGDRAW_SCALE);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
	}
		
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
	renderer.setClearColorHex( 0x000000, 1 );
	renderer.autoClear = false;

	//create scene
	scene = new THREE.Scene();
	
	//camera attributes
	var	ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
	NEAR = 0.01,
	FAR = 5500;
	
	//create camera
	camera1 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera1);
	//rotate camera view to match box2d coordinate system ( x:0 and y:0 in upper left)
	//with this rotation positive z axis is going away from the camera
	camera1.rotation.x = d2r(180);
	camera1.rotation.z = d2r(0);
	camera1.updateMatrix();

	camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera2);
	camera2.rotation.x = d2r(180);
	camera2.rotation.z = d2r(0);
	camera2.updateMatrix();
	
	camera3 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera3);
	camera3.rotation.x = d2r(180);
	camera3.rotation.z = d2r(0);
	camera3.updateMatrix();
	
	camera1.aspect =  (0.7 * SCREEN_WIDTH) / SCREEN_HEIGHT;
	camera2.aspect =  (0.3 * SCREEN_WIDTH) / (0.5 * SCREEN_HEIGHT);
	camera3.aspect =  (0.3 * SCREEN_WIDTH) / (0.5 * SCREEN_HEIGHT);
	camera1.updateProjectionMatrix();
	camera2.updateProjectionMatrix();
	camera3.updateProjectionMatrix();
			
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100,-10,-150);
	scene.add(light);
	//var ambientLight = new THREE.AmbientLight(0xffffff);
	//scene.add(ambientLight);   
	
	
	//Disable the car customization buttons
	var interimMenuChildren = document.getElementById("interimMenu").getElementsByTagName('button');
	for  (i = 0; i < interimMenuChildren.length; i++) {
		var elm = interimMenuChildren[i];
		if (elm.id != "btnNextLevel") {
			elm.setAttribute("disabled", "true");
		}
	}
	
	//default car customization variables
	wheel1Radius = wheelRadiusMed;
	wheel2Radius = wheelRadiusMed;
	wheelFriction = wheelFrictionMed;
	suspension = suspensionMed;
	carDensity = carDensityMed;
	carBodyNum = 3;
	
	wheel1_offset = CAR_Z_HALF_WIDTH + wheel1Radius;
	wheel2_offset = CAR_Z_HALF_WIDTH + wheel2Radius;
	
	//create car
	CreateCar(carBodyNum);

	//load level
	LoadLevel(1);
	
	//add listeners for our controls
	document.addEventListener("keydown", function(e) {
		//down arrow key
		/*if (e.keyCode == 40) {
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
		//spacebar
		//else if (e.keyCode == 32) {
		//	reloadLevelBool = true;
		//}*/
		switch(e.keyCode)
		{
		case 40: //down arrow
			applyBrake = true;
		break;
		case 39: //right arrow
			tiltRight = true;
		break;
		case 37: //left arrow
			tiltLeft = true;
		break;
		case 32: //space bar
			//reloadLevelBool = true;
		break;
		case 49: //1 key
			mainCam = 1;
		break;
		case 50: //2 key
			mainCam = 2;
		break;
		case 51: //3 key
			mainCam = 3;
		break;
		default:
		}
    }, true);
	
	document.addEventListener("keyup", function(e) {
		//down arrow key
		/*if (e.keyCode == 40) {
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
		//spacebar
		else if (e.keyCode == 32) {
			reloadLevelBool = true;
		}*/
		switch(e.keyCode)
		{
		case 40: //down arrow
			applyBrake = false;
		break;
		case 39: //right arrow
			tiltRight = false;
		break;
		case 37: //left arrow
			tiltLeft = false;
		break;
		case 32: //space bar
			reloadLevelBool = true;
		break;
		default:
		}
    }, true);


	drawWebGLTrack();
	
	
	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	var axes = new THREE.AxisHelper();
	axes.scale.set( 0.1, 0.1, 0.1 );
	scene.add( axes );
	
	// create skybox
	//images from http://www.quadropolis.us/node/617
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_rt.jpg' ) })); 	//xpos
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_lf.jpg' ) }));	//xneg
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_up.jpg' ) }));	//ypos
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_dn.jpg' ) }));	//yneg
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_bk.jpg' ) }));	//zpos
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/sky1_ft.jpg' ) }));	//zneg
	var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1, materialArray );
	var skybox = new THREE.Mesh( skyboxGeom, new THREE.MeshFaceMaterial() );
	skybox.rotation.z = d2r(180);
	skybox.position.y = 400; // move the skybox down a little to see some sky
	skybox.flipSided = true;
	scene.add( skybox );	
	
	//lava floor texture
	var lavaMaterial = new THREE.ShaderMaterial( {

					uniforms: uniforms,
					vertexShader: document.getElementById( 'lavaVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'lavaFragShader' ).textContent
				} );
	var lavaGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
	var lavaMesh = new THREE.Mesh(lavaGeometry, lavaMaterial);
	lavaMesh.position.y = 300;
	lavaMesh.position.x = 0;
	lavaMesh.position.z = 0;
	//lavaMesh.doubleSided = true;
	lavaMesh.flipSided = true;
	scene.add(lavaMesh);
	 
	animate();
};