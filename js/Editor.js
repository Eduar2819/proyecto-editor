import * as THREE from '/node_modules/three/build/three.module.js';

import {History as _History} from '/js/History.js'
import {Loader} from '/js/Loader.js'

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
        sceneGraphChanged: new Signal(),

        geometryChanged: new Signal(),

		objectSelected: new Signal(),
		objectFocused: new Signal(),

		objectAdded: new Signal(),
		objectChanged: new Signal(),
        objectRemoved: new Signal(),
        
        helperAdded: new Signal(),
        helperRemoved: new Signal(),

        materialChanged: new Signal(),

        viewCamera: new Signal(),
        showGridChange: new Signal(),
        showHelpersChanged: new Signal(),
        cameraResetted: new Signal(),

        cameraAdded: new Signal(),
        historyChanged: new Signal(),
        
        windowResize: new Signal(),

    };

    this.camera = Camera_principal.clone();
    
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color( 0xFFFFFF );

    this.sceneHelpers = new THREE.Scene();

    this.object = {};
    this.geometries = {};
	this.materials = {};
    this.cameras = {};
    this.helpers ={};

    this.loader = new Loader(this);
    this.history = new _History(this)

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

    deselect: function () {

		this.select( null );

	},

    //// Objetos //
    addObject: function ( object, parent, index ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			//if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addCamera( child );
			scope.addHelper( child );

		} );

		if ( parent === undefined ) {

			this.scene.add( object );

		} else {

			parent.children.splice( index, 0, object );
			object.parent = parent;

		}

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeCamera( child );
			scope.removeHelper( child );

			if ( child.material !== undefined ) scope.removeMaterial( child.material );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},
//////////////////////////////////////

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

    },
    
    addMaterial: function ( material ) {

		if ( Array.isArray( material ) ) {

			for ( var i = 0, l = material.length; i < l; i ++ ) {

				this.addMaterialToRefCounter( material[ i ] );

			}

		} else {

			this.addMaterialToRefCounter( material );

		}

		this.signals.materialAdded.dispatch();

    },
    
    addMaterialToRefCounter: function ( material ) {

		var materialsRefCounter = this.materialsRefCounter;

		var count = materialsRefCounter.get( material );

		if ( count === undefined ) {

			materialsRefCounter.set( material, 1 );
			this.materials[ material.uuid ] = material;

		} else {

			count ++;
			materialsRefCounter.set( material, count );

		}

	},

    addCamera: function ( camera ) {

		if ( camera.isCamera ) {

			this.cameras[ camera.uuid ] = camera;

			this.signals.cameraAdded.dispatch( camera );

		}

    },
    addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object, helper ) {

			if ( helper === undefined ) {

				if ( object.isCamera ) {

					helper = new THREE.CameraHelper( object );

				} else if ( object.isPointLight ) {

					helper = new THREE.PointLightHelper( object, 1 );

				} else if ( object.isDirectionalLight ) {

					helper = new THREE.DirectionalLightHelper( object, 1 );

				} else if ( object.isSpotLight ) {

					helper = new THREE.SpotLightHelper( object, 1 );

				} else if ( object.isHemisphereLight ) {

					helper = new THREE.HemisphereLightHelper( object, 1 );

				} else if ( object.isSkinnedMesh ) {

					helper = new THREE.SkeletonHelper( object.skeleton.bones[ 0 ] );

				} else {

					// no helper for this object type
					return;

				}

				var picker = new THREE.Mesh( geometry, material );
				picker.name = 'picker';
				picker.userData.object = object;
				helper.add( picker );

			}

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

    }(),
    
    focus: function ( object ) {

		if ( object !== undefined ) {

			this.signals.objectFocused.dispatch( object );

		}

    },
    
    focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},
    execute: function ( cmd, optionalName ) {

		this.history.execute( cmd, optionalName );

	},
}
    export {Editor};