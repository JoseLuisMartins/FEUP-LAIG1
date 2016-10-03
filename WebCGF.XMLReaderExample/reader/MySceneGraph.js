
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.rootId;
	this.axis_length;
	this.perspectives;
	this.illumination;
	this.omniLights;
	this.spotLights;
	this.textures = {};
	this.materials = {};
	this.transformations = {};
	this.primitives= {};
	this.components= {};


	// File reading
	this.reader = new CGFXMLreader();

	/*
	* Read the contents of the xml file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/

	this.reader.open('scenes/'+filename, this);

}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	this.loadScene(rootElement);
	this.loadViews(rootElement);
	this.loadIllumination(rootElement);
	this.loadLights(rootElement);
	this.loadTextures(rootElement);
	this.loadMaterials(rootElement);
	this.loadTranformations(rootElement);
	this.loadPrimitives(rootElement);
	this.loadComponents(rootElement);


	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



MySceneGraph.prototype.loadScene= function(rootElement) {
	var scene = rootElement.getElementsByTagName('scene')[0];

	if (scene == null)
	onXMLError("Error loading scene.");

	this.rootId=this.reader.getString(scene,'root');
	this.axis_length=this.reader.getFloat(scene,'axis_length');

}

MySceneGraph.prototype.loadViews= function(rootElement) {

	var view = rootElement.getElementsByTagName('views')[0];
	if (view == null)
	onXMLError("Error loading view.");


	var perspectivesTmp = view.getElementsByTagName('perspective');
	this.perspectives = new Array(perspectivesTmp.length);

	var id,near, far, angle;
	for (var i = 0; i < perspectivesTmp.length; i++) {

		id = this.reader.getString(perspectivesTmp[i], 'id');
		near = this.reader.getFloat(perspectivesTmp[i], 'near');
		far = this.reader.getFloat(perspectivesTmp[i], 'far');
		angle = this.reader.getFloat(perspectivesTmp[i], 'angle');

		var from = this.getPoint3Element(perspectivesTmp[i].getElementsByTagName('from')[0]);
		var to = this.getPoint3Element(perspectivesTmp[i].getElementsByTagName('to')[0]);


		this.perspectives[i] = new PerspectiveInfo(id, near, far, angle, from, to);

	}
}


MySceneGraph.prototype.loadIllumination= function(rootElement) {
	var illumination = rootElement.getElementsByTagName('illumination')[0];


	var doublesided = this.reader.getBoolean(illumination,'doublesided');
	var local=this.reader.getBoolean(illumination,'local');
	var ambient = this.getRGBAElement(illumination.getElementsByTagName('ambient')[0]);
	var background = this.getRGBAElement(illumination.getElementsByTagName('background')[0]);


	this.illumination = new Illumination(doublesided, local, ambient, background);

}

MySceneGraph.prototype.loadLights= function(rootElement) {
	var lightElements = rootElement.getElementsByTagName('lights')[0];

	if (lightElements == null)
		onXMLError("Error loading lights.");

	this.loadOmniLights(lightElements);
	this.loadSpotLights(lightElements);

	if(this.omniLights.length == 0 && this.spotLights.length == 0)
		onXMLError("Error No lights defined.");

}

MySceneGraph.prototype.loadOmniLights= function(lightElements) {

	var omniTmp = lightElements.getElementsByTagName('omni');

	if(omniTmp.length > 0)
		this.omniLights = new Array(omniTmp.length);

	for (var i = 0; i < omniTmp.length; i++) {
		var lightElement = this.loadLightsCommon(omniTmp[i]);

		var locationTmp = omniTmp[i].getElementsByTagName('location')[0];

		var location = new Point3W(this.reader.getFloat(locationTmp, 'x'), this.reader.getFloat(locationTmp, 'y'),
		this.reader.getFloat(locationTmp, 'z'),this.reader.getFloat(locationTmp, 'w'));

		this.omniLights[i] = new Omni(lightElement,location);

	}
}

MySceneGraph.prototype.loadSpotLights= function(lightElements) {

	var spotTmp = lightElements.getElementsByTagName('spot');

	if(spotTmp.length > 0)
		this.spotLights = new Array(spotTmp.length);

	for (var i = 0; i < spotTmp.length; i++) {
		var lightElement = this.loadLightsCommon(spotTmp[i]);
		var angle = this.reader.getFloat(spotTmp[i], 'angle');
		var exponent = this.reader.getFloat(spotTmp[i], 'exponent');

		var target = this.getPoint3Element(spotTmp[i].getElementsByTagName('target')[0]);
		var location = this.getPoint3Element(spotTmp[i].getElementsByTagName('location')[0]);



		this.spotLights[i] = new Spot(lightElement,angle,exponent,target,location);
	}
}

MySceneGraph.prototype.loadLightsCommon = function(lightElement) {
	var id,enabled;

	id = this.reader.getString(lightElement, 'id');
	enabled = this.reader.getBoolean(lightElement, 'enabled');


	var ambient = this.getRGBAElement(lightElement.getElementsByTagName('ambient')[0]);
	var diffuse = this.getRGBAElement(lightElement.getElementsByTagName('diffuse')[0]);
	var specular = this.getRGBAElement(lightElement.getElementsByTagName('specular')[0]);


	return new Light(id, enabled, ambient, diffuse, specular);
}


MySceneGraph.prototype.loadTextures= function(rootElement) {
	var textures = rootElement.getElementsByTagName('textures')[0];

	if (textures == null)
		onXMLError("Error loading textures.");


	var texturesTmp = textures.getElementsByTagName('texture');


	var id,file, lengthS, lengthT;

	for (var i = 0; i < texturesTmp.length; i++) {

		id = this.reader.getString(texturesTmp[i], 'id');
		file = this.reader.getString(texturesTmp[i], 'file');
		lengthS = this.reader.getFloat(texturesTmp[i], 'length_s');
		lengthT = this.reader.getFloat(texturesTmp[i], 'length_t');

		this.textures[id]= new Texture(id, file, lengthS, lengthT);

	}
}

MySceneGraph.prototype.loadMaterials= function(rootElement) {
	var materials = rootElement.getElementsByTagName('materials')[0];

	if (materials == null)
		onXMLError("Error loading materials.");


	var materialsTmp = materials.getElementsByTagName('material');


	var id,emission,ambient,diffuse,specular,shininessElement,shininess;

	for (var i = 0; i < materialsTmp.length; i++) {

		id = this.reader.getString(materialsTmp[i], 'id');

		emission = this.getRGBAElement(materialsTmp[i].getElementsByTagName('emission')[0]);
		ambient = this.getRGBAElement(materialsTmp[i].getElementsByTagName('ambient')[0]);
		diffuse = this.getRGBAElement(materialsTmp[i].getElementsByTagName('diffuse')[0]);
		specular = this.getRGBAElement(materialsTmp[i].getElementsByTagName('specular')[0]);

		shininessElement = materialsTmp[i].getElementsByTagName('shininess')[0];
		shininess = this.reader.getFloat(shininessElement, 'value');

		this.materials[id]= new Material(id, emission, ambient, diffuse, specular, shininess);

	}
}

MySceneGraph.prototype.loadTranformations= function(rootElement) {
	var transformations = rootElement.getElementsByTagName('transformations')[0];

	if (transformations == null)
			onXMLError("Error loading transformations.");

	var transformationsTmp = transformations.getElementsByTagName('transformation');



	for (var i = 0; i < transformationsTmp.length; i++) {
			var id=this.reader.getString(transformationsTmp[i],'id');

			this.transformations[id]=this.getTranformationMatrix(transformationsTmp[i]);

	}

}

MySceneGraph.prototype.getTranformationMatrix=function (transformationElement) {
	var m = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	for (var j = 0; j < transformationElement.children.length; j++) {
		var transformation =	transformationElement.children[j];
		var transformationName = transformation.tagName;


			switch (transformationName) {
				case 'translate':

					var translateCoords = this.getPoint3Element(transformation);
					mat4.translate(m,m,[translateCoords.x,translateCoords.y,translateCoords.z]);

					break;
				case 'rotate':
							var rotationAxis=this.reader.getString(transformation,'axis');
							var angle=	this.reader.getFloat(transformation,'angle');

							switch (rotationAxis) {
								case 'x':
											mat4.rotate(m,m,angle,[1,0,0]);
									break;
								case 'y':
											mat4.rotate(m,m,angle,[0,1,0]);
									break;
								case 'z':
											mat4.rotate(m,m,angle,[0,0,1]);
									break;
							}

					break;
				case 'scale':

					var scaleCoords = this.getPoint3Element(transformation);
					mat4.scale(m,m,[scaleCoords.x,scaleCoords.y,scaleCoords.z]);

					break;
				}
	}

	return m;
}

MySceneGraph.prototype.loadPrimitives=function (rootElement) {
	var primitives = rootElement.getElementsByTagName('primitives')[0];

	if (primitives == null)
		this.onXMLError("Error loading primitives.");


	var primitiveTmp = primitives.getElementsByTagName('primitive');




	for (var i = 0; i < primitiveTmp.length; i++) {
			if(primitiveTmp[i].children.length != 1){
				this.onXMLError("Error loading primitives (more than one tag).");
				continue;
			}

			var id = this.reader.getString(primitiveTmp[i],'id');
			var primitiveTag = primitiveTmp[i].children[0];
			var primitiveName = primitiveTag.tagName;

			switch (primitiveName) {
				case 'rectangle':
							var x1=this.reader.getFloat(primitiveTag,'x1');
							var y1=this.reader.getFloat(primitiveTag,'y1');
							var x2=this.reader.getFloat(primitiveTag,'x2');
							var y2=this.reader.getFloat(primitiveTag,'y2');

							this.primitives[id]= new RectangleData(id,new Point2(x1,y1),new Point2(x2,y2));

					break;
				case 'triangle':
							var x1=this.reader.getFloat(primitiveTag,'x1');
							var y1=this.reader.getFloat(primitiveTag,'y1');
							var z1=this.reader.getFloat(primitiveTag,'z1');
							var x2=this.reader.getFloat(primitiveTag,'x2');
							var y2=this.reader.getFloat(primitiveTag,'y2');
							var z2=this.reader.getFloat(primitiveTag,'z2');
							var x3=this.reader.getFloat(primitiveTag,'x3');
							var y3=this.reader.getFloat(primitiveTag,'y3');
							var z3=this.reader.getFloat(primitiveTag,'z3');

							this.primitives[id]= new TriangleData(id,new Point3(x1,y1,z1),new Point3(x2,y2,z2),new Point3(x3,y3,z3));

					break;
				case 'cylinder':
							var base=this.reader.getFloat(primitiveTag,'base');
							var top=this.reader.getFloat(primitiveTag,'top');
							var height=this.reader.getFloat(primitiveTag,'height');
							var slices=this.reader.getInteger(primitiveTag,'slices');
							var stacks=this.reader.getInteger(primitiveTag,'stacks');


							this.primitives[id]= new CylinderData(id,base,top,height,slices,stacks);

					break;
				case 'sphere':
							var radius=this.reader.getFloat(primitiveTag,'radius');
							var slices=this.reader.getInteger(primitiveTag,'slices');
							var stacks=this.reader.getInteger(primitiveTag,'stacks');

							this.primitives[id]= new SphereData(id,radius,slices,stacks);
					break;
				case 'torus':
							var inner=this.reader.getFloat(primitiveTag,'inner');
							var outer=this.reader.getFloat(primitiveTag,'outer');
							var slices=this.reader.getInteger(primitiveTag,'slices');
							var loops=this.reader.getInteger(primitiveTag,'loops');



							this.primitives[id]= new TorusData(id,inner,outer,slices,loops);
					break;
				default:
						this.onXMLError("Error loading primitives(invalid primitive tag).");
			}
				console.log(this.primitives[id]);
	}


}


MySceneGraph.prototype.loadComponents= function(rootElement) {
	var components = rootElement.getElementsByTagName('components')[0];

	if (components == null)
		this.onXMLError("Error loading components.");


	var componentTmp = components.getElementsByTagName('component');

	var id,tranformation,materials,texture,componentIds,primitiveIds;

	for (var i = 0; i < componentTmp.length; i++) {
		//load  componet id
		id = this.reader.getString(componentTmp[i], 'id');

		//load  tranformation id for the component
		var transformationTmp=	componentTmp[i].getElementsByTagName('transformation')[0];
		var transformationTag=transformationTmp.getElementsByTagName('transformationref');
		if(transformationTag.length != 0){
			tranformation=this.reader.getString(transformationTag[0],'id');
			console.log(tranformation);
		}else{//a transformação tem que ser criada
			//guarda o id da transformação
			tranformation=id + "texture";
			//guarda tranformação no array de tranformações
			this.transformations[tranformation]=this.getTranformationMatrix(transformationTmp);
		}


		//load  material id's for the component
		var materialsTmp=	componentTmp[i].getElementsByTagName('materials')[0];
		var materialTag=materialsTmp.getElementsByTagName('material');
		materials = new Array(materialTag.length);
		for (var j = 0; j < materialTag.length; j++) {
			materials[j]=this.reader.getString(materialTag[j],'id');
		}




		//load  texture id for the component
		var textureTmp=	componentTmp[i].getElementsByTagName('texture')[0];
		texture=this.reader.getString(textureTmp,'id');


		//load  children id's for the component
		var childrenTmp=	componentTmp[i].getElementsByTagName('children')[0];
		var componentTag=childrenTmp.getElementsByTagName('componentref');
		var primitiveTag=childrenTmp.getElementsByTagName('primitiveref');
		componentIds = new Array(componentTag.length);
		for (var j = 0; j < componentTag.length; j++) {
			componentIds[j]=this.reader.getString(componentTag[j],'id');
		}

		primitiveIds = new Array(primitiveTag.length);
		for (var j = 0; j < primitiveTag.length; j++) {
			primitiveIds[j]=this.reader.getString(primitiveTag[j],'id');
		}

		this.components[id]=new Component(id,tranformation,materials,texture,componentIds,primitiveIds);
	}
}

MySceneGraph.prototype.getRGBAElement=function (element) {
	if (element == null)
		onXMLError("Error loading 'RGBA' element .");

	var res = new ColorRGBA(this.reader.getFloat(element, 'r'), this.reader.getFloat(element, 'g'),
	this.reader.getFloat(element, 'b'), this.reader.getFloat(element, 'a'));

	return res;
}

MySceneGraph.prototype.getPoint3Element=function (element) {
	if (element == null)
		onXMLError("Error loading 'Point3' element .");

	var res = new Point3(this.reader.getFloat(element, 'x'), this.reader.getFloat(element, 'y'),
	this.reader.getFloat(element, 'z'));

	return res;
}





/*
* Callback to be executed on any read error
*/

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
