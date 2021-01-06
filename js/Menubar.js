import {UIPanel, UIButton} from '../libs/ui.js';

function Menubar(editor){

    var container = new UIPanel();
    container.setId('menubar');

    // Botones del menu para el editor (texto, modelo, imagen, ...)

    var ModeloIcon = document.createElement('img');
    ModeloIcon.src = 'images/modelo.svg'

    var ModeloForm = document.createElement('form');
    ModeloForm.style.display = 'none';
    document.body.appendChild(ModeloForm);

    var ModeloInput = document.createElement('input');
    ModeloInput.multiple = true;
    ModeloInput.type = 'file';
    ModeloInput.addEventListener('change', function(){
        editor.loader.loadFiles(ModeloInput.files);
        ModeloForm.reset();
    });
    ModeloForm.appendChild(ModeloInput);

    var Modelo = new UIButton();
    Modelo.dom.appendChild(ModeloIcon);
    Modelo.onClick( function(){
        ModeloInput.click();
    });
    container.add(Modelo);

    // TEXTO

    var VideoIcon = document.createElement('img');
    VideoIcon.src = 'images/video.svg'

    var VideoForm = document.createElement('form');
    VideoForm.style.display = 'none';
    document.body.appendChild(VideoForm);

    var VideoInput = document.createElement('input');
    VideoInput.multiple = true;
    VideoInput.type = 'file';
    

    var Video = new UIButton();
    Video.dom.appendChild(VideoIcon);
    Video.onClick( function(){
        VideoInput.click();
    });
    container.add(Video);
    return container;

}
    export {Menubar};