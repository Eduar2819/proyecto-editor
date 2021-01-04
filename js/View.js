import * as THREE from '/node_modules/three/build/three.module.js';
import {UIPanel} from '../libs/ui.js';

function View(){
    var container = new UIPanel();
    container.setId('view');
    container.setPosition('absolute');

    var grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );

    return container;
}
    export {View}