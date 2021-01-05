import * as THREE from '/node_modules/three/build/three.module.js';

var Camera_principal = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
Camera_principal.name = 'Camera';
Camera_principal.position.set(0, 5, 10);
Camera_principal.lookAt( new THREE.Vector3() );

function Editor (){
    var Signal = signals.Signal;

    this.signals = {

        editorCleared: new Signal(),

        transformModeChanged: new Signal(),
		snapChanged: new Signal(),
		spaceChanged: new Signal(),
		rendererChanged: new Signal(),
        rendererUpdated: new Signal(),

        sceneRendered: new Signal(),
        refreshSidebarObject3D: new Signal(),

        cameraChanged: new Signal(),

        viewCamera: new Signal(),
        showGridChange: new Signal(),
        showHelpersChanged: new Signal(),
        cameraResetted: new Signal(),

        cameraAdded: new Signal(),
        
        windowResize: new Signal(),

    };

    this.camera = Camera_principal.clone();
    
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color( 0xFFFFFF );

    this.sceneHelpers = new THREE.Scene();

    this.object = {};
    this.cameras = {}
    this.helpers ={}

    this.materialRefCounter = new Map();
    this.selected = null;

    this.animations = {};
    this.mixer = new THREE.AnimationMixer (this.scene);

    this.viewCamera = this.camera;
    this.addCamera(this.camera);
}

Editor.prototype = {
    select: function (object){
        if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		//this.config.setKey( 'selected', uuid );
		//this.signals.objectSelected.dispatch( object );
    },

    addCamera: function ( camera ) {

		if ( camera.isCamera ) {

			this.cameras[ camera.uuid ] = camera;

			this.signals.cameraAdded.dispatch( camera );

		}

	},
}
    export {Editor};