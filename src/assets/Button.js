/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/Button.js
 *  > A large-pressable button.
 **/

/* global PHYSED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.Button = function (pressCallback) {
  THREE.Object3D.call(this)

  var edge = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.05, 2.05),
    new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0x888888, shininess: 15 })
  )
  edge.position.y = 0.025
  this.add(edge)

  var base = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.15, 2),
    new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0x888888, shininess: 8 })
  )
  base.position.y = 0.075
  base.geometry.computeBoundingBox()
  this.add(base)

  var face = this.face = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.3, 1.6),
    new THREE.MeshPhongMaterial({ color: 0x880000, specular: 0xff0000, shininess: 100 })
  )
  face.material.opacity = 0.8
  face.material.transparent = true
  face.position.y = 0.16
  face.geometry.computeBoundingBox()
  this.add(face)

  this.light = new THREE.PointLight(0xff0000, 1, 3, 5)
  this.light.position.y = 0.5
  this.add(this.light)

  this.colliders = [
    new PHYSED.AABBCollider(base.geometry.vertices, this.position, this.rotation, base.geometry.boundingBox),
    new PHYSED.AABBCollider(face.geometry.vertices, this.position, this.rotation, face.geometry.boundingBox, false, pressCallback)
  ]
}

// Extends THREE.Object3D
ASSETS.Button.prototype = Object.create(THREE.Object3D.prototype)
ASSETS.Button.prototype.constructor = ASSETS.Button
