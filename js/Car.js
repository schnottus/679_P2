/******************
* File: Car.js
* Author: Scott Larson, Eric Satterness, Paul Bolanowski
* Date: 21 Oct 2012
*******************/
function CreateCar() {
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
	
	//Rotate the car
	car.SetAngle(d2r(CAR_ANGLE));
	
	// Creat car parts in webGL //
	//front tire
	var sphereGeometry = new THREE.SphereGeometry( wheel1Radius, 20, 16 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xAAF717} ); 
	frontWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	frontWheel.position.set(wheel1.GetPosition().x, 
						wheel1.GetPosition().y,
						0);
	scene.add(frontWheel);
	
	//rear tire
	var sphereGeometry = new THREE.SphereGeometry( wheel2Radius, 20, 16 ); 
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xFFF717} ); 
	rearWheel = new THREE.Mesh(sphereGeometry, sphereMaterial);
	rearWheel.position.set(wheel2.GetPosition().x, 
						wheel2.GetPosition().y,
						0);
	scene.add(rearWheel);
	
	//body 
	//make custom box2d polys to match
	//note: this body won't be valid in box2d as box2d custom polys can only be convex
	var body1Points = [];
	
	body1Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
	body1Points.push( new THREE.Vector2 (  -0.5 * CAR_WIDTH,	0.5 * CAR_HEIGHT ) );
	body1Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	0.5 * CAR_HEIGHT ) );
	body1Points.push( new THREE.Vector2 (  0.5 * CAR_WIDTH, 	-0.5 * CAR_HEIGHT ) );
	//body1Points.push( new THREE.Vector2 (  2.4,  0.3 ) );
	//body1Points.push( new THREE.Vector2 (  2.2, 0.0 ) );
	
	var body1Shape = new THREE.Shape ( body1Points );
	
	var extrusionSettings = {
		amount: 2
	};
	extrusionSettings.bevelEnabled = false;
	
	var body1Geometry = new THREE.ExtrudeGeometry( body1Shape, extrusionSettings );
	
	carBody = THREE.SceneUtils.createMultiMaterialObject( body1Geometry, [ new THREE.MeshLambertMaterial( { color: 0xFFAA00 } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
	carBody.position.set( -1.5, 0.3, - 1.5 );
	//mesh.rotation.set( rx, ry, rz );
	//mesh.scale.set( s, s, s );
	scene.add( carBody );


}