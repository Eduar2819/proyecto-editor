import * as THREE from '/node_modules/three/build/three.module.js';

var Camera_principal = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
Camera_principal.name = 'Camera';
Camera_principal.position.set(0, 5, 10);
Camera_principal.lookAt( new THREE.Vector3() );

function Editor (){

    this.camera = Camera_principal.clone();
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
}