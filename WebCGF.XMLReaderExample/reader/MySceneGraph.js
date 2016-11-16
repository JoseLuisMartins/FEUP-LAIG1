function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    this.rootID;
    this.axis_length;
    this.perspectives = [];
    this.illumination;
    this.omniLights = [];
    this.spotLights = [];
    this.textures = {};
    this.materials = {};
    this.transformations = {};
    this.primitives = {};
    this.components = {};
    this.animations = {};
    this.textureStack;
    this.materialStack;


    this.degToRad = Math.PI / 180.0;



    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

    this.reader.open('scenes/' + filename, this);

}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() {

    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks

    if (this.chekDSXOrder(rootElement))
        return;

    if (this.loadScene(rootElement))
        return;

    if (this.loadViews(rootElement))
        return;

    if (this.loadIllumination(rootElement))
        return;

    if (this.loadLights(rootElement))
        return;

    if (this.loadTextures(rootElement))
        return;

    if (this.loadMaterials(rootElement))
        return;

    if (this.loadTransformations(rootElement))
        return;

    if (this.loadAnimations(rootElement))
        return;

    if (this.loadPrimitives(rootElement))
        return;

    if (this.loadComponents(rootElement))
        return;



    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    console.log("XML Loading finished.");
    this.scene.onGraphLoaded();
    this.loadedOk = true;
};

MySceneGraph.prototype.chekDSXOrder = function(rootElement) {
    var childs = rootElement.children;
    if (childs.length != 10) {
        console.error("Number of tags on dsx incorrect");
        return 1;
    }

    if (childs[0].tagName != "scene")
        console.warn("scene is not the first element on the DSX Tag");

    if (childs[1].tagName != "views")
        console.warn("views is not the second element on the DSX Tag");

    if (childs[2].tagName != "illumination")
        console.warn("illumination is not the third element on the DSX Tag");

    if (childs[3].tagName != "lights")
        console.warn("lights is not the fourth element on the DSX Tag");

    if (childs[4].tagName != "textures")
        console.warn("textures is not the fifth element on the DSX Tag");

    if (childs[5].tagName != "materials")
        console.warn("materials is not the sixth element on the DSX Tag");

    if (childs[6].tagName != "transformations")
        console.warn("transformations is not the seventh element on the DSX Tag");

    if (childs[7].tagName != "animations")
        console.warn("animations is not the eigth element on the DSX Tag");

    if (childs[8].tagName != "primitives")
        console.warn("primitives is not the ninth element on the DSX Tag");

    if (childs[9].tagName != "components")
        console.warn("components is not the tenth element on the DSX Tag");

    return 0;
}

MySceneGraph.prototype.loadScene = function(rootElement) {
    var scene = rootElement.getElementsByTagName('scene')[0];

    if (scene == null) {
        this.onXMLError("Error loading scene, No Scene Tag");
        return 1;
    }

    this.rootID = this.reader.getString(scene, 'root');
    this.axis_length = this.reader.getFloat(scene, 'axis_length');

}

MySceneGraph.prototype.loadViews = function(rootElement) {
    var viewElement, perspectiveElements, id, near, far, angle, from, to;

    viewElement = rootElement.getElementsByTagName('views')[0];
    if (viewElement == null) {
        this.onXMLError("Error loading view. No views Tag");
        return 1;
    }



    perspectiveElements = viewElement.getElementsByTagName('perspective');

    if (perspectiveElements.length == 0) {
        this.onXMLError("at least one perspective should be declared");
        return 1;
    }

    for (var perspectiveElement of perspectiveElements) {
        id = this.reader.getString(perspectiveElement, 'id');
        near = this.reader.getFloat(perspectiveElement, 'near');
        far = this.reader.getFloat(perspectiveElement, 'far');
        angle = this.reader.getFloat(perspectiveElement, 'angle');
        from = this.getPoint3Element(perspectiveElement.getElementsByTagName('from')[0]);
        to = this.getPoint3Element(perspectiveElement.getElementsByTagName('to')[0]);


        this.perspectives.push(new CGFcamera(angle * this.degToRad, near, far,
            vec3.fromValues(from.x, from.y, from.z),
            vec3.fromValues(to.x, to.y, to.z)))
    }
}


