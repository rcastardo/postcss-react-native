"use strict";
function toInt(v) {
    return parseInt(v, 10);
}
/**
 * This represents the ratio of horizontal pixels (first term) to vertical pixels (second term).
 * @param v
 * @param height
 * @param width
 * @returns {number}
 */
function ratio(v, height, width) {
    const [hor,ver=1] = v.split('/', 2).map(toInt);
    const vr = hor / ver;
    const cr = width / height;
    const ret = cr - vr;
    return ret;
}

const DEVICE_FEATURES = {
    'width': (v, {width})=>v == width,
    'min-width': (v, {width})=> v >= width,
    'max-width': (v, {width})=> v <= width,
    'height': (v, {height})=> v == height,
    'min-height': (v, {height})=> v >= height,
    'max-height': (v, {height})=> v <= height,
    /*
     @media screen and (min-aspect-ratio: 1/1) { ... }
     This selects the style when the aspect ratio is either 1:1 or greater. In other words, these styles will only be applied when the viewing area is square or landscape.
     */
    'aspect-ratio': (v, {height, width}) => ratio(v, height, width) == 0,
    'min-aspect-ratio': (v, {height, width}) => ratio(v, height, width) <= 0,
    'max-aspect-ratio': (v, {height, width}) => ratio(v, height, width) >= 0
};

const FEATURES = Object.assign({
        'color': (v, {density}) => v == density,
        'min-color': (v, {density}) => v >= density,
        'max-color': (v, {density}) => v <= density,
        'orientation': (v, {height, width})=> {
            if (v === 'landscape') {
                return width > height;
            } else if (v === 'portrait') {
                return width < height;
            }
        }
    }, DEVICE_FEATURES, Object.keys(DEVICE_FEATURES).reduce((obj, key)=> {
        obj[key.replace(/^(min-|max-)(.*)?/, '$1device-$2')] = DEVICE_FEATURES[key];
        return obj;
    }, {}),

//unsupported valid, media features
    ['color-index', 'min-color-index', 'max-color-index',
        'monochrome', 'min-monochrome', 'max-monochrome',
        'resolution', 'min-resolution', 'max-resolution',
        'scan',
        'grid']
        .reduce((obj, feature)=> {
            obj[feature] = ()=> {
                console.log('unsupported media feature', feature);
                return false
            };
            return obj;
        }, {}));

export default FEATURES;