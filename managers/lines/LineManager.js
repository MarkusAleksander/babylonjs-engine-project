import { LINETYPES } from '../../definitions/definitions.js';

const LineManager = (function LineManager() {

    const lines = [];

    var _isInitialised = false,
        _sceneManagerRef;

    /*
    * Create line from BABYLON
    * PRIVATE
    * type: DEF.LINETYPES
    * name: String
    * pointsArray: Array of Babylon.Vector3
    * options: Object
    */
    function _createLines (type, name, pointsArray, options) {

        switch(type) {
            case LINETYPES.SOLID:
                return BABYLON.MeshBuilder.CreateLines(name, Object.assign({points: pointsArray}, options), _sceneManagerRef.getScene());
            case LINETYPES.DASHED:
                return BABYLON.MeshBuilder.CreateDashedLines(name, Object.assign({points: pointsArray}, options), _sceneManagerRef.getScene());
            default:
                return BABYLON.MeshBuilder.CreateLines(name, Object.assign({points: pointsArray}, options), _sceneManagerRef.getScene());
        }
    }

    /*
    * Create a managable lines object
    * PRIVATE
    * type: DEF.LINETYPES
    * name: String
    * pointsArray: Array of Babylon.Vector3
    * options: Object
    */
    function _createLinesObject (type, name, pointsArray = [], options = {}) {
        return {
            name: name,
            type: type,
            pointsArray: pointsArray,
            options: options,
            lines: _createLines(type, name, pointsArray, options)
        }
    }

    /*
    * Create line from BABYLON
    * PUBLIC
    * type: DEF.LINETYPES
    * name: String
    * pointsArray: Array of Babylon.Vector3
    * options: Object
    */
    function _addLines (type, name, pointsArray = [], options = {}) {

        if(pointsArray.length < 1) {
            console.log('No points passed to _addLines');
            return;
        }

        if(_getLines(name)) return;

        let processedPoints = [];

        for(let i = 0; i < pointsArray.length; i++) {
            processedPoints.push(new BABYLON.Vector3(...pointsArray[i]));
        }

        lines.push(_createLinesObject(type, name, processedPoints, options));
    }

    /*
    * get lines by name
    * PUBLIC
    * name: String
    */
    function _getLines (name) {
        if(!_isInitialised) return;

        let line = lines.find(function findLineByName (el) {
            return el.name == name;
        });
        return line;
    }

    /*
    * Initialise with Scene Manager
    * PUBLIC
    * sceneManager: SceneManager
    */
    function _init (sceneManager) {
        if(sceneManager) {
            _sceneManagerRef = sceneManager;
            _isInitialised = true;
        }
    }

    return {
        initialise: _init,
        addLines: _addLines,
        getLines: _getLines
    }

})();

export default LineManager;