MySceneGraph.prototype.loadIllumination = function(rootElement) {
    var illuminationElement, doublesided, local, ambient, background;

    illuminationElement = rootElement.getElementsByTagName('illumination')[0];

    if (illuminationElement == null) {
        this.onXMLError("Error loading illumination. No illumination Tag");
        return 1;
    }

    doublesided = this.reader.getBoolean(illuminationElement, 'doublesided');
    local = this.reader.getBoolean(illuminationElement, 'local');
    ambient = this.getRGBAElement(illuminationElement.getElementsByTagName('ambient')[0]);
    background = this.getRGBAElement(illuminationElement.getElementsByTagName('background')[0]);

    this.illumination = new Illumination(doublesided, local, ambient, background);
}


MySceneGraph.prototype.loadLights = function(rootElement) {
    var lightElements = rootElement.getElementsByTagName('lights')[0];

    if (lightElements == null) {
        this.onXMLError("Error loading Lights. No Lights Tag");
        return 1;
    }

    this.loadOmniLights(lightElements);
    this.loadSpotLights(lightElements);

    if (this.omniLights.length == 0 && this.spotLights.length == 0) {
        onXMLError("Error No lights defined.");
        return 1;
    }
}


MySceneGraph.prototype.loadOmniLights = function(lightElements) {
    var omniElements, lightElement, locationElement, location;

    omniElements = lightElements.getElementsByTagName('omni');

    for (var omniElement of omniElements) {
        lightElement = this.loadLightsCommon(omniElement);

        locationElement = omniElement.getElementsByTagName('location')[0];
        location = new Point3W(this.reader.getFloat(locationElement, 'x'), this.reader.getFloat(locationElement, 'y'),
            this.reader.getFloat(locationElement, 'z'), this.reader.getFloat(locationElement, 'w'));

        this.omniLights.push(new Omni(lightElement, location));
    }
}


MySceneGraph.prototype.loadSpotLights = function(lightElements) {
    var spotElements, lightElement, angle, exponent, target, location;

    var spotElements = lightElements.getElementsByTagName('spot');

    for (var spotElement of spotElements) {
        lightElement = this.loadLightsCommon(spotElement);
        angle = this.reader.getFloat(spotElement, 'angle');
        exponent = this.reader.getFloat(spotElement, 'exponent');
        target = this.getPoint3Element(spotElement.getElementsByTagName('target')[0]);
        location = this.getPoint3Element(spotElement.getElementsByTagName('location')[0]);

        this.spotLights.push(new Spot(lightElement, angle * this.degToRad, exponent, target, location));
    }
}


MySceneGraph.prototype.loadLightsCommon = function(lightElement) {
    var id, enabled, ambient, diffuse, specular;

    id = this.reader.getString(lightElement, 'id');
    enabled = this.reader.getBoolean(lightElement, 'enabled');
    ambient = this.getRGBAElement(lightElement.getElementsByTagName('ambient')[0]);
    diffuse = this.getRGBAElement(lightElement.getElementsByTagName('diffuse')[0]);
    specular = this.getRGBAElement(lightElement.getElementsByTagName('specular')[0]);

    return new Light(id, enabled, ambient, diffuse, specular);
}


MySceneGraph.prototype.loadTextures = function(rootElement) {
    var texturesElement, textureElements, id, texture, lengthS, lengthT;

    var texturesElement = rootElement.getElementsByTagName('textures')[0];
    if (texturesElement == null) {
        this.onXMLError("Error loading Textures. No textures Tag");
        return 1;
    }

    textureElements = texturesElement.getElementsByTagName('texture');

    if (textureElements.length == 0) {
        this.onXMLError("There should be at least one texture");
        return 1;
    }

    for (var textureElement of textureElements) {
        id = this.reader.getString(textureElement, 'id');
        texture = new CGFtexture(this.scene, this.reader.getString(textureElement, 'file'));
        lengthS = this.reader.getFloat(textureElement, 'length_s');
        lengthT = this.reader.getFloat(textureElement, 'length_t');
        if (this.textures[id] != null)
            console.error("Already exists a Texture with id " + id);
        else
            this.textures[id] = new Texture(id, texture, lengthS, lengthT);
    }
}


