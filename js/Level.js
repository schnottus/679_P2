

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