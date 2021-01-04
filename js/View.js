import * as THREE from '/node_modules/three/build/three.module.js';
import {UIPanel} from '../libs/ui.js';


function View(editor){

    var signals = editor.signals;
    

    var clock = new THREE.Clock();
    
    var camera = editor.camera;
    var scene = editor.scene;
    var mixer = editor.mixer;

    var objects = [];

    var container = new UIPanel();
    container.setId('view');
    container.setPosition('absolute');

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
    container.dom.appendChild( renderer.domElement );

    var grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );
    grid.material.transparent = true;
    scene.add(grid);

    
    
    function animate (){
        
        var delta = clock.getDelta();
        requestAnimationFrame(animate);

        var needsUpdate = false;

        if (mixer.stats.action.inUse > 0){
            mixer.update(delta);
            needsUpdate = true;
        }

        if(needsUpdate === true) render();
    }

    function updateAspectRatio() {

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

	}

    function render(){
       
        renderer.render(scene, camera);

    }
    // Signals
	signals.windowResize.add( function () {

		updateAspectRatio();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );
    

    return container;
}
    export {View}