import * as THREE from '/node_modules/three/build/three.module.js';
import {EditorControls} from '/js/EditorControls.js'
import {TransformControls} from '/node_modules/three/examples/jsm/controls/TransformControls.js'
import {UIPanel} from '../libs/ui.js';



function View(editor){

    var signals = editor.signals;
    
    var container = new UIPanel();
    container.setId('view');
    container.setPosition('absolute');

    var clock = new THREE.Clock();
    
    var camera = editor.camera;
    var scene = editor.scene;
    var showSceneHelpers = true;
    var sceneHelpers = editor.sceneHelpers;
    

    
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight  );
    container.dom.appendChild( renderer.domElement );

    var objects = [];


    var grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );
    

    var box = new THREE.Box3();

    var selectionBox = new THREE.BoxHelper();
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.visible = false;
    sceneHelpers.add(selectionBox);

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

    var transformControls = new TransformControls(camera, container.dom);
	var transformControls = new TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

			var helper = editor.helpers[ object.id ];

			if ( helper !== undefined && helper.isSkeletonHelper !== true ) {

				helper.update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {

						editor.execute( new SetPositionCommand( editor, object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {

						editor.execute( new SetRotationCommand( editor, object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {

						editor.execute( new SetScaleCommand( editor, object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    //Eventos
    function updateAspectRatio() {

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

    }
    
    function getIntersects(point, objects){

        mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );
    };

    var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();
    
    function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

    };

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {

		// event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );

		}

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );
    
    var controls = new EditorControls(camera, container.dom);
    controls.addEventListener('change', function(){

        signals.cameraChanged.dispatch( camera );
        signals.refreshSidebarObject3D.dispatch(camera);
    })
    
    
    // Signals
    signals.editorCleared.add( function(){

        controls.center.set(0,0,0);
        render();
    });

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererUpdated.add( function () {

		scene.traverse( function ( child ) {

			if ( child.material !== undefined ) {

				child.material.needsUpdate = true;

			}

		} );

		render();

    } );

    signals.viewCamera.add(function (){

        var viewCamera = editor.viewCamera;

        controls.enabled = (viewCamera === editor.camera);
        render();
    })
    
	signals.windowResize.add( function () {

		updateAspectRatio();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

    } );

    signals.showGridChange.add(function (showGrid){
        grid.visible = showGrid;
        render();
    })

    signals.showHelpersChanged.add( function ( showHelpers ) {

		showSceneHelpers = showHelpers;
		transformControls.enabled = showHelpers;

		render();

    } );

    signals.cameraResetted.add( updateAspectRatio );
    
    function animate (){
        
        
        requestAnimationFrame( animate );

        var mixer = editor.mixer;
        var delta = clock.getDelta();
        
        var needsUpdate = false;
        

        if (mixer.stats.actions.inUse > 0){
            mixer.update(delta);
            needsUpdate = true;
        }

        if(needsUpdate === true) render();
    }
    requestAnimationFrame( animate );

    var startTime = 0;
    var endTime = 0;
    
    function render(){

        startTime = performance.now();
        //renderer.render(scene, camera);
        scene.add( grid );
		renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.render( scene, editor.viewCamera );
		scene.remove( grid );

		if ( camera === editor.viewCamera ) {

			renderer.autoClear = false;
			if ( showSceneHelpers === true ) renderer.render( sceneHelpers, camera );
			renderer.autoClear = true;

		}

		endTime = performance.now();
		editor.signals.sceneRendered.dispatch( endTime - startTime );
    }
    
    return container;
}
    export {View}