MySceneGraph.prototype.loadMaterials = function(rootElement) {
    var materialsElement, materialElements, id, emission,
        ambient, diffuse, specular, shininessElement, shininess;

    var materialsElement = rootElement.getElementsByTagName('materials')[0];

    if (materialsElement == null) {
        this.onXMLError("Error loading Materials. No materials Tag");
        return 1;
    }

    materialElements = materialsElement.getElementsByTagName('material');

    if (materialElements.length == 0) {
        this.onXMLError("There should be at least on material");
        return 1;
    }

    for (var materialElement of materialElements) {
        id = this.reader.getString(materialElement, 'id');
        emission = this.getRGBAElement(materialElement.getElementsByTagName('emission')[0]);
        ambient = this.getRGBAElement(materialElement.getElementsByTagName('ambient')[0]);
        diffuse = this.getRGBAElement(materialElement.getElementsByTagName('diffuse')[0]);
        specular = this.getRGBAElement(materialElement.getElementsByTagName('specular')[0]);

        shininessElement = materialElement.getElementsByTagName('shininess')[0];
        shininess = this.reader.getFloat(shininessElement, 'value');
        if (this.materials[id] != null) {
            console.error("Already exists a material with id " + id);
        } else {
            var appearance = new CGFappearance(this.scene);
            appearance.setEmission(emission.r, emission.g, emission.b, emission.a);
            appearance.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
            appearance.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
            appearance.setSpecular(specular.r, specular.g, specular.b, specular.a);
            appearance.setShininess(shininess);
            appearance.setTextureWrap('REPEAT', 'REPEAT');

            this.materials[id] = appearance;
        }
    }
}


MySceneGraph.prototype.loadTransformations = function(rootElement) {
    var transformationsElement, transformationElements, id;

    transformationsElement = rootElement.getElementsByTagName('transformations')[0];
    if (transformationsElement == null) {
        this.onXMLError("Error loading Tranformations. No transformations Tag");
        return 1;
    }

    transformationElements = transformationsElement.getElementsByTagName('transformation');

    if (transformationElements.length == 0) {
        this.onXMLError("There should be at least on tranformation");
        return 1;
    }

    for (transformationElement of transformationElements) {
        id = this.reader.getString(transformationElement, 'id');
        if (this.transformations[id] != null) {
            console.error("Already exists a tranformation with id " + id);
        } else {
            this.transformations[id] = this.getTranformationMatrix(transformationElement);
        }
    }
}


MySceneGraph.prototype.getTranformationMatrix = function(transformationElement) {
    var matrix = mat4.create();

    if (transformationElement.children.length == 0) {
        console.error("There sould be at least one transformation in the tranformation tag");
    }

    for (var i = 0; i < transformationElement.children.length; i++) {
        var transformation = transformationElement.children[i];
        var transformationName = transformation.tagName;

        switch (transformationName) {
            case 'translate':
                var translateCoords;

                translateCoords = this.getPoint3Element(transformation);
                mat4.translate(matrix, matrix, translateCoords.toArray())
                break;

            case 'rotate':
                var rotationAxis, angle, rotation;

                rotationAxis = this.reader.getString(transformation, 'axis');
                angle = this.reader.getFloat(transformation, 'angle');

                if (rotationAxis == 'x') rotation = [1, 0, 0];
                else if (rotationAxis == 'y') rotation = [0, 1, 0];
                else if (rotationAxis == 'z') rotation = [0, 0, 1];

                mat4.rotate(matrix, matrix, angle * this.degToRad, rotation);
                break;

            case 'scale':
                var scaleCoords;

                scaleCoords = this.getPoint3Element(transformation);
                mat4.scale(matrix, matrix, scaleCoords.toArray());
                break;
        }
    }

    return matrix;
}




MySceneGraph.prototype.loadAnimations = function(rootElement) {
  var animationsElement, animationElements;

  var animationsElement = rootElement.getElementsByTagName('animations')[0];
  if (animationsElement == null) {
    this.onXMLError("Error loading animations. No animations Tag");
    return 1;
  }


  animationElements = animationsElement.getElementsByTagName('animation');
  for (var animationElement of animationElements) {
    var id, span, type;

    id = this.reader.getString(animationElement, 'id');
    span = this.reader.getFloat(animationElement, 'span');
    type = this.reader.getString(animationElement, 'type');

    if (type == "linear") {
      var controlPointsElements = animationElement.getElementsByTagName('controlpoint');
      var controlPoints = [];

      for (var controlPointElement of controlPointsElements) {
        var x, y, z;

        x = this.reader.getFloat(controlPointElement, 'xx');
        y = this.reader.getFloat(controlPointElement, 'yy');
        z = this.reader.getFloat(controlPointElement, 'zz');

        controlPoints.push(new Point3(x, y, z));
      }
      this.animations[id]=new LinearAnimation(id, controlPoints, span)
      console.log(this.animations[id]);
    }
    else if (type == "circular") {
      var cx, cy, cz, radius, startang, rotang;

      cx = this.reader.getFloat(animationElement, 'centerx');
      cy = this.reader.getFloat(animationElement, 'centery');
      cz = this.reader.getFloat(animationElement, 'centerz');
      radius = this.reader.getFloat(animationElement, 'radius');
      startang = this.reader.getFloat(animationElement, 'startang');
      rotang = this.reader.getFloat(animationElement, 'rotang');

      this.animations[id]=new CircularAnimation(id, new Point3(cx, cy, cz), radius, startang, rotang, span);
      console.log(this.animations[id]);
    }
    else {
      this.onXMLError("Error loading animations. Animation type must be either 'linear' or 'circular'");
      return 1;
    }
  }
}



