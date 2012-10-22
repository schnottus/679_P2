	
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
	
function LoadLevel(level) {

    gameLost = false;
    gameWon = false;
    yMax = 0;
    if (level == 1) {
        LoadLevel1();
    }
    
    if (level == 2) {
        LoadLevel2();
    }

    if (level == 3) {
        LoadLevel3();
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


     createTrack(10, .1,d2r(-90),0x95F717,.1,.5);

       
    xMax = originalX - 10;
    yMax = originalY + 20;
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