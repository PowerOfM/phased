/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/physics/Colliders.js
 *  > Mesh colliders for the physics engine.
 */

/* global THREE */
/* eslint-disable one-var, no-redeclare */

/* namespace */
var PHYSED = PHYSED || {}

/**
 * Global broad-collision algorithm.
 */
PHYSED.broadCollide = function (p1, r1, p2, r2) {
  // Compare sum of radi to center distance
  var dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z
  var d = (dx * dx + dy * dy + dz * dz)
  var r = (r1 + r2) * (r1 + r2)

  return d <= r
}

/*!
 * PLANE COLLIDER CLASS
 * Author: Mesbah Mowlavi
 *
 * Single-Faced Plane Collider (note: boundingBox must be in world coords).
 **/
PHYSED.PlaneCollider = function (position, rotation, width, height, passthrough, callback) {
  this.type = 'Plane'
  this.passthrough = passthrough
  this.callback = callback
  this.position = position
  this.rotation = rotation
  this.update(width, height)
}
PHYSED.PlaneCollider.prototype = {
  constructor: PHYSED.PlaneCollider,

  update: function (width, height) {
    if (width) this.halfW = width / 2
    if (height) this.halfH = height / 2
    this.radius = Math.max(this.halfW, this.halfH) * 2

    this.rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(this.rotation)
    this.rotationMatrixI = new THREE.Matrix4().getInverse(this.rotationMatrix)
    this.normal = new THREE.Vector3(0, 0, 1).applyMatrix4(this.rotationMatrix)
  },

  broadCollide: function (collider, displacement) {
    return PHYSED.broadCollide(this.position, this.radius, displacement, collider.radius)
  },

  collide: function (collider, displacement) {
    // Convert sphere's center to local axis-aligned coords
    var center = displacement.clone().sub(this.position).applyMatrix4(this.rotationMatrixI)

    // Check bounds
    if (center.x > this.halfW || center.x < -this.halfW) return false
    if (center.y > this.halfH || center.y < -this.halfH) return false

    // Check if on the right side of the plane
    if (center.z < -1) return false
    //   return {
    //     normal: this.normal,
    //     correction: this.normal.clone().multiplyScalar(collider.radius)
    //   }
    // }

    // Within collision distance
    if (center.z < collider.radius) {
      return {
        normal: this.normal,
        correction: this.normal.clone().multiplyScalar(collider.radius - center.z)
      }
    }
    return false
  }
}

/*!
 * AABB COLLIDER CLASS
 * Author: Mesbah Mowlavi
 *
 * Axis-Aligned Bounding Box Collider (note: boundingBox must be world coords).
 **/
PHYSED.AABBCollider = function (vertices, position, rotation, bb, passthrough, callback) {
  this.type = 'AABB'
  this.passthrough = passthrough
  this.callback = callback
  this.vertices = vertices
  this.position = position
  this.rotation = rotation
  this.bb = bb
  this.update(bb)
}
PHYSED.AABBCollider.prototype = {
  constructor: PHYSED.AABBCollider,

  update: function (bb, position, rotation, quaternion) {
    // Optionally update parameters
    this.position = position || this.position
    this.rotation = rotation || this.rotation
    this.bb = bb || this.bb

    // Compute the dimensions of the bounding box
    var w = (this.bb.max.x - this.bb.min.x)
    var h = (this.bb.max.y - this.bb.min.y)
    var d = (this.bb.max.z - this.bb.min.z)
    this.halfW = w / 2
    this.halfH = h / 2
    this.halfD = d / 2
    this.radius = Math.max(w, h, d)

    var q = quaternion || new THREE.Quaternion().setFromEuler(this.rotation)
    this.qi = q.clone().inverse()

    // Surface normals
    this.xyP = new THREE.Vector3(0, 0, 1).applyQuaternion(q)
    this.xyN = new THREE.Vector3(0, 0, -1).applyQuaternion(q)
    this.xzP = new THREE.Vector3(0, 1, 0).applyQuaternion(q)
    this.xzN = new THREE.Vector3(0, -1, 0).applyQuaternion(q)
    this.yzP = new THREE.Vector3(1, 0, 0).applyQuaternion(q)
    this.yzN = new THREE.Vector3(-1, 0, 0).applyQuaternion(q)

    // Approximate edge normals
    if (this.vertices) {
      this.vertNormals = []
      for (var i = 0; i < this.vertices.length; ++i) {
        this.vertNormals.push(this.vertices[i].clone().applyQuaternion(q))
      }
    }
  },

  broadCollide: function (collider, displacement) {
    return PHYSED.broadCollide(this.position, this.radius, displacement, collider.radius)
  },

  collide: function (collider, displacement) {
    // Convert sphere's center to local axis-aligned coords
    var center = displacement.clone().sub(this.position).applyQuaternion(this.qi)

    // Determine if sphere's center is algined to a surface
    var withinX = (center.x > -this.halfW && center.x < this.halfW)
    var withinY = (center.y > -this.halfH && center.y < this.halfH)
    // XY
    if (withinX && withinY) {
      if ((center.z - collider.radius) < this.halfD && (center.z + collider.radius > -this.halfD)) {
        var n = (center.z < 0 ? this.xyN : this.xyP)
        var diff = this.halfD - Math.abs(center.z) + collider.radius
        return {
          normal: n,
          correction: n.clone().multiplyScalar(Math.abs(diff))
        }
      }
      return false
    }

    var withinZ = (center.z > -this.halfD && center.z < this.halfD)
    // XZ
    if (withinX && withinZ) {
      if ((center.y - collider.radius) < this.halfH && (center.y + collider.radius > -this.halfH)) {
        var n = (center.y < 0 ? this.xzN : this.xzP)
        var diff = this.halfH - Math.abs(center.y) + collider.radius
        return {
          normal: n,
          correction: n.clone().multiplyScalar(diff)
        }
      }
      return false
    }

    // YZ
    if (withinY && withinZ) {
      if ((center.x - collider.radius) < this.halfW && (center.x + collider.radius > -this.halfW)) {
        var n = (center.x < 0 ? this.yzN : this.yzP)
        var diff = this.halfW - Math.abs(center.x) + collider.radius
        return {
          normal: n,
          correction: n.clone().multiplyScalar(diff)
        }
      }
      return false
    }

    // No contact to face was found, now for the edges
    // for (var i = 0; i < this.vertices.length; ++i) {
    //   var d = this.vertices[i].distanceToSquared(center)
    //   if (d < collider.radius2) {
    //     return {
    //       normal: this.vertNormals[i],
    //       correction: this.vertNormals[i].clone().multiplyScalar(collider.radius - Math.sqrt(d))
    //     }
    //   }
    // }
    return false
  }
}

/*!
 * SPHERE COLLIDER CLASS
 * Author: Mesbah Mowlavi
 *
 * Spherical Collider. Dynamic bodies can only have this type of collider.
 **/
PHYSED.SphereCollider = function (position, radius, enabled, callback) {
  this.type = 'Sphere'
  this.position = position
  this.acceleration = new THREE.Vector3(0, 0, 0)
  this.velocity = new THREE.Vector3(0, 0, 0)
  this.enabled = enabled
  this.callback = callback

  this.update(radius)
}
PHYSED.SphereCollider.prototype = {
  constructor: PHYSED.SphereCollider,

  update: function (radius) {
    this.radius = radius
    this.radius2 = radius * radius
  }
}
