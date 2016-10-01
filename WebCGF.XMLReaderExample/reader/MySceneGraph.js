
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
	this.nodes;
	this.leaves;


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


	var emission,ambient,diffuse,specular,shininessElement,shininess;

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
