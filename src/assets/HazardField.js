/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/Field.js
 *  > A one-sided planar red field that will kill the player when they come
 *    into contact.
 **/

/* global PHASED, PHYSED, THREE */

/* namespace */
var ASSETS = ASSETS || {}

// Colour constants
ASSETS.FIELD_THEME = {
  RED: { colour: new THREE.Vector3(1.0, 0.0, 0.0), intensity: new THREE.Vector3(1.0, 0.5, 0.1), base: new THREE.Vector3(0.2, 0.0, 0.05) },
  BLUE: { colour: new THREE.Vector3(0.0, 0.8, 1.0), intensity: new THREE.Vector3(0.3, 1.0, 1.0), base: new THREE.Vector3(0.0, 0.05, 0.2) },
  MAGENTA: { colour: new THREE.Vector3(1.0, 0.0, 0.3), intensity: new THREE.Vector3(1.0, 0.3, 0.5), base: new THREE.Vector3(0.2, 0.0, 0.1) },
  GREEN: { colour: new THREE.Vector3(0.0, 1.0, 0.3), intensity: new THREE.Vector3(0.3, 1.0, 0.5), base: new THREE.Vector3(0.0, 0.2, 0.05) }
}

ASSETS.HazardField = function (w, h, safeDirection, localDirection, doubleSided, playerCollision, theme) {
  this.t = 0
  this.safe = false
  this.safeDirection = safeDirection
  this.safeTheme = ASSETS.FIELD_THEME.GREEN
  this.theme = theme || (safeDirection ? ASSETS.FIELD_THEME.MAGENTA : ASSETS.FIELD_THEME.RED)

  // Shader
  this.shader = PHASED.assetLoader.get('field', {
    fTime: { type: 'f', value: 0 },
    fCount: { type: 'f', value: 1 },
    vColour: { type: 'v3', value: this.theme.colour },
    vIntensityColour: { type: 'v3', value: this.theme.intensity },
    vBaseColour: { type: 'v3', value: this.theme.base }
  })
  this.shader.opacity = 0.9
  this.shader.transparent = true
  this.shader.blending = THREE.AdditiveBlending
  this.shader.side = THREE.DoubleSide

  // Instantiate mesh
  THREE.Mesh.call(this, new THREE.PlaneGeometry(w, h, 1, 1), this.shader)

  // Create collider
  this.collider = new PHYSED.PlaneCollider(this.position, this.rotation, w, h, true, function () {
    if (playerCollision) playerCollision()

    // Spare player if direction is correct, otherwise death!
    if (!this.safe) {
      PHASED.player.die()
    }
  }.bind(this))

  // Create direction indicator
  if (this.safeDirection) {
    var mat = PHASED.assetLoader.get('directions', localDirection || 'up')
    mat.opacity = 0.9
    mat.transparent = true
    mat.side = THREE.DoubleSide
    mat.blending = THREE.AdditiveBlending
    var dir = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), mat)
    this.add(dir)
    dir.position.set(-0.1, 0, 0)
  }
}

// Extends THREE.Mesh
ASSETS.HazardField.prototype = Object.create(THREE.Mesh.prototype)
ASSETS.HazardField.prototype.constructor = ASSETS.HazardField

ASSETS.HazardField.prototype.updateCollider = function (t) {
  this.collider.update()
}

ASSETS.HazardField.prototype.update = function (t) {
  // Update shader time
  this.t += t
  this.shader.uniforms.fTime.value = this.t
}

ASSETS.HazardField.prototype.updateGravity = function (direction) {
  this.safe = direction.equals(this.safeDirection)

  // Update theme based on safety
  var newTheme = this.safe ? this.safeTheme : this.theme
  this.shader.uniforms.vColour.value = newTheme.colour
  this.shader.uniforms.vIntensityColour.value = newTheme.intensity
  this.shader.uniforms.vBaseColour.value = newTheme.base
}
