

var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
        ;
var originalX = 0;
var originalx = 0;

    var world;
    function setWorld(newWorld) {
        world = newWorld;
    }
    function createTrack(length, height, angle) {

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

    }