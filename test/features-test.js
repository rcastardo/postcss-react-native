"use strict";
import FEATURES from '../src/features';
import {expect} from 'chai';

function feature(type, value, {width=0, height=0, scale=0}, answer) {
    return expect(FEATURES[type](value, {
        width,
        height,
        scale
    }), `${type} ${value} ${width}/${height}@${scale} is ${answer}`).to.be[answer+''];
}


describe('features', function () {

    it('should match orientation', function () {
        feature('orientation', 'landscape', {height: 300, width: 400}, true);
        feature('orientation', 'landscape', {height: 600, width: 400}, false);
        feature('orientation', 'portrait', {height: 300, width: 400}, false);
        feature('orientation', 'portrait', {height: 600, width: 400}, true);
    });

    it('should match color', function () {
        feature('color', 2, {scale: 1}, false);
        feature('color', 1, {scale: 1}, true);

        feature('min-color', 1, {scale: 1}, true);
        feature('min-color', 2, {scale: 4}, true);
        feature('min-color', 5, {scale: 4}, false);

        feature('max-color', 2, {scale: 1}, true);
        feature('max-color', 5, {scale: 4}, true);
        feature('max-color', 2, {scale: 4}, false);
    });

    for (let prefix of ['', 'device-']) {
        it(`should match max-${prefix}height`, function () {
            feature(`max-${prefix}height`, 200, {height: 300}, false);
            feature(`max-${prefix}height`, 200, {height: 100}, true);
        });
        it(`should match min-${prefix}height`, function () {
            feature(`min-${prefix}height`, 200, {height: 300}, true);
            feature(`min-${prefix}height`, 200, {height: 100}, false);
        });
        it(`should match max-${prefix}width`, function () {
            feature(`max-${prefix}width`, 200, {width: 300}, false);
            feature(`max-${prefix}width`, 200, {width: 100}, true);
        });
        it(`should match min-${prefix}width`, function () {
            feature(`min-${prefix}width`, 200, {width: 300}, true);
            feature(`min-${prefix}width`, 200, {width: 100}, false);
        });
        it(`should match ${prefix}aspect-ratio`, function () {
            feature(`aspect-ratio`, `1/1`, {width: 300, height: 200}, false);
            feature(`aspect-ratio`, `1/1`, {width: 200, height: 200}, true);
        });
        it(`should match min-${prefix}aspect-ratio`, function () {

            feature(`min-${prefix}aspect-ratio`, `1/1`, {
                width: 300,
                height: 200
            }, true);

            feature(`min-${prefix}aspect-ratio`, `1/1`, {
                width: 200,
                height: 200
            }, true);

            feature(`min-${prefix}aspect-ratio`, `2/1`, {
                width: 400,
                height: 300
            }, false);

            feature(`min-${prefix}aspect-ratio`, `2/1`, {
                width: 400,
                height: 100
            }, true);

        });
        it(`should match max-${prefix}aspect-ratio`, function () {

            feature(`max-${prefix}aspect-ratio`, `1/1`, {
                width: 300,
                height: 400
            }, true);

            feature(`max-${prefix}aspect-ratio`, `1/1`, {
                width: 200,
                height: 200
            }, true);

            feature(`max-${prefix}aspect-ratio`, `2/1`, {
                width: 400,
                height: 200
            }, true);

            feature(`max-${prefix}aspect-ratio`, `2/1`, {
                width: 100,
                height: 400
            }, true);
        });
    }
});
