/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/Spotlight.js
 *  > Angled spotlight with mounting.
 **/

/* global PHYSED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.Spotlight = function (colour, intensity, distance, angle) {
  THREE.Object3D.call(this)

  // Triangluar-prism base
  var base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 2, 3, 1),
    new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0x888888, shininess: 3 })
  )
  base.rotation.set(Math.PI_2, Math.PI / 3, 0)
  this.add(base)

  // Light panel
  var lp = new ASSETS.LightPanel(10, colour, 0.7)
  lp.scale.set(0.43, 1, 0.9)
  lp.rotation.set(Math.PI / 3, -Math.PI_2, 0, 'ZYX')
  lp.position.set(-0.225, 0.05, 0)
  this.add(lp)

  // Spotlight
  var light = new THREE.SpotLight(colour || 0xffffff, 1, distance || 15)
  light.exponent = intensity || 2
  light.angle = angle || Math.PI / 3
  light.decay = 2
  light.castShadow = false
  light.position.set(0, 0, 0)
  light.target.position.set(0, 0, -1)
  base.add(light)
  base.add(light.target)

  base.geometry.computeBoundingBox()
  this.collider = new PHYSED.AABBCollider(base.geometry.vertices, this.position, this.rotation, base.geometry.boundingBox)
}

// Extends THREE.Object3D
ASSETS.Spotlight.prototype = Object.create(THREE.Object3D.prototype)
ASSETS.Spotlight.prototype.constructor = ASSETS.Spotlight
