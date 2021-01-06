import * as THREE from '/node_modules/three/build/three.module.js';

import { TGALoader } from '/node_modules/three/examples/jsm/loaders/TGALoader.js';
import { AddObjectCommand } from '/js/commands/AddObjectCommand.js';
import { LoaderUtils } from '/js/LoaderUtils.js';

function Loader (editor){
    var scope = this;

	this.texturePath = '';

	this.loadItemList = function ( items ) {

		LoaderUtils.getFilesFromItemList( items, function ( files, filesMap ) {

			scope.loadFiles( files, filesMap );

		} );

	};

	this.loadFiles = function ( files, filesMap ) {

		if ( files.length > 0 ) {

			var filesMap = filesMap || LoaderUtils.createFilesMap( files );

			var manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				url = url.replace( /^(\.?\/)/, '' ); // remove './'

				var file = filesMap[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					return URL.createObjectURL( file );

				}

				return url;

			} );

			manager.addHandler( /\.tga$/i, new TGALoader() );

			for ( var i = 0; i < files.length; i ++ ) {

				scope.loadFile( files[ i ], manager );

			}

		}

	};

	this.loadFile = function ( file, manager ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();


        switch (extension){
            case 'dae':

				reader.addEventListener( 'load', async function ( event ) {

					var contents = event.target.result;

					var { ColladaLoader } = await import( '/node_modules/three/examples/jsm/loaders/ColladaLoader.js' );

					var loader = new ColladaLoader( manager );
					var collada = loader.parse( contents );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( editor, collada.scene ) );

				}, false );
				reader.readAsText( file );

				break;

        }
    }

}
export {Loader};