/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/vfx/GravityShift.js
 *  > Gravity shift visual effect.
 **/

/* global PHASED */

/* namespace */
var VFX = VFX || {}

VFX.GravityShift = {
  // Must be called after AssetLoader initializes
  init: function () {
    VFX.GravityShift.shader = PHASED.assetLoader.get('phased', {
      'fTime': { type: 'f', value: 2.0 },
      'tBase': { type: 't', value: null }
    })
  },

  update: function (t) {
    VFX.GravityShift.shader.uniforms.fTime.value += t
  },

  show: function () {
    VFX.GravityShift.shader.uniforms.fTime.value = 0.0
  }
}
