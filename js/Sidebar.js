
import { SidebarScene } from './Sidebar.Scene.js';
import {SidebarPropiedades} from './Sidebar.Propiedades.js'
import {UIPanel, UISpan, UIButton} from '/js/libs/ui.js';

function Sidebar (editor){

    var container = new UIPanel();
    container.setId('sidebar');

    var scene = new UISpan().add(
        new SidebarScene(editor),
        new SidebarPropiedades()
    );

    container.add(scene);


    return container;

} 
    export {Sidebar};