MySceneGraph.prototype.loadPrimitives = function(rootElement) {
    var primitivesElement, primitiveElements, id, primitiveTag, primitiveName;

    var primitivesElement = rootElement.getElementsByTagName('primitives')[0];
    if (primitivesElement == null) {
        this.onXMLError("Error loading primitives. No primitives Tag");
        return 1;
    }

    primitiveElements = primitivesElement.getElementsByTagName('primitive');

    if (primitiveElements.length == 0) {
        console.error("there should be at least on primitive tag on the primitives tag");
    }

    for (var primitiveElement of primitiveElements) {
        if (primitiveElement.children.length != 1) {
            this.onXMLError("Error loading primitives (more than one tag inside primitive tag).");
            continue;
        }

        id = this.reader.getString(primitiveElement, 'id');
        primitiveTag = primitiveElement.children[0];
        primitiveName = primitiveTag.tagName;

        if (this.primitives[id] != null) {
            console.error("Already exists a primitive with id " + id);
        } else {
            var primitive = this.createPrimitive(primitiveName, primitiveTag);
            if (primitive == null);

            this.primitives[id] = primitive;
        }
    }
}


MySceneGraph.prototype.createPrimitive = function(primitiveName, primitiveTag) {
    var primitive;

    switch (primitiveName) {
        case 'rectangle':
            var point1 = new Point2(this.reader.getFloat(primitiveTag, 'x1'), this.reader.getFloat(primitiveTag, 'y1'));
            var point2 = new Point2(this.reader.getFloat(primitiveTag, 'x2'), this.reader.getFloat(primitiveTag, 'y2'));

            primitive = new Rectangle(this.scene, point1, point2);
            break;

        case 'triangle':
            var point1 = new Point3(this.reader.getFloat(primitiveTag, 'x1'), this.reader.getFloat(primitiveTag, 'y1'), this.reader.getFloat(primitiveTag, 'z1'));
            var point2 = new Point3(this.reader.getFloat(primitiveTag, 'x2'), this.reader.getFloat(primitiveTag, 'y2'), this.reader.getFloat(primitiveTag, 'z2'));
            var point3 = new Point3(this.reader.getFloat(primitiveTag, 'x3'), this.reader.getFloat(primitiveTag, 'y3'), this.reader.getFloat(primitiveTag, 'z3'));

            primitive = new Triangle(this.scene, point1, point2, point3);
            break;

        case 'cylinder':
            var base = this.reader.getFloat(primitiveTag, 'base');
            var top = this.reader.getFloat(primitiveTag, 'top');
            var height = this.reader.getFloat(primitiveTag, 'height');
            var slices = this.reader.getInteger(primitiveTag, 'slices');
            var stacks = this.reader.getInteger(primitiveTag, 'stacks');
            //ver parametros do cilindro !!!
            primitive = new Cylinder(this.scene, base, top, height, slices, stacks);
            break;

        case 'sphere':
            var radius = this.reader.getFloat(primitiveTag, 'radius');
            var slices = this.reader.getInteger(primitiveTag, 'slices');
            var stacks = this.reader.getInteger(primitiveTag, 'stacks');

            primitive = new Sphere(this.scene, radius, slices, stacks);
            break;

        case 'torus':
            var inner = this.reader.getFloat(primitiveTag, 'inner');
            var outer = this.reader.getFloat(primitiveTag, 'outer');
            var slices = this.reader.getInteger(primitiveTag, 'slices');
            var loops = this.reader.getInteger(primitiveTag, 'loops');

            primitive = new Torus(this.scene, inner, outer, slices, loops);
            break;
        case 'plane':
              var dimX = this.reader.getFloat(primitiveTag, 'dimX');
              var dimY = this.reader.getFloat(primitiveTag, 'dimY');
              var partsX = this.reader.getInteger(primitiveTag, 'partsX');
              var partsY = this.reader.getInteger(primitiveTag, 'partsY');

              primitive = new Plane(this.scene, dimX, dimY, partsX, partsY);
        break;
        case 'patch':
              var orderU = this.reader.getFloat(primitiveTag, 'orderU');
              var orderV = this.reader.getFloat(primitiveTag, 'orderV');
              var partsU = this.reader.getInteger(primitiveTag, 'partsU');
              var partsV = this.reader.getInteger(primitiveTag, 'partsV');

              if(((orderU+1)*(orderV+1)) != primitiveTag.children.length){
                this.onXMLError("Wrong number of control points.");
                return null;
              }else{
                var controlPoints = [];
                for (var i = 0; i < primitiveTag.children.length; i++) {
                    controlPoints.push(this.getPoint3Element(primitiveTag.children[i]));
                }

                primitive = new Patch(this.scene, orderU, orderV, partsU, partsV,controlPoints);
              }
        break;
        case 'vehicle':
              primitive=new Vehicle(this.scene);
        break;
        case 'chessboard':
              var du = this.reader.getFloat(primitiveTag, 'du');
              var dv = this.reader.getFloat(primitiveTag, 'dv');
              var textureref = this.reader.getString(primitiveTag, 'textureref');
              var su = this.reader.getFloat(primitiveTag, 'su');
              var sv = this.reader.getFloat(primitiveTag, 'sv');

              if(primitiveTag.children.length != 3){
                this.onXMLError("Wrong number of colors.");
                return null;
              }

              var c1 = this.getRGBAElement(primitiveTag.children[0]);
              var c2 = this.getRGBAElement(primitiveTag.children[1]);
              var cs = this.getRGBAElement(primitiveTag.children[2]);

              primitive = new Chessboard(this.scene,du,dv,textureref,su,sv,c1,c2,cs);

        break;

        default:
            this.onXMLError("Error loading primitives (invalid primitive tag).");
            return null;
    }

    return primitive;
}


