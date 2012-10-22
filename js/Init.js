//global vars for example spheres
	var b2Circles = new Array();
	var glSpheres = new Array();
	var glTracks = new Array();
	var numSpheres = 0;

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
		debugDraw.SetDrawScale(DEBUGDRAW_SCALE);
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
	renderer.setClearColorHex( 0x000000, 1 );
	renderer.autoClear = false;

	//create scene
	scene = new THREE.Scene();
	
	//camera attributes
	var	ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
	NEAR = 0.01,
	FAR = 1500;
	
	//create camera
	sideCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(sideCamera);
	//rotate camera view to match box2d coordinate system ( x:0 and y:0 in upper left)
	//with this rotation positive z axis is going away from the camera
	sideCamera.rotation.x = d2r(180);
	sideCamera.rotation.z = d2r(0);
	sideCamera.updateMatrix();

	chaseCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(chaseCamera);
	chaseCamera.rotation.x = d2r(180);
	chaseCamera.rotation.z = d2r(0);
	chaseCamera.updateMatrix();
			
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100,-10,-150);
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
	CreateCar( 3 );

	//load level
	LoadLevel(1);
	
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

	//draw track that corresponds to box2dweb level
	//THREE.CubeGeometry = function ( width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, sides )
    for (var i = 0; i < glTracks.length; ++i) {
        var trackGeometry = new THREE.CubeGeometry(glTracks[i].length, glTracks[i].height, TRACK_WIDTH, 1, 1, 1);

        var trackMaterial = new THREE.MeshLambertMaterial({ color: glTracks[i].color});
        var track = new THREE.Mesh(trackGeometry, trackMaterial);
      track.rotation.z = glTracks[i].angle;
		
		//-1 from x as workaround (why is track offset?)
        track.position.set(glTracks[i].x - 1,
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
	var skyBoxGeometry = new THREE.CubeGeometry( 2000, 2000, 2000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xdddddd } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
	scene.add(skyBox);
	
	//background filler texture
	// note: 4x4 checkboard pattern
	var backTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	backTexture.wrapS = backTexture.wrapT = THREE.RepeatWrapping; 
	backTexture.repeat.set( 100, 100 );
	var backMaterial = new THREE.MeshBasicMaterial( { map: backTexture } );
	var backGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
	var background = new THREE.Mesh(backGeometry, backMaterial);
	background.position.y = -5;
	background.position.x = -5;
	background.position.z = 10;
	background.rotation.x = d2r(90);
	background.doubleSided = true;
	scene.add(background);
	 
	animate();
};