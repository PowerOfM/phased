/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/LightPanel.js
 *  > A wall-mounted light plate.
 **/

/* global PHASED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.LightPanel = function (distance, colour, intensity) {
  THREE.Object3D.call(this)

  var base = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.1, 1),
    new THREE.MeshPhongMaterial({
      color: colour || 0xffffff, emissive: 0x666666, shininess: 2,
      map: PHASED.assetLoader.get('lightpanel', 'map'),
      normalMap: PHASED.assetLoader.get('lightpanel', 'normal') })
  )
  base.position.set(0, 0.05, 0)
  this.add(base)

  var pointl = new THREE.PointLight(colour || 0xffffff, intensity || 1, distance || 5)
  pointl.position.set(1, 1, 0)
  this.add(pointl)

  var point2 = new THREE.PointLight(colour || 0xffffff, intensity || 1, distance || 5)
  point2.position.set(-1, 1, 0)
  this.add(point2)
}

// Extends THREE.Object3D
ASSETS.LightPanel.prototype = Object.create(THREE.Object3D.prototype)
ASSETS.LightPanel.prototype.constructor = ASSETS.LightPanel
