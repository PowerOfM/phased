/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/core/Physed.js
 *  > 3D physics engine with support for dynamic rigid-bodies, static bodies,
 *    constraints, and realistic collisions.
 */

// Sources:
// http://www.metanetsoftware.com/technique/tutorialA.html
// http://www.dtecta.com/papers/jgt98convex.pdf
// https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects
// http://www.dtecta.com/papers/gdc2001depth.pdf
// http://steve.hollasch.net/cgindex/geometry/ptintet.html

/* global THREE */
/* eslint-disable one-var, space-infix-ops, padded-blocks */

/* namespace */
var PHYSED = PHYSED || {}

/*!
 * CHAMBER CLASS
 * Author: Mesbah Mowlavi
 *
 * Represents a space where physics occurs.
 **/
PHYSED.Chamber = function () {
  THREE.Object3D.call(this)

  this.bodies = { static: [], dynamic: [] }
  this.terminalVelocity = 50

  this.gm = 30
  this.gn = new THREE.Vector3(0, -1, 0)
  this.g = this.gn.clone().multiplyScalar(this.gm)

  this.enabled = true
}
// Extends THREE.Object3D
PHYSED.Chamber.prototype = Object.create(THREE.Object3D.prototype)
PHYSED.Chamber.prototype.constructor = PHYSED.Chamber

/**
 * Gravity getters and setters.
 */
PHYSED.Chamber.prototype.setGravity = function (direction, magnitude) {
  this.gm = magnitude
  this.gn.copy(direction)
  this.g.copy(direction).multiplyScalar(magnitude)
}
PHYSED.Chamber.prototype.setGravityDirection = function (x, y, z) {
  this.gn.set(x, y, z)
  this.g.copy(this.gn).multiplyScalar(this.gm)
}
PHYSED.Chamber.prototype.setGravityMagnitude = function (magnitude) {
  this.gm = magnitude
  this.g.copy(this.gn).multiplyScalar(magnitude)
}
PHYSED.Chamber.prototype.getGravityDirection = function () {
  return this.gn
}
PHYSED.Chamber.prototype.getGravityMagnitude = function () {
  return this.gm
}

PHYSED.Chamber.prototype.addStaticCollider = function (collider) {
  if (collider instanceof Array) {
    for (var i = 0; i < collider.length; ++i) {
      this.bodies.static.push(collider[i])
    }
  } else {
    this.bodies.static.push(collider)
  }
}

/**
 * Adds a new static body to the chamber, optionally setting the colliders.
 */
PHYSED.Chamber.prototype.addStaticBody = function (mesh, collider) {
  if (mesh.collider) {
    this.bodies.static.push(mesh.collider)
  } else if (mesh.colliders) {
    for (var i = 0; i < mesh.colliders.length; ++i) {
      this.bodies.static.push(mesh.colliders[i])
    }
  } else if (collider) {
    this.bodies.static.push(collider)
  }
  this.add(mesh)
}
/**
 * Adds a new dynamic body to the chamber, optionally setting its sphere collider.
 */
PHYSED.Chamber.prototype.addDynamicBody = function (mesh, collider) {
  if (collider) mesh.collider = collider
  this.bodies.dynamic.push(mesh.collider)
  this.add(mesh)
}

/**
 * Creates a new plane as a static body and adds it to the chamber.
 */
PHYSED.Chamber.prototype.createStaticPlane = function (width, height, position, euler, material) {
  // Create plane
  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material)

  if (euler instanceof THREE.Euler) mesh.rotation.copy(euler)
  else mesh.rotation.set(euler[0], euler[1], euler[2])

  if (position instanceof THREE.Vector3) mesh.position.copy(position)
  else mesh.position.set(position[0], position[1], position[2])

  mesh.updateMatrixWorld()
  mesh.geometry.computeBoundingSphere()
  mesh.geometry.computeBoundingBox()
  this.addStaticBody(
    mesh,
    new PHYSED.PlaneCollider(mesh.position, mesh.rotation, width, height, false)
  )
  return mesh
}

/**
 * Creates a new dynamic sphere and adds it to the chamber.
 */
PHYSED.Chamber.prototype.createDynamicSphere = function (size, material) {
  var mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), material)
  this.addDynamicBody(mesh, new PHYSED.SphereCollider(mesh.position, size, true))
  return mesh
}

/**
 * Performs physics magic.
 */
PHYSED.Chamber.prototype.update = function (t) {
  if (!this.enabled) return

  // Update dynamic bodies
  for (var i = 0; i < this.bodies.dynamic.length; ++i) {
    // Local easy-access vars
    var c = this.bodies.dynamic[i]

    // Gravity
    var v = c.velocity
    v.x += this.g.x * t
    v.y += this.g.y * t
    v.z += this.g.z * t
    v.clampScalar(-this.terminalVelocity, this.terminalVelocity)

    // Force
    var a = c.acceleration
    v.x += a.x * t
    v.y += a.y * t
    v.z += a.z * t

    // Displacement
    var d = c.position
    d.x += v.x * t
    d.y += v.y * t
    d.z += v.z * t

    // Detect collisions
    var collisions = []
    for (var j = 0; j < this.bodies.static.length; ++j) {
      var sb = this.bodies.static[j]

      // Skip disabled colliders
      if (sb.passthrough && !sb.callback) continue

      // Broad collision
      if (sb.broadCollide(c, d)) {

        // Precise collision
        var collision = sb.collide(c, d)
        if (collision) {

          if (!sb.passthrough) {
            // Add normal to collision list
            collisions.push(collision.normal)

            // Adjust dynamic body out of static body
            d.add(collision.correction)
          }

          if (sb.callback) sb.callback()
        }
      }
    }

    // Solve collisions
    if (collisions.length > 0) {
      // Reflecting velocity off combined normal
      var n = new THREE.Vector3(0, 0, 0)
      for (var k = 0; k < collisions.length; ++k) {
        n.add(collisions[k])
      }
      n.normalize()
      v.reflect(n).multiplyScalar(1 - Math.abs(n.dot(v.clone().normalize())))
    }

    // Done!
  }
}
