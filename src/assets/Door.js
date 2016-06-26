/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/General.js
 *  > Level elements common to all chambers
 **/

/* global THREE, PHASED, PHYSED */

/* namespace */
var ASSETS = ASSETS || {}

// TODO: Setup colliders
ASSETS.Doorway = function (playerEntered, playerExited, resetField) {
  this.playerEntered = playerEntered
  this.playerExited = playerExited

  var borderMat = new THREE.MeshPhongMaterial({ color: 0x285a75, specular: 0xa6aaac, shininess: 20, side: THREE.DoubleSide, shading: THREE.FlatShading })
  THREE.Mesh.call(this, new THREE.TorusGeometry(2, 0.5, 6, 6), borderMat)

  // Door segments
  var segMat = new THREE.MeshPhongMaterial({ color: 0x666666, specular: 0xcccccc, shininess: 20, side: THREE.DoubleSide, shading: THREE.FlatShading, map: PHASED.assetLoader.get('metal', 'map') })
  this.segments = []
  this.segmentLength = Math.PI / 3
  for (var i = 0; i < 6; ++i) {
    var seg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 3, 1, false, i * this.segmentLength, this.segmentLength), segMat)
    seg.rotation.x = Math.PI_2
    this.segments.push(seg)
    this.add(seg)
  }

  // Create edge geometry
  var edgeMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0xffffff, shininess: 1, side: THREE.DoubleSide, shading: THREE.FlatShading })
  var edgeGeometry = new THREE.Geometry()
  edgeGeometry.vertices.push(
    new THREE.Vector3(-2.3, -2, 0.3), new THREE.Vector3(-1, -2, 0.3), new THREE.Vector3(-2.3, 0, 0.3),
    new THREE.Vector3(-2.3, -2, -0.3), new THREE.Vector3(-1, -2, -0.3), new THREE.Vector3(-2.3, 0, -0.3),

    new THREE.Vector3(2.3, -2, 0.3), new THREE.Vector3(1, -2, 0.3), new THREE.Vector3(2.3, 0, 0.3),
    new THREE.Vector3(2.3, -2, -0.3), new THREE.Vector3(1, -2, -0.3), new THREE.Vector3(2.3, 0, -0.3),

    new THREE.Vector3(-2.3, 2, 0.3), new THREE.Vector3(-1, 2, 0.3), new THREE.Vector3(-2.3, 0, 0.3),
    new THREE.Vector3(-2.3, 2, -0.3), new THREE.Vector3(-1, 2, -0.3), new THREE.Vector3(-2.3, 0, -0.3),

    new THREE.Vector3(2.3, 2, 0.3), new THREE.Vector3(1, 2, 0.3), new THREE.Vector3(2.3, 0, 0.3),
    new THREE.Vector3(2.3, 2, -0.3), new THREE.Vector3(1, 2, -0.3), new THREE.Vector3(2.3, 0, -0.3)
  )
  edgeGeometry.faces.push(
    new THREE.Face3(0, 1, 2), new THREE.Face3(3, 4, 5),       // Bottom right
    new THREE.Face3(6, 7, 8), new THREE.Face3(9, 10, 11),     // Bottom left
    new THREE.Face3(12, 13, 14), new THREE.Face3(15, 16, 17), // Top right
    new THREE.Face3(18, 19, 20), new THREE.Face3(21, 22, 23), // Top left
    new THREE.Face3(0, 6, 9), new THREE.Face3(0, 3, 9),       // Bottom
    new THREE.Face3(0, 12, 15), new THREE.Face3(0, 3, 15),    // Left
    new THREE.Face3(6, 9, 18), new THREE.Face3(9, 21, 18),    // Right
    new THREE.Face3(12, 15, 18), new THREE.Face3(18, 15, 21)  // Top
  )
  edgeGeometry.computeBoundingSphere()
  var edge = new THREE.Mesh(edgeGeometry, edgeMat)
  this.add(edge)

  // Add edge extensions (to fit with 2x2 wall textures)
  var edge1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4, 0.6), edgeMat)
  edge1.position.set(2.65, 0, 0)
  this.add(edge1)
  var edge2 = edge1.clone()
  edge2.position.set(-2.65, 0, 0)
  this.add(edge2)

  // Animation variables
  this.animating = false
  this.animationStep = 32 / 1000 // 2 * (ms during 60fps) / 2s
  this.animationCount = 0
  this.animationOut = true

  // Bounding colliders
  this.colliderLeft = new PHYSED.AABBCollider(null,
    this.position.clone().sub(new THREE.Vector3(2, 0, 0)), this.rotation,
    { min: new THREE.Vector3(-0.5, -2, -0.5), max: new THREE.Vector3(0.5, 2, 0.5) }, false)
  this.colliderRight = new PHYSED.AABBCollider(null,
    this.position.clone().add(new THREE.Vector3(2, 0, 0)), this.rotation,
    { min: new THREE.Vector3(-0.5, -2, -0.5), max: new THREE.Vector3(0.5, 2, 0.5) }, false)

  // Contact colliders
  this.colliderFront = new PHYSED.AABBCollider(null,
    this.position.clone().add(new THREE.Vector3(0, 0, 1)), this.rotation,
    { min: new THREE.Vector3(-2, -2, -0.5), max: new THREE.Vector3(2, 2, 0.5) }, true, playerEntered)
  this.colliderBack = new PHYSED.AABBCollider(null,
    this.position.clone().sub(new THREE.Vector3(0, 0, 1)), this.rotation,
    { min: new THREE.Vector3(-2, -2, -0.5), max: new THREE.Vector3(2, 2, 0.5) }, true, playerExited)

  // Mid blocking collider
  this.colliderMid = new PHYSED.AABBCollider(null,
    this.position, this.rotation,
    { min: new THREE.Vector3(-2, -2, -0.25), max: new THREE.Vector3(2, 2, 0.25) }, false)

  // Collidable
  this.colliders = [this.colliderLeft, this.colliderRight, this.colliderMid, this.colliderFront, this.colliderBack]
  this.isOpen = false

  // Reset field
  if (resetField) {
    var rf = this.resetField = new ASSETS.HazardField(4, 4, null, null, true, function () {
      PHASED.player.updateGravity(new THREE.Vector3(0, -1, 0))
    }, ASSETS.FIELD_THEME.BLUE)
    rf.rotation.set(0, Math.PI, 0)
    this.add(rf)
  }
}

