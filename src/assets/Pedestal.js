/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/Pedestal.js
 *  > A pedestal with the Phasor
 **/

/* global PHYSED, PHASED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.Pedestal = function (collisionCallback) {
  var devMesh = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xccffff, shininess: 3 })
  THREE.Mesh.call(this, new THREE.CylinderGeometry(1, 1, 0.1, 8, 2), devMesh)

  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 8, 2), devMesh)
  body.position.set(0, 1, 0)
  this.add(body)

  var platform = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 8, 2), devMesh)
  platform.position.set(0, 2.05, 0)
  this.add(platform)

  this.collider = new PHYSED.AABBCollider(null, this.position, this.rotation,
    { min: new THREE.Vector3(-0.5, -2, -0.5), max: new THREE.Vector3(0.5, 2, 0.5) },
    false, collisionCallback
  )

  this.hasPhasor = true
  var phasor = this.phasor = PHASED.assetLoader.get('phasor')
  phasor.position.set(0, 1.8, 0)
  phasor.scale.set(0.15, 0.15, 0.15)
  this.add(phasor)
}

// Extends THREE.Mesh
ASSETS.Pedestal.prototype = Object.create(THREE.Mesh.prototype)
ASSETS.Pedestal.prototype.constructor = ASSETS.Pedestal

ASSETS.Pedestal.prototype.setPhasor = function (enable) {
  if (this.hasPhasor === enable) return

  this.hasPhasor = enable
  if (enable) {
    this.add(this.phasor)
  } else {
    this.remove(this.phasor)
  }
}
