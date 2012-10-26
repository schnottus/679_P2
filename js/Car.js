/******************
* File: Car.js
* Author: Scott Larson, Eric Satterness, Paul Bolanowski
* Date: 21 Oct 2012
*******************/
function CreateCar( type ) {
	// Add the car //
	var bodyDefCar = new b2BodyDef;
	bodyDefCar.type = b2Body.b2_dynamicBody;
	bodyDefCar.position.Set(CAR_X, CAR_Y);
	car = world.CreateBody(bodyDefCar);
	
	//Set the properties of our car fixture
	var fixDefCar = new b2FixtureDef;
	//fixDefCar.type = b2Body.b2_dynamicBody;
	fixDefCar.density = carDensity;
	fixDefCar.friction = 0.5;
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;
	

	//Create the core of the car
	fixDefCar.shape = new b2PolygonShape();
	//note: setAsBox takes half-width and half-height as params, 
	//then the fixture is centered at the location of the body it is attached to
	fixDefCar.shape.SetAsBox(CAR_WIDTH/2, CAR_HEIGHT/2);
	car.CreateFixture(fixDefCar);

	//Create the legs for the axles to attach to
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsOrientedBox(0.4, 0.15, new b2Vec2(-1, -0.3), Math.PI/3);
	car.CreateFixture(fixDefCar);
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsOrientedBox(0.4, 0.15, new b2Vec2(1, -0.3), -Math.PI/3);
	car.CreateFixture(fixDefCar);

	//car.SetMassFromShapes();
	car.ResetMassData();
	
	// Add the axles //
	fixDefCar.density = 1;
	
	axle1 = world.CreateBody(bodyDefCar);
	
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsOrientedBox(0.4, 0.1, new b2Vec2(-1 - 0.6*Math.cos(Math.PI/3), -0.3 - 0.6*Math.sin(Math.PI/3)), Math.PI/3);
	axle1.CreateFixture(fixDefCar);
	 
	var prismaticJointDefCar = new b2PrismaticJointDef();
	prismaticJointDefCar.Initialize(car, axle1, axle1.GetWorldCenter(), new b2Vec2(Math.cos(Math.PI/3), Math.sin(Math.PI/3)));
	prismaticJointDefCar.lowerTranslation = -0.3;
	prismaticJointDefCar.upperTranslation = 0.5;
	prismaticJointDefCar.enableLimit = true;
	prismaticJointDefCar.enableMotor = true;

	spring1 = world.CreateJoint(prismaticJointDefCar);

	axle2 = world.CreateBody(bodyDefCar);
	
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsOrientedBox(0.4, 0.1, new b2Vec2(1 + 0.6*Math.cos(-Math.PI/3), -0.3 + 0.6*Math.sin(-Math.PI/3)), -Math.PI/3);
	axle2.CreateFixture(fixDefCar);

	prismaticJointDefCar.Initialize(car, axle2, axle2.GetWorldCenter(), new b2Vec2(-Math.cos(Math.PI/3), Math.sin(Math.PI/3)));

	spring2 = world.CreateJoint(prismaticJointDefCar);
	
	// Add the wheels //
	wheel1, wheel2;
	
	fixDefCar = new b2FixtureDef;
	fixDefCar.shape = new b2CircleShape(wheel1Radius);
	fixDefCar.density = 0.1;
	fixDefCar.friction = wheelFriction;
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;
	bodyDefCar = new b2BodyDef();
	bodyDefCar.type = b2Body.b2_dynamicBody;

	
	bodyDefCar.position.Set(axle1.GetWorldCenter().x - 0.3*Math.cos(Math.PI/3), axle1.GetWorldCenter().y - 0.3*Math.sin(Math.PI/3));
	bodyDefCar.allowSleep = false;
	wheel1 = world.CreateBody(bodyDefCar);
	wheel1.CreateFixture(fixDefCar);
	//wheel1.SetMassFromShapes();

	fixDefCar = new b2FixtureDef;
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.density = 0.0;
	fixDefCar.shape.SetAsBox(4, 4);
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;
	fixDefCar.isSensor = true;
	bodyDefCar = new b2BodyDef();
	bodyDefCar.type = b2Body.b2_dynamicBody;
	var gravity = bodyDefCar.gravityScale;
	bodyDefCar.gravityScale = 0.0;


	bodyDefCar.position.Set(axle1.GetWorldCenter().x - 0.3 * Math.cos(Math.PI / 3), axle1.GetWorldCenter().y - 0.3 * Math.sin(Math.PI / 3));
	bodyDefCar.allowSleep = false;
	//fixDefCar.SetMassData(new b2MassData(new b2Vec2(0,0),0,0));
	var sensor = world.CreateBody(bodyDefCar);
	sensor.CreateFixture(fixDefCar);
	//wheel1.SetMassFromShapes();
	fixDefCar.isSensor = false;
	fixDefCar = new b2FixtureDef;
	fixDefCar.shape = new b2CircleShape(wheel1Radius);
	fixDefCar.density = 0.1;
	fixDefCar.friction = wheelFriction;
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;
	bodyDefCar.gravityScale = 0.0;

	var contactListener = new Box2D.Dynamics.b2ContactListener;
	contactListener.BeginContact = function (contact_details) {
	    // `contact_details` can be used to determine which two
	    // objects collided and in what way
	    groundCount++;
	    isOnGround = true;
	};
	contactListener.EndContact = function (contact_details) {
	    // `contact_details` can be used to determine which two
	    // objects collided and in what way
	    groundCount--;
	    if (groundCount == 0) {
	        isOnGround = false;
	    }

	};

	world.SetContactListener(contactListener);
	

	fixDefCar.shape = new b2CircleShape(wheel2Radius);
	bodyDefCar.position.Set(axle2.GetWorldCenter().x + 0.3*Math.cos(-Math.PI/3), axle2.GetWorldCenter().y + 0.3*Math.sin(-Math.PI/3));
	bodyDefCar.allowSleep = false;
	wheel2 = world.CreateBody(bodyDefCar);
	wheel2.CreateFixture(fixDefCar);
	//wheel2.SetMassFromShapes();

	// Add the joints //
	revoluteJointDefCar = new b2RevoluteJointDef();
	revoluteJointDefCar.enableMotor = true;

	revoluteJointDefCar.Initialize(axle1, wheel1, wheel1.GetWorldCenter());
	motor1 = world.CreateJoint(revoluteJointDefCar);
	motor1.SetLimits(0, 0);	//By enabling the limits, we can restrict the wheel spin

	revoluteJointDefCar.Initialize(axle2, wheel2, wheel2.GetWorldCenter());
	motor2 = world.CreateJoint(revoluteJointDefCar);
	motor2.SetLimits(0, 0);	//By enabling the limits, we can restrict the wheel spin

	revoluteJointDefCar.Initialize(axle1, sensor, sensor.GetWorldCenter());
	motor1 = world.CreateJoint(revoluteJointDefCar);
	motor1.SetLimits(0, 0); //By enabling the limits, we can restrict the wheel spin


	//Rotate the car initially so that it starts at a bit of an angle
	car.SetAngle(d2r(CAR_ANGLE));
	
	switch(type)
	{
		case 1:
			car1GL();
		break;
		case 2:
			car2GL();
		break;
		case 3:
			car3GL();
		break;
		default:
			car2GL();
	}
	

}

