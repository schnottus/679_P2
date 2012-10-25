	
function createTrack(length, height, angle, color, friction) {

    var X_pivot = originalX;
    var Y_pivot = originalY;

    originalX = X_pivot + Math.cos(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));
    originalY = Y_pivot + Math.sin(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));


    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.friction = friction;
    //originalY = originalY + (height / 2);

    // fixDef.shape.SetAsBox(2, .1);
    fixDef.shape.SetAsOrientedBox(length / 2, height / 2, new b2Vec2(-(length / 2), -(height / 2)), angle);
    bodyDef.position.Set(originalX, originalY);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    var track = {
    "x" : bodyDef.position.x,
    "y": bodyDef.position.y,
    "length" : length,
    "height" : height,
    "color" : color,
    "angle" : angle,
    };
    glTracks.push(track);

    originalY = Y_pivot + length * Math.sin(angle);
    originalX = X_pivot + length * Math.cos(angle);

    if(originalY > yMax){
     yMax = originalY + 20;
    }
      
}

function createSpace(length, height, angle){
    var X_pivot = originalX;
    var Y_pivot = originalY;

    originalX = X_pivot + Math.cos(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));
    originalY = Y_pivot + Math.sin(angle - Math.atan(height / length)) / Math.sqrt((length / 2) * (length / 2) + (height / 2) * (height / 2));

    originalY = Y_pivot + length * Math.sin(angle);
    originalX = X_pivot + length * Math.cos(angle);

}

function createRamp(length, height, maxAngle, color, friction){
        var total = length / 2;
        var angleMargin = maxAngle / total;
        var angle = 0;
        for(var i = 0; i < total; i++){
            createTrack(2, height, angle, color, friction);
            angle+=angleMargin; 
        }
}

function createMovingObject(x,y){
     bodyDef.type = Box2D.Dynamics.b2_kinematicBody; //this will be a kinematic body
     bodyDef.position.Set(x, y);
     fixDef.shape.SetAsBox(2,2);
     var movingBody = world.CreateBody(bodyDef).CreateFixture(fixDef);
    // movingBody.SetLinearVelocity(new b2Vec2(0,1));
    
}

//draw track that corresponds to box2dweb level
function drawWebGLTrack() {
	//THREE.CubeGeometry = function ( width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, sides )
    for (var i = 0; i < glTracks.length; ++i) {
        var trackGeometry = new THREE.CubeGeometry(glTracks[i].length, glTracks[i].height, TRACK_WIDTH, 10, 10, 10);

		uniforms.resolution.value.x = (0.5 * SCREEN_WIDTH);
		uniforms.resolution.value.y = SCREEN_HEIGHT;
		shaderMat = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: document.getElementById( 'trackVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'trackFragShader' ).textContent
				} );
        var trackMaterial = new THREE.MeshLambertMaterial({ color: glTracks[i].color});
        var track = new THREE.Mesh(trackGeometry, shaderMat);
      track.rotation.z = glTracks[i].angle;
		
		//-1 from x as workaround (why is track offset?)
        track.position.set(glTracks[i].x - 1,
							glTracks[i].y,
							0);
        //track.rotation.z = glTracks[i].angle;
		
	//track = new THREE.Mesh( trackGeometry, shaderMat );	
		
     scene.add(track);
	 
	 //add it to the track pieces list so we can remove it later
	 webGLTrackPieces.push(track);
 
    }
}

function GetNumberOfLevels(){
        return 5;
}
	
function LoadLevel(level) {

    gameLost = false;
    gameWon = false;
    yMax = 20;
    xMax = 50;
    if (level == 1) {
         LoadLevel1();
    }
    
    if (level == 2) {
        LoadLevel2();
    }

    if (level == 3) {
        LoadLevel3();
   }
    if (level == 4) {
        LoadLevel4();
   }

    if (level == 5) {
        LoadLevel5();
   }







}

