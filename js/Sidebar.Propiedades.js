
import {UIBreak, UIPanel, UIText} from './libs/ui.js';

function SidebarPropiedades(){

    var container = new UIPanel();
    container.setPadding( '10px' );
    container.add( new UIText('PROPIEDADES'));
    container.add ( new UIBreak);

    return container;

}
    export {SidebarPropiedades};