function car1GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	var wheelGeometry = new THREE.CylinderGeometry( wheel1Radius, wheel1Radius, wheel1Width, 20, 5, false ); 
	//var wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFF22FF} );
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	FRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-wheel1_offset);
	FRWheel.rotation.x = d2r(90);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						wheel1_offset);
	FLWheel.rotation.x = d2r(90);
	scene.add(FLWheel);
						
	//rear tires
	wheelGeometry = new THREE.CylinderGeometry( wheel2Radius, wheel2Radius, wheel2Width, 20, 5, false ); 
	//wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFF22FF} );
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	RRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-wheel2_offset);
	RRWheel.rotation.x = d2r(90);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						wheel2_offset);
	RLWheel.rotation.x = d2r(90);
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH,
		bevelEnabled: false,
		bevelThickness: 0.1,  // how deep into text bevel goes
		bevelSize: 0.1,  // how far from text outline is bevel
		bevelSegments: 5  // number of bevel layers
	};
	
	var body1Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	uniforms.resolution.value.x = (SCREEN_WIDTH);
	uniforms.resolution.value.y = SCREEN_HEIGHT;
	shaderMat = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'car1FragShader' ).textContent
				} );
	carBody = new THREE.Mesh( body1Geometry, shaderMat );	
	scene.add( carBody );
}