function LoadLevel1() {
    originalX = 0;
    originalY = 5;
    for (var j = 0; j < 30; j++) {
        createTrack(2, .1,.8, 0x95F717, .5);
    }

    createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);

    createRamp(10,.1,-1);
    createSpace(20,-5,-.3);
  
   for (var j = 0; j < 20; j++) {
        createTrack(2, .1,0, 0x95F717, .5);
    }


   createTrack(2, .1,.1, 0x95F717, .5);
   createTrack(2, .1,.2, 0x95F717, .5);
   createTrack(2, .1,.3, 0x95F717, .5);
   createTrack(2, .1,.4, 0x95F717, .5);
   createTrack(2, .1,.5, 0x95F717, .5);
   createTrack(2, .1,.6, 0x95F717, .5);
   createTrack(2, .1,.7, 0x95F717, .5);
   createTrack(2, .1,.8, 0x95F717, .5);
   createTrack(2, .1,.9, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1, 1, 0x95F717, .5);
   createTrack(2, .1,.9, 0x95F717, .5);
   createTrack(2, .1,.6, 0x95F717, .5);
   
   createRamp(10,.1,-.1);

      for (var j = 0; j < 20; j++) {
        createTrack(2, .1,-.1,0x95F717,.1,.5);
    }
    for (var j = 0; j < 5; j++) {
        createTrack(2, .1,0,0x95F717,.1,.5);
    }
    for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.1,0x95F717,.1,.5);
    }

   for (var j = 0; j < 40; j++) {
        createTrack(2, .1,.8,0x95F717,.1,.5);
    }
      createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);

      createRamp(10,.1,-1.2);
     createSpace(25,-5,-.3);
     for (var j = 0; j < 20; j++) {
        createTrack(2, .1,0,0x95F717,.1,.5);
    }
      yMin = originalY + 5;
        createTrack(10, .1,d2r(-90),0x95F717,.1,.5);
    
    xMax = originalX - 10;
    
          
           
}

function LoadLevel2() {
    originalX = 0;
    originalY = 5;

     for (var j = 0; j < 30; j++) {
        createTrack(2, .1,.4, 0x95F717, .5);
    }

     for (var j = 0; j < 5; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 5; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
        for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }

     for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
    
        for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }

     for (var j = 0; j < 15; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
    
         for (var j = 0; j < 5; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 5; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
        for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }

     for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
    
        for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }

     for (var j = 0; j < 15; j++) {
        createTrack(2, .1,.3, 0x95F717, .5);
    }
    for (var j = 0; j < 10; j++) {
        createTrack(2, .1,.1, 0x95F717, .5);
    }
    
        for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }
        for (var j = 0; j < 20; j++) {
        createTrack(2, .1,.5, 0x95F717, .5);
    }


    createTrack(2, .1,.3,0xFFFF99,2.0);
    createTrack(2, .1,.2,0xFFFF99,2.0);
    createTrack(2, .1,.1,0xFFFF99,2.0);
    createTrack(2, .1,0,0xFFFF99,2.0);
    createRamp(20,.1,-1);

    createSpace(20,.1,-.6);
        for (var j = 0; j < 20; j++) {
              createTrack(2, .1,0, 0x95F717, .5);
        }
      yMin = originalY + 5;
    createTrack(10, .1,d2r(-90),0x95F717,.1,.5);

       
    xMax = originalX - 10;

    
}


function LoadLevel3() {
  originalX = 0;
    originalY = 5;

     for (var j = 0; j < 40; j++) {
        createTrack(2, .1,.6, 0x95F717, .5);
    }

    
     for (var j = 0; j < 5; j++) {
        createRamp(10,.1,-.6,0x95F717,.5);   
        createRamp(25,.1,1,0x95F717,.5);
        createTrack(2,.1,.2,0x95F717,.5);
        createTrack(2,.1,.1,0x95F717,.5);
        createTrack(2,.1,0,0x95F717,.5);

    }

    createRamp(20,.1,1);
    createRamp(20,.1,1);
    createRamp(20,.1,1);
    createRamp(20,.1,1);
    createRamp(10,.1,-.5,0x95F717,.5);   
    createRamp(10,.1,-.4,0x95F717,.5);   
    createRamp(10,.1,-.3,0x95F717,.5);   
    
     createTrack(2,.1,0,0x95F717,.5);
     createTrack(2,.1,0,0x95F717,.5);
     createTrack(2,.1,.5,0x95F717,.5);
     createTrack(2,.1,.4,0x95F717,.5);
     createTrack(2,.1,.2,0x95F717,.5);
     createTrack(2,.1,.4,0x95F717,.5);
     createTrack(2,.1,.2,0x95F717,.5);
     createTrack(2,.1,0,0x95F717,.5);
     createTrack(2,.1,0,0x95F717,.5);
     createTrack(2,.1,0,0x95F717,.5);
     createTrack(2,.1,0,0x95F717,.5);

       yMin = originalY + 5;
     createTrack(10, .1,d2r(-90),0x95F717,.1,.5);

       
    xMax = originalX - 10;
    yMax = originalY + 20;
}

