/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/GlassBarrier.js
 *  > A large glass wall with a bounding frame.
 **/

/* global PHASED, PHYSED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

ASSETS.GlassBarrier = function (w, h) {
  THREE.Object3D.call(this)

  // Glass
  var glassTexture = PHASED.assetLoader.get('glassbarrier', 'map', { wrapS: THREE.ClampToEdgeWrapping, repeatU: 1, repeatV: h / 2 })
  // glassTexture.side = THREE.DoubleSide

  var glassMat = new THREE.MeshPhongMaterial({ map: glassTexture, specular: 0xffffff, shininess: 45, shading: THREE.FlatShading })
  glassMat.blending = THREE.AdditiveBlending
  glassMat.transparent = true
  var glass = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.5, h - 0.5, 0.2),
    glassMat
  )
  this.add(glass)

  // Borders
  var borderMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 2, shading: THREE.FlatShading })
  var borderTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, 0.5), borderMat)
  borderTop.position.set(0, h / 2 - 0.25, 0)
  this.add(borderTop)

  var borderBottom = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, 0.5), borderMat)
  borderBottom.position.set(0, -h / 2 + 0.25, 0)
  this.add(borderBottom)

  var borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, h, 0.5), borderMat)
  borderLeft.position.set(-w / 2 + 0.25, 0, 0)
  this.add(borderLeft)

  var borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, h, 0.5), borderMat)
  borderRight.position.set(w / 2 - 0.25, 0, 0)
  this.add(borderRight)

  // Collider
  this.collider = new PHYSED.AABBCollider(null, this.position, this.rotation, { min: new THREE.Vector3(-w / 2, -h / 2, -0.5), max: new THREE.Vector3(w / 2, h / 2, 0.5) })
}

// Extends THREE.Object3D
ASSETS.GlassBarrier.prototype = Object.create(THREE.Object3D.prototype)
ASSETS.GlassBarrier.prototype.constructor = ASSETS.GlassBarrier

ASSETS.GlassBarrier.prototype.updateCollider = function () {
  this.collider.update(null, this.position, this.rotation)
}