MySceneGraph.prototype.loadComponents = function(rootElement) {
    var components = rootElement.getElementsByTagName('components')[0];

    if (components == null) {
        this.onXMLError("Error loading components. No components Tag");
        return 1;
    }


    var componentTmp = components.getElementsByTagName('component');

    if (componentTmp.length == 0) {
        console.error("There should be at least on component");
        return 1;
    }


    var id, tranformation,animated, materials, texture, componentIDs, primitiveIDs;

    for (var i = 0; i < componentTmp.length; i++) {
        //load  component id
        id = this.reader.getString(componentTmp[i], 'id');

        if (this.components[id] != null) {
            console.error("Already exists a component with id " + id);
            return 1;
        } else {
            //load  tranformation id for the component
            var transformationTmp = componentTmp[i].getElementsByTagName('transformation');

            if (transformationTmp.length == 0) {
                console.error("Missing tranformation tag on component " + id);
                return 1;
            }

            if (transformationTmp[0].children.length == 0) {
                console.error("Tranformation tag on component " + id + " must contain a tranformationRef tag or transformations declared");
                return 1;
            }

            var transformationTag = transformationTmp[0].getElementsByTagName('transformationref');


            if (transformationTag.length != 0) {
                tranformation = this.reader.getString(transformationTag[0], 'id');
                if (this.transformations[tranformation] == null) {
                    console.error("Tranformationref " + tranformation + " on component " + id + " is not declared");
                    return 1;
                }
            } else { //a transformação tem que ser criada
                //guarda o id da transformação
                tranformation = id + "transformation";
                //guarda tranformação no array de tranformações
                this.transformations[tranformation] = this.getTranformationMatrix(transformationTmp[0]);
            }

            //load animations
            var animationTmp = componentTmp[i].getElementsByTagName('animation');

            if (animationTmp.length == 0) {
                animated = null;
            }else{

                var animationrefs = animationTmp[0].getElementsByTagName('animationref');

                if(animationrefs.length == 0){
                    animated = null;
                }else{
                    var animations = new Array(animationrefs.length);
                    for (var j = 0; j < animationrefs.length; j++) {
                        var animationId = this.reader.getString(animationrefs[j], 'id');
                        animations[j]=this.animations[animationId];

                    }
                    console.log(animations);
                    animated = new Animated(animations);

                }
            }

            //load  material id's for the component
            var materialsTmp = componentTmp[i].getElementsByTagName('materials');

            if (materialsTmp.length == 0) {
                console.error("Missing materials tag on component " + id);
                return 1;
            }

            var materialTag = materialsTmp[0].getElementsByTagName('material');
            if (materialTag.length == 0) {
                console.error("Materials tag on component " + id + " must contain at least on material");
                return 1;
            }
            materials = new Array(materialTag.length);
            for (var j = 0; j < materialTag.length; j++) {
                var materialId = this.reader.getString(materialTag[j], 'id');
                if (this.materials[materialId] == null && materialId != "inherit") {
                    console.error("The material  " + materialId + " on component " + id + " is not declared");
                    return 1;
                }

                materials[j] = materialId;

            }


            //load  texture id for the component
            var textureTmp = componentTmp[i].getElementsByTagName('texture');
            if (textureTmp.length == 0) {
                console.error("Missing texture tag on component " + id);
                return 1;
            }
            texture = this.reader.getString(textureTmp[0], 'id');

            if (this.textures[texture] == null && texture != "inherit" && texture != "none") {
                console.error("The texture  " + texture + " on component " + id + " is not declared");
                return 1;
            }

            //load  children id's for the component
            var childrenTmp = componentTmp[i].getElementsByTagName('children');
            if (childrenTmp.length == 0) {
                console.error("Missing children tag on component " + id);
                return 1;
            }

            var componentTag = childrenTmp[0].getElementsByTagName('componentref');
            var primitiveTag = childrenTmp[0].getElementsByTagName('primitiveref');
            componentIDs = new Array(componentTag.length);
            primitiveIDs = new Array(primitiveTag.length);

            for (var j = 0; j < componentTag.length; j++) {
                componentIDs[j] = this.reader.getString(componentTag[j], 'id');
            }

            for (var j = 0; j < primitiveTag.length; j++) {
                primitiveIDs[j] = this.reader.getString(primitiveTag[j], 'id');
            }

            this.components[id] = new Component(id, tranformation, materials, texture, componentIDs, primitiveIDs, animated);

        }
    }

}

