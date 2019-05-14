/*
 * Definitions
*/
const LIGHTTYPES = {
    HEMISPHERIC: "Hemispheric",
    POINT: "point"
};

const MESHSHAPES = {
    SPHERE: "sphere",
    BOX: "box",
    PLANE: "plane",
    GROUND: "ground"
};

const LINETYPES = {
    SOLID: "solid",
    DASHED: "dashed"
};

const ACTIONTYPES = {
    MOVERELATIVE: "move_relatively",
    MOVEABSOLUTE: "move_absolutely",
    ROTATETOWORLD: "rotate_to_world",
    ROTATETOLOCAL: "rotate_to_local",
    SCALE: "scale"
};

 const CAMERATYPES = {
     UNIVERSAL: "universal",
     ARCROTATE: "arcrotate",
     FOLLOW: "follow",
     FLY: "fly"
 }

export { LIGHTTYPES, MESHSHAPES, LINETYPES, ACTIONTYPES, CAMERATYPES };