// Extends THREE.Mesh
ASSETS.Doorway.prototype = Object.create(THREE.Mesh.prototype)
ASSETS.Doorway.prototype.constructor = ASSETS.Doorway

ASSETS.Doorway.prototype.generateStaticCollider = function (position) {
  return new PHYSED.AABBCollider(null, position, this.rotation, { min: new THREE.Vector3(-2, -2, -0.25), max: new THREE.Vector3(2, 2, 0.25) }, false)
}

ASSETS.Doorway.prototype.updateCollider = function () {
  this.colliderLeft.update(null, this.position.clone().sub(new THREE.Vector3(2, 0, 0).applyQuaternion(this.quaternion)), this.rotation)
  this.colliderRight.update(null, this.position.clone().add(new THREE.Vector3(2, 0, 0).applyQuaternion(this.quaternion)), this.rotation)
  this.colliderMid.update(null, this.position, this.rotation, this.quaternion)
  this.colliderFront.update(null, this.position.clone().sub(new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion)), this.rotation)
  this.colliderBack.update(null, this.position.clone().add(new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion)), this.rotation)
}

ASSETS.Doorway.prototype.open = function () {
  if (this.isOpen || (this.animating && this.animationOut)) return
  this.animating = true
  this.animationOut = true
}

ASSETS.Doorway.prototype.close = function () {
  if (!this.isOpen || (this.animating && !this.animationOut)) return
  this.animating = true
  this.animationOut = false

  if (this.animationCount === 0) {
    this.animationCount = 62
  }
}

ASSETS.Doorway.prototype.update = function (t) {
  if (!this.animating) return false

  // Animate each segment radially outward
  var a = this.segmentLength
  for (var i = 0; i < 6; ++i) {
    this.segments[i].position.set(
      Math.sin(i * a) * this.animationStep * this.animationCount,
      -Math.cos(i * a) * this.animationStep * this.animationCount,
      0
    )
  }

  // Done with the frame count is out of bounds
  this.animationCount += this.animationOut ? 1 : -1
  if (this.animationCount < 0 || this.animationCount > 63) {
    this.animationCount = 0
    this.animating = false
    this.colliderMid.passthrough = this.isOpen = this.animationOut
  }

  if (this.resetField) this.resetField.update(t)
}
