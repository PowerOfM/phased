/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/LightPlate.js
 *  > A wall-mounted light plate.
 **/

/* global PHASED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.LightPlate = function (colour, intensity, distance) {
  THREE.Object3D.call(this)

  var base = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.2, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0x888888, shininess: 3 })
  )
  base.position.z = 0.05
  this.add(base)

  var inner = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 0.1),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, emissive: 0x878787, shininess: 30 })
  )
  inner.position.z = 0.1
  this.add(inner)

  var plate = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x6b6b6b, emissive: 0x878787, roughness: 0.9, normalMap: PHASED.assetLoader.get('glassplate', 'normal') })
  )
  plate.transparent = true
  plate.opacity = 0.7
  plate.position.z = 0.25
  this.add(plate)

  var supportMat = new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0x888888, emissive: 0x111111, shininess: 30 })
  for (var i = 0; i < 4; ++i) {
    var support = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.3),
      supportMat
    )
    support.rotation.set(Math.PI_2, 0, 0)
    support.position.set((i % 2 === 0 ? -1 : 1) * 0.9, (i < 2 ? -1 : 1) * 0.9, 0.17)
    this.add(support)
  }

  this.light = new THREE.PointLight(colour || 0xffffff, intensity || 0.5, distance || 40)
  this.light.position.z = 0.3
  this.add(this.light)
}

// Extends THREE.Object3D
ASSETS.LightPlate.prototype = Object.create(THREE.Object3D.prototype)
ASSETS.LightPlate.prototype.constructor = ASSETS.LightPlate