function LoadLevel4(){
      originalX = 0;
    originalY = 5;
    for (var j = 0; j < 30; j++) {
        createTrack(2, .1,.8, 0x95F717, .5);
    }
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,-.1,0xFFFF99,2.0);
       var saveX = originalX;
       var saveY = originalY;
       createSpace(5,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(20,.1,-4);   // loop
       originalX = saveX;
       originalY = saveY;
       createTrack(2, .1,1.5,0xFFFF99,2.0);
       createTrack(2, .1,1.4,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.2,0xFFFF99,2.0);
       createTrack(2, .1,1.1,0xFFFF99,2.0);
       createTrack(2, .1,1.0,0xFFFF99,2.0);
       createTrack(2, .1,.9,0xFFFF99,2.0);
       for (var j = 0; j < 20; j++) {
            createTrack(2, .1,.8, 0x95F717, .5);
       }
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,-.1,0xFFFF99,2.0);
       var saveX = originalX;
       var saveY = originalY;
       createSpace(5,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
      
       createRamp(35,.1,-4);   // loop
       originalX = saveX;
       originalY = saveY;
       createTrack(2, .1,1.5,0xFFFF99,2.0);
       createTrack(2, .1,1.4,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.3,0xFFFF99,2.0);
       createTrack(2, .1,1.2,0xFFFF99,2.0);
       createTrack(2, .1,1.1,0xFFFF99,2.0);
       createTrack(2, .1,1.0,0xFFFF99,2.0);
       createTrack(2, .1,.9,0xFFFF99,2.0);
        for (var j = 0; j < 30; j++) {
            createTrack(2, .1,.8, 0x95F717, .5);
       }
         for (var j = 0; j < 10; j++) {
            createTrack(2, .1,.9, 0x95F717, .5);
       }
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,-.1,0xFFFF99,2.0);
       
        createRamp(10,.1,-1);   
      
      createSpace(35,.1,-.5);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);


       yMin = originalY + 5;
       yMin = originalY + 5;
       xMax = originalX -10;
  
       createTrack(10, .1,d2r(-90),0x95F717,.1,.5);

       
      
       
       
  
}

function LoadLevel5() {
    originalX = 0;
    originalY = 5;
    for (var j = 0; j < 30; j++) {
        createTrack(2, .1,.8, 0x95F717, .5);
    }

    createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);

    createRamp(10,.1,-1);
    createSpace(13,.1,-.3);
  
   for (var j = 0; j < 3; j++) {
        createTrack(2, .1,0, 0x95F717, .5);
    }
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(5,.1,-.8,0xFFFF99,2.0);
       createSpace(5,.1,-.3);
    for (var j = 0; j < 7; j++) {
        createTrack(2, .1,0, 0x95F717, .5);
    }
     createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.7,0xFFFF99,2.0);
       createTrack(2, .1,.8,0xFFFF99,2.0);
       for (var j = 0; j < 25; j++) {
        createTrack(2, .1,.9, 0x95F717, .5);
       }
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(25,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(20,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(10,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(10,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(10,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(10,.1,-.3);
       createSpace(10,.1,0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       
        for (var j = 0; j < 30; j++) {
        createTrack(2, .1,.8, 0x95F717, .5);
       }
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,0,0xFFFF99,2.0);
       createRamp(15,.1,-1.5);

       createSpace(15,.1,-1.0);
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       createTrack(2, .1,.6,0xFFFF99,2.0);
       createTrack(2, .1,.5,0xFFFF99,2.0);
       createTrack(2, .1,.4,0xFFFF99,2.0);
       createTrack(2, .1,.3,0xFFFF99,2.0);
       createTrack(2, .1,.2,0xFFFF99,2.0);
       createTrack(2, .1,.1,0xFFFF99,2.0);
       
       yMin = originalY + 5;
       yMin = originalY + 5;
       xMax = originalX -10;
  
       createTrack(10, .1,d2r(-90),0x95F717,.1,.5);

  

}


    /*function createTrack(length, height, angle) {

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

        glTracks.push(new b2Vec2(bodyDef.position.x, bodyDef.position.y));

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

        for (var j = 0; j < 7; j++) {
            createTrack(2, .1, .60);
        }

    }*/