function car2GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	var wheelGeometry = new THREE.CylinderGeometry( wheel1Radius, wheel1Radius, wheel1Width, 20, 5, false ); 
	//var wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFFF00F} ); 
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	FRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-wheel1_offset);
	FRWheel.rotation.x = d2r(90);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						wheel1_offset);
	FLWheel.rotation.x = d2r(90);
	scene.add(FLWheel);
						
	//rear tires
	wheelGeometry = new THREE.CylinderGeometry( wheel2Radius, wheel2Radius, wheel2Width, 20, 5, false ); 
	//wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFFF00F} ); 
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	RRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-wheel2_offset);
	RRWheel.rotation.x = d2r(90);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						wheel2_offset);
	RLWheel.rotation.x = d2r(90);
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH,
		bevelEnabled: false,
		bevelThickness: 0.1,  // how deep into text bevel goes
		bevelSize: 0.1,  // how far from text outline is bevel
		bevelSegments: 5  // number of bevel layers
	};
	
	var body2Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	uniforms.resolution.value.x = (SCREEN_WIDTH);
	uniforms.resolution.value.y = SCREEN_HEIGHT;
	shaderMat = new THREE.ShaderMaterial( {
					uniforms: carBodyUniforms,
					//vertexShader: document.getElementById( 'defaultVertexShader' ).textContent,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'car2FragShader' ).textContent
				} );
	carBody = new THREE.Mesh( body2Geometry, shaderMat );	
	scene.add( carBody );
}

function car3GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	var wheelGeometry = new THREE.CylinderGeometry( wheel1Radius, wheel1Radius, wheel1Width, 20, 5, false ); 
	//var wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFF00FF} ); 
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	FRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-wheel1_offset);
	FRWheel.rotation.x = d2r(90);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						wheel1_offset);
	FLWheel.rotation.x = d2r(90);
	scene.add(FLWheel);
						
	//rear tires
	wheelGeometry = new THREE.CylinderGeometry( wheel2Radius, wheel2Radius, wheel2Width, 20, 5, false ); 
	//wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xFF00FF} ); 
	wheelMaterial = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'carWheelShader' ).textContent
				} );
	RRWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-wheel2_offset);
	RRWheel.rotation.x = d2r(90);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						wheel2_offset);
	RLWheel.rotation.x = d2r(90);
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH,
		bevelEnabled: false,
		bevelThickness: 0.1,  // how deep into text bevel goes
		bevelSize: 0.1,  // how far from text outline is bevel
		bevelSegments: 5  // number of bevel layers
	};
	
	var body3Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	uniforms.resolution.value.x = (SCREEN_WIDTH);
	uniforms.resolution.value.y = SCREEN_HEIGHT;
	shaderMat = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					//vertexShader: document.getElementById( 'defaultVertexShader' ).textContent,
					vertexShader: document.getElementById( 'carWarpVertexShader' ).textContent,
					fragmentShader: document.getElementById( 'car3FragShader' ).textContent
				} );
	carBody = new THREE.Mesh( body3Geometry, shaderMat );	
	scene.add( carBody );
}

// Car customization functions //
function setWheel1Radius(buttonNum) {
	var btnWheel1RadiusLow = document.getElementById("btnWheel1RadiusLow");
	var btnWheel1RadiusMed = document.getElementById("btnWheel1RadiusMed");
	var btnWheel1RadiusHigh = document.getElementById("btnWheel1RadiusHigh");
	
	switch (buttonNum) {
		case 1: { //Small radius
			wheel1Radius = wheelRadiusLow;

			btnWheel1RadiusLow.className = "selected";
			btnWheel1RadiusMed.className = "";
			btnWheel1RadiusHigh.className = "";
			break;
		}
		case 3: { //Large radius
			wheel1Radius = wheelRadiusHigh;

			btnWheel1RadiusLow.className = "";
			btnWheel1RadiusMed.className = "";
			btnWheel1RadiusHigh.className = "selected";
			break;
		}
		default: { //Medium radius
			wheel1Radius = wheelRadiusMed;

			btnWheel1RadiusLow.className = "";
			btnWheel1RadiusMed.className = "selected";
			btnWheel1RadiusHigh.className = "";
			break;
		}
	}
}

