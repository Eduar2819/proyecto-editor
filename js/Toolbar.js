import { UIPanel, UIButton } from '../libs/ui.js';

function Toolbar () {
    var container = new UIPanel();
    container.setId('toolbar');

    // translate / rotate /scale 
    var translateIcon = document.createElement('img');
    //translateIcon.title = string.getKey('toolbar/translate');
    translateIcon.src = 'images/translate.svg';

    var translate = new UIButton();
    translate.dom.className = 'Button selected';
    translate.dom.appendChild(translateIcon);
    translate.onClick(function (){

        //signal.trasformModeChanged.dispatch('translate');
    });
    container.add(translate);

    var rotateIcon = document.createElement('img');
    //rotateIcon.title = string.getKey('toolbar/rotate');
    rotateIcon.src = 'images/rotate.svg';

    var rotate = new UIButton();
    rotate.dom.appendChild(rotateIcon);
    rotate.onClick( function (){
        //signals.transformModeChanged.dispatch('rotate');
    });
    container.add(rotate);

    var scaleIcon = document.createElement('img');
    //scaleIcon.title = string.getKey('toolbar/scale');
    scaleIcon.src = 'images/scale.svg';

    var scale = new UIButton();
    scale.dom.appendChild(scaleIcon);
    scale.onClick( function () {
        //signal.trasformModeChanged.dispatch('scale');
    });
    container.add(scale);


    return container;
}
export {Toolbar};