MySceneGraph.prototype.getRGBAElement = function(element) {
    if (element == null) {
        this.onXMLError("Error loading 'RGBA' element .");
        return 1;
    }

    var res = new ColorRGBA(this.reader.getFloat(element, 'r'), this.reader.getFloat(element, 'g'),
        this.reader.getFloat(element, 'b'), this.reader.getFloat(element, 'a'));

    return res;
}

MySceneGraph.prototype.getPoint3Element = function(element) {
    if (element == null) {
        this.onXMLError("Error loading 'Point3' element .");
        return 1;
    }

    var res = new Point3(this.reader.getFloat(element, 'x'), this.reader.getFloat(element, 'y'),
        this.reader.getFloat(element, 'z'));

    return res;
}



/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};





MySceneGraph.prototype.displayGraph = function() {
  this.textureStack = new Structure.stack();
  this.materialStack = new Structure.stack();

  return this.visitGraph(this.rootID);
}


MySceneGraph.prototype.visitGraph = function(root) {


    var component = this.components[root];
    if(component == null){
      console.error("The component " + root + " does not exist");
      return 1;
    }

    //Tranformations--------------------------
    this.scene.pushMatrix();


    if (component.animated != null)
        this.scene.multMatrix(component.animated.getAnimationMatrix());


    this.scene.multMatrix(this.transformations[component.transformationID]);



    //Materials--------------------------------
    var materialId = component.materialIDs[this.scene.materialIndex % component.materialIDs.length];


    if (materialId == "inherit")
        this.materialStack.push(this.materialStack.top());
    else
        this.materialStack.push(materialId);



    //Textures------------------------------
    var textureId = component.textureID;
    if (textureId == "inherit")
        this.textureStack.push(this.textureStack.top());
    else
        this.textureStack.push(textureId);


    for (var i = 0; i < component.componentIds.length; i++) {
        this.visitGraph(component.componentIds[i]);
    }

    for (var i = 0; i < component.primitiveIds.length; i++) {
        var material = this.materials[this.materialStack.top()];
        var textureElement = this.textures[this.textureStack.top()];
        var primitive = this.primitives[component.primitiveIds[i]];

        if (this.textureStack.top() != "none") {
            if (primitive instanceof Triangle || primitive instanceof Rectangle) {
                primitive.setTextureCoords(textureElement.lengthS, textureElement.lengthT);
            }

            material.setTexture(textureElement.texture);
        }

        material.apply();
        primitive.display();
        material.setTexture(null);
    }


    this.materialStack.pop();
    this.textureStack.pop();
    this.scene.popMatrix();

    return 0;
}