function setWheel2Radius(buttonNum) {
	var btnWheel2RadiusLow = document.getElementById("btnWheel2RadiusLow");
	var btnWheel2RadiusMed = document.getElementById("btnWheel2RadiusMed");
	var btnWheel2RadiusHigh = document.getElementById("btnWheel2RadiusHigh");
	
	switch (buttonNum) {
		case 1: { //Small radius
			wheel2Radius = wheelRadiusLow;

			btnWheel2RadiusLow.className = "selected";
			btnWheel2RadiusMed.className = "";
			btnWheel2RadiusHigh.className = "";
			break;
		}
		case 3: { //Large radius
			wheel2Radius = wheelRadiusHigh;

			btnWheel2RadiusLow.className = "";
			btnWheel2RadiusMed.className = "";
			btnWheel2RadiusHigh.className = "selected";
			break;
		}
		default: { //Medium radius
			wheel2Radius = wheelRadiusMed;

			btnWheel2RadiusLow.className = "";
			btnWheel2RadiusMed.className = "selected";
			btnWheel2RadiusHigh.className = "";
			break;
		}
	}
}

function setWheelFriction(buttonNum) {
	var btnWheelFrictionLow = document.getElementById("btnWheelFrictionLow");
	var btnWheelFrictionMed = document.getElementById("btnWheelFrictionMed");
	var btnWheelFrictionHigh = document.getElementById("btnWheelFrictionHigh");
	
	switch (buttonNum) {
		case 1: { //Low friction
			wheelFriction = wheelFrictionLow;

			btnWheelFrictionLow.className = "selected";
			btnWheelFrictionMed.className = "";
			btnWheelFrictionHigh.className = "";
			break;
		}
		case 3: { //High friction
			wheelFriction = wheelFrictionHigh;

			btnWheelFrictionLow.className = "";
			btnWheelFrictionMed.className = "";
			btnWheelFrictionHigh.className = "selected";
			break;
		}
		default: { //Medium friction
			wheelFriction = wheelFrictionMed;

			btnWheelFrictionLow.className = "";
			btnWheelFrictionMed.className = "selected";
			btnWheelFrictionHigh.className = "";
			break;
		}
	}
}

function setSuspension(buttonNum) {
	var btnSuspensionLow = document.getElementById("btnSuspensionLow");
	var btnSuspensionMed = document.getElementById("btnSuspensionMed");
	var btnSuspensionHigh = document.getElementById("btnSuspensionHigh");
	
	switch (buttonNum) {
		case 1: { //Low friction
			suspension = suspensionLow;

			btnSuspensionLow.className = "selected";
			btnSuspensionMed.className = "";
			btnSuspensionHigh.className = "";
			break;
		}
		case 3: { //High friction
			suspension = suspensionHigh;

			btnSuspensionLow.className = "";
			btnSuspensionMed.className = "";
			btnSuspensionHigh.className = "selected";
			break;
		}
		default: { //Medium friction
			suspension = suspensionMed;

			btnSuspensionLow.className = "";
			btnSuspensionMed.className = "selected";
			btnSuspensionHigh.className = "";
			break;
		}
	}
}

//Set the car density and the carBodyNum
function setCarDensity(buttonNum) {
	var btnCarDensityLow = document.getElementById("btnCarDensityLow");
	var btnCarDensityMed = document.getElementById("btnCarDensityMed");
	var btnCarDensityHigh = document.getElementById("btnCarDensityHigh");
	
	switch (buttonNum) {
		case 1: { //Low friction
			carDensity = carDensityLow;
			carBodyNum = 1;

			btnCarDensityLow.className = "selected";
			btnCarDensityMed.className = "";
			btnCarDensityHigh.className = "";
			break;
		}
		case 3: { //High friction
			carDensity = carDensityHigh;
			carBodyNum = 3;

			btnCarDensityLow.className = "";
			btnCarDensityMed.className = "";
			btnCarDensityHigh.className = "selected";
			break;
		}
		default: { //Medium friction
			carDensity = carDensityMed;
			carBodyNum = 2;

			btnCarDensityLow.className = "";
			btnCarDensityMed.className = "selected";
			btnCarDensityHigh.className = "";
			break;
		}
	}
}