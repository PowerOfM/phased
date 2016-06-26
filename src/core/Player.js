/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/core/Player.js
 *  > A DynamicBody and PerspectiveCamera representing the player.
 **/

/* global THREE, PHYSED, UI, VFX */
/* eslint-disable one-var, comma-spacing */

/* namespace */
var PHASED = PHASED || {}

/*!
 * PLAYER CLASS
 * Author: Mesbah Mowlavi
 *
 * Contains the FPS camera and controls, representing the viewpoint of the player.
 **/
PHASED.Player = function () {
  var size = 1.65

  // Compose body mesh
  THREE.Mesh.call(this, new THREE.SphereGeometry(size), new THREE.MeshBasicMaterial({ color: 0x2194ce, wireframe: false }))
  this.position.set(0, size / 2, 0)

  // Collider
  this.collider = new PHYSED.SphereCollider(this.position, size, true)

  // Construct first-person camera
  var camera = this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
  camera.rotation.y += Math.PI
  camera.position.set(0, 4 * size / 5, 0)
  this.add(camera)

  // Controls
  this.enabled = false
  this.sensitivity = 0.001
  this.gaze = { pitch: 0, yaw: Math.PI }
  this.gazeSnap = { pitch: 0, yaw: Math.PI }
  this.gazeBase = new THREE.Euler(0, 0, 0, 'YZX')
  this.gazeEuler = new THREE.Euler(0, 0, 0, 'YZX')
  this.gazeInc = Math.PI_2
  this.speed = 10
  this.accel = new THREE.Vector3(0, 0, 0)

  // Basis
  this.xAxis = new THREE.Vector3(1, 0, 0)
  this.yAxis = new THREE.Vector3(0, 1, 0)
  this.zAxis = new THREE.Vector3(0, 0, 1)
  this.xAccl = 0
  this.yAccl = 0
  this.zAccl = 0

  // Animation
  this.computeGravityRotations()
  this.animating = false
  this.aniQuatA = new THREE.Quaternion()
  this.aniQuatB = new THREE.Quaternion()
  this.aniCount = 0
  this.aniMax = 300 / 16 // 16ms per frame @ 60fps

  // Jumping
  this.jumping = false
  this.jumpForce = 20
  this.jumpCount = 0
  this.jumpDuration = 1000 / 16
  this.jumpPeak = this.jumpDuration / 2

  // Phasor
  this.hasPhasor = false
  var phasor = this.phasor = PHASED.assetLoader.get('phasor')
  phasor.position.set(0.4, -0.65, -0.25)
  phasor.scale.set(1, 1, 1).multiplyScalar(0.1)

  // Mouse binding
  document.addEventListener('mousemove', this.handleMouseLook.bind(this))
  document.addEventListener('mouseup', this.handleMouseUp.bind(this))
}

// Extends THREE.Mesh
PHASED.Player.prototype = Object.create(THREE.Mesh.prototype)
PHASED.Player.prototype.constructor = PHASED.Player

PHASED.Player.prototype.enablePhasor = function (enable) {
  if (this.hasPhasor === this.enable) return

  this.hasPhasor = enable
  if (enable) {
    this.camera.add(this.phasor)
  } else {
    this.camera.remove(this.phasor)
  }
}

PHASED.Player.prototype.updateMovementAxis = function () {
  this.gazeBase.set(0, this.gaze.yaw, 0, 'YZX')

  // Update base gaze quaternion
  this.xAxis.set(-1, 0, 0).applyEuler(this.gazeBase).applyQuaternion(this.aniQuatB).normalize()
  this.zAxis.set(0, 0, -1).applyEuler(this.gazeBase).applyQuaternion(this.aniQuatB).normalize()
}

PHASED.Player.prototype.handleMouseLook = function (e) {
  if (!this.enabled) return

  // Compute angular change
  var g = this.gaze
  g.yaw -= (e.movementX || e.mozMovementX || e.webkitMovementX || 0) * this.sensitivity
  g.pitch -= (e.movementY || e.mozMovementY || e.webkitMovementY || 0) * this.sensitivity

  // Clamp pitch to -pi/2, pi/2 (don't break necks!)
  g.pitch = Math.max(-Math.PI_2, Math.min(g.pitch, Math.PI_2))

  // Update local camera rotation
  this.camera.rotation.set(g.pitch, g.yaw, 0, 'YZX')
  this.updateMovementAxis()
}

PHASED.Player.prototype.handleMouseUp = function (e) {
  // Disable other mouse buttons (no right-click, hehehe)
  if (e.button !== 0) {
    e.preventDefault()
    return
  }

  // Only set gravity with phasor
  if (!this.hasPhasor) return

  // Snap to 90*
  var gs = this.gazeSnap
  gs.pitch = Math.round(this.gaze.pitch / this.gazeInc) * this.gazeInc
  gs.yaw = Math.round(this.gaze.yaw / this.gazeInc) * this.gazeInc
  this.gazeEuler.set(gs.pitch, gs.yaw, 0, 'YZX')

  // Compute rotation vector
  var g = new THREE.Vector3(0, 0, -1).applyEuler(this.gazeEuler).applyQuaternion(this.aniQuatB).normalize()

  // Avoid js crazy floating points (ie: 5.3e-12)
  g.x = Math.round(g.x)
  g.y = Math.round(g.y)
  g.z = Math.round(g.z)

  // Set level gravity
  // TODO: use magnitude setting
  PHASED.level.setGravity(g, 40)
}

PHASED.Player.prototype.updateGravity = function (direction) {
  // I really tried to do this by finding the proper rotation using
  // quaternion.setFromUnitVectors(prevGravity, newGravity)
  // But it just kept being so inconsistent (quaternions are scary)
  // and after making snapped gaze angles for gravity setting,
  // this approach just makes more sense.

  // Rotation animation between the two gravity directions
  this.gravityDirection = direction
  this.aniQuatA.copy(this.quaternion)
  this.aniQuatB.copy(this.alignQuats[direction.x + '' + direction.y + '' + direction.z])
  this.aniCount = 0
  this.animating = true

  // Update axises
  this.yAxis.set(0, 1, 0).applyQuaternion(this.aniQuatB).normalize()
  this.updateMovementAxis()
}

PHASED.Player.prototype.computeGravityRotations = function () {
  var defaultY = new THREE.Vector3(0, -1, 0)
  this.alignQuats = {
    '0-10': new THREE.Quaternion(),
    '010': new THREE.Quaternion().setFromUnitVectors(defaultY, new THREE.Vector3(0, 1, 0)),
    '-100': new THREE.Quaternion().setFromUnitVectors(defaultY, new THREE.Vector3(-1, 0, 0)),
    '100': new THREE.Quaternion().setFromUnitVectors(defaultY, new THREE.Vector3(1, 0, 0)),
    '00-1': new THREE.Quaternion().setFromUnitVectors(defaultY, new THREE.Vector3(0, 0, -1)),
    '001': new THREE.Quaternion().setFromUnitVectors(defaultY, new THREE.Vector3(0, 0, 1))
  }
}

PHASED.Player.prototype.update = function (t) {
  if (!this.enabled) return
  this.xAccl *= 0.3
  this.zAccl *= 0.3

  if (PHASED.keyboard.pressed('w')) this.zAccl += this.speed
  else if (PHASED.keyboard.pressed('s')) this.zAccl -= this.speed

  if (PHASED.keyboard.pressed('a')) this.xAccl += this.speed
  else if (PHASED.keyboard.pressed('d')) this.xAccl -= this.speed

  if (PHASED.keyboard.pressed('space')) {
    if (!this.jumping) {
      this.jumping = true
      this.jumpCount = 0
      this.yAccl = this.jumpForce
    }
  }

  if (this.jumping) {
    this.jumpCount++

    if (this.jumpCount <= this.jumpPeak) {
      this.yAccl = -this.jumpForce * (this.jumpCount / this.jumpPeak) + this.jumpForce
    } else if (this.jumpCount > this.jumpDuration) {
      this.yAccl = 0
      this.jumping = false
    }
  }

  this.position.x += ((this.xAccl * this.xAxis.x) + (this.yAccl * this.yAxis.x) + (this.zAccl * this.zAxis.x)) * t
  this.position.y += ((this.xAccl * this.xAxis.y) + (this.yAccl * this.yAxis.y) + (this.zAccl * this.zAxis.y)) * t
  this.position.z += ((this.xAccl * this.xAxis.z) + (this.yAccl * this.yAxis.z) + (this.zAccl * this.zAxis.z)) * t
  // this.position.add(this.accel)

  // Animation (Spherical Linear Interpolation! - slerrrp)
  if (this.animating) {
    THREE.Quaternion.slerp(this.aniQuatA, this.aniQuatB, this.quaternion, this.aniCount / this.aniMax)

    this.aniCount++
    if (this.aniCount > this.aniMax) {
      this.quaternion.copy(this.aniQuatB)
      this.animating = false
    }
  }
}

PHASED.Player.prototype.die = function () {
  console.log('Game over: player died.')
  PHASED.Engine.pause()
  PHASED.Engine.state = PHASED.STATE.GG
  UI.showGG()
}
