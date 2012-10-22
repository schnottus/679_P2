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
    

	bodyDefCar.position.Set(axle1.GetWorldCenter().x - 0.3 * Math.cos(Math.PI / 3), axle1.GetWorldCenter().y - 0.3 * Math.sin(Math.PI / 3));
	bodyDefCar.allowSleep = false;
	//fixDefCar.SetMassData(new b2MassData(new b2Vec2(0,0),0,0));
	var sensor = world.CreateBody(bodyDefCar);
	sensor.CreateFixture(fixDefCar);
	//wheel1.SetMassFromShapes();
	fixDefCar.isSensor = false;

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


	//Rotate the car
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
		car1GL();
	}
	

}

function car1GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	var sphereGeometry = new THREE.SphereGeometry( wheel1Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xAAF717} ); 
	FRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						WHEEL1_OFFSET);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-WHEEL1_OFFSET );
	scene.add(FLWheel);
						
	//rear tires
	var sphereGeometry = new THREE.SphereGeometry( wheel2Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xAAF717} ); 
	RRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						WHEEL2_OFFSET);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-WHEEL2_OFFSET );
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH
	};
	extrusionSettings.bevelEnabled = false;
	
	var body1Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	
	carBody = THREE.SceneUtils.createMultiMaterialObject( body1Geometry, [ new THREE.MeshLambertMaterial( { color: 0xFFAA00 } ) ] );
	scene.add( carBody );
}

function car2GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	var sphereGeometry = new THREE.SphereGeometry( wheel1Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xAAF717} ); 
	FRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						WHEEL1_OFFSET);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-WHEEL1_OFFSET );
	scene.add(FLWheel);
						
	//rear tires
	var sphereGeometry = new THREE.SphereGeometry( wheel2Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xAAF717} ); 
	RRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						WHEEL2_OFFSET);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-WHEEL2_OFFSET );
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH
	};
	extrusionSettings.bevelEnabled = false;
	
	var body1Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	
	carBody = THREE.SceneUtils.createMultiMaterialObject( body1Geometry, [ new THREE.MeshLambertMaterial( { color: 0xFFFF00 } ) ] );
	scene.add( carBody );
}

function car3GL()
{
	// Create car parts in webGL //
	//front tires
	//THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	var sphereGeometry = new THREE.SphereGeometry( wheel1Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xFF00FF} ); 
	FRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FRWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						WHEEL1_OFFSET);
	scene.add(FRWheel);
	FLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	FLWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						-WHEEL1_OFFSET );
	scene.add(FLWheel);
						
	//rear tires
	var sphereGeometry = new THREE.SphereGeometry( wheel2Radius, 16, 12 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xFF00FF} ); 
	RRWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RRWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						WHEEL2_OFFSET);
	scene.add(RRWheel);
	RLWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	RLWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						-WHEEL2_OFFSET );
	scene.add(RLWheel);
	
	//body 
	//make custom box2d polys to match
	var body1Shape = new THREE.Shape ( body1Points );
	var extrusionSettings = {
		amount: CAR_WIDTH
	};
	extrusionSettings.bevelEnabled = false;
	
	var body1Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	
	carBody = THREE.SceneUtils.createMultiMaterialObject( body1Geometry, [ new THREE.MeshLambertMaterial( { color: 0xFF3300 } ) ] );
	scene.add( carBody );
}