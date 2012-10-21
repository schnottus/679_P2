function CreateCar() {
	// Add the car //
	var bodyDefCar = new b2BodyDef;
	bodyDefCar.type = b2Body.b2_dynamicBody;
	bodyDefCar.position.Set(1.5, 4);

	car = world.CreateBody(bodyDefCar);
	
	//Set the properties of our car fixture
	var fixDefCar = new b2FixtureDef;
	//fixDefCar.type = b2Body.b2_dynamicBody;
	fixDefCar.density = 2;
	fixDefCar.friction = 0.5;
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;

	//Create the core of the car
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsBox(1.5, 0.3);
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
	spring1.SetMaxMotorForce(30+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
	spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);

	axle2 = world.CreateBody(bodyDefCar);
	
	fixDefCar.shape = new b2PolygonShape();
	fixDefCar.shape.SetAsOrientedBox(0.4, 0.1, new b2Vec2(1 + 0.6*Math.cos(-Math.PI/3), -0.3 + 0.6*Math.sin(-Math.PI/3)), -Math.PI/3);
	axle2.CreateFixture(fixDefCar);

	prismaticJointDefCar.Initialize(car, axle2, axle2.GetWorldCenter(), new b2Vec2(-Math.cos(Math.PI/3), Math.sin(Math.PI/3)));

	spring2 = world.CreateJoint(prismaticJointDefCar);
	spring2.SetMaxMotorForce(20+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
	spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));
	
	// Add the wheels //
	wheel1, wheel2;
	
	fixDefCar = new b2FixtureDef;
	fixDefCar.shape = new b2CircleShape(0.7);
	fixDefCar.density = 0.1;
	fixDefCar.friction = 5;
	fixDefCar.restitution = 0.2;
	fixDefCar.filter.groupIndex = -1;

	bodyDefCar = new b2BodyDef();
	bodyDefCar.type = b2Body.b2_dynamicBody;
	
	bodyDefCar.position.Set(axle1.GetWorldCenter().x - 0.3*Math.cos(Math.PI/3), axle1.GetWorldCenter().y - 0.3*Math.sin(Math.PI/3));
	bodyDefCar.allowSleep = false;
	wheel1 = world.CreateBody(bodyDefCar);
	wheel1.CreateFixture(fixDefCar);
	//wheel1.SetMassFromShapes();
	
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

	revoluteJointDefCar.Initialize(axle2, wheel2, wheel2.GetWorldCenter());
	motor2 = world.CreateJoint(revoluteJointDefCar);
}