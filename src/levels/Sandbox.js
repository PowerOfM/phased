/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/levels/Sandbox.js
 *  > Testing room for various components of the physics and game engines.
 **/

/* global THREE, ASSETS, PHASED, PHYSED */

/* namespace */
var LEVELS = LEVELS || {}

LEVELS.Sandbox = {
  load: function () {
    var level = LEVELS.Sandbox

    // Create map
    var map = level.map = new PHYSED.Chamber()
    map.setGravity(new THREE.Vector3(0, -1, 0), 40)

    // Chamber
    map.createStaticPlane(30, 30, [0, 0, 0], [-Math.PI_2, 0, 0], new THREE.MeshNormalMaterial()) // floor
    map.createStaticPlane(30, 30, [0, 20, 0], [Math.PI_2, 0, 0], new THREE.MeshNormalMaterial()) // ceiling
    map.createStaticPlane(20, 30, [15, 10, 0], [-Math.PI_2, -Math.PI_2, 0], new THREE.MeshNormalMaterial()) // left wall
    map.createStaticPlane(20, 30, [-15, 10, 0], [-Math.PI_2, Math.PI_2, 0], new THREE.MeshNormalMaterial()) // right wall
    map.createStaticPlane(30, 20, [0, 10, -15], [0, 0, 0], new THREE.MeshNormalMaterial()) // left wall
    map.createStaticPlane(30, 20, [0, 10, 15], [0, Math.PI, 0], new THREE.MeshNormalMaterial()) // right wall

    // Dynamics
    // var sphere = map.createDynamicSphere(0.5, new THREE.MeshNormalMaterial())
    // sphere.position.y = 10
    // level.sphere = sphere

    // Gravity helper
    level.gdev = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 5, 0), 1, 0xffff00)
    map.add(level.gdev)

    // Random assets
    // map.addStaticBody(new ASSETS.Receptor())
    // map.addStaticBody(new ASSETS.LightPlate())
    // level.hf = new ASSETS.HazardField(20, 20)
    // map.addStaticBody(level.hf)

    // var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
    // box.geometry.computeBoundingBox()
    // box.collider = new PHYSED.AABBCollider(box.geometry.vertices, box.position, box.rotation, box.geometry.boundingBox, false)
    // box.position.y = 0.5
    // map.addStaticBody(box)

    // var doorExit = level.doorExit = new ASSETS.Doorway()
    // doorExit.position.set(0, 2, 0)
    // doorExit.rotation.set(0, Math.PI_2, 0)
    // doorExit.updateCollider()
    // // doorExit.open()
    // map.addStaticBody(doorExit)

    // PHASED.assetLoader.loadCollada('src/resources/phasor.dae', function (model) {
    //   model.scene.rotation.set(-Math.PI_2, 0, 0)
    //   model.scene.scale.set(0.3, 0.3, 0.3)
    //   model.scene.position.set(0, 3, 0)
    //   PHASED.MMC = model
    //   map.add(model.scene)
    // })
    // var pedestal = new ASSETS.Pedestal()
    // map.addStaticBody(pedestal)

    var sp = new ASSETS.Spotlight()
    sp.position.set(0, 0.5, 0)
    map.addStaticBody(sp)

    var pointLight = new THREE.PointLight(0xffffff, 1, 40)
    pointLight.position.set(0, 15, 0)
    map.add(pointLight)

    // Lights
    var ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.2)
    map.add(ambientLight)

    // var doorExit = level.doorExit = new ASSETS.Doorway()
    // doorExit.position.set(0, 2, 0)
    // doorExit.updateColliders()
    // map.addStaticBody(doorExit)

    // Player setup
    PHASED.player.position.set(0, 0, -5)
    map.addDynamicBody(PHASED.player)

    // Start
    PHASED.scene.add(map)
    PHASED.Engine.enable()

    document.addEventListener('keyup', function (e) {
      if (e.keyCode === 37) {
        LEVELS.Sandbox.map.update(0.02)
      } else if (e.keyCode === 69) {
        LEVELS.Sandbox.setGravity(new THREE.Vector3(0, -1, 0), 40)
      } else if (e.keyCode === 81) {
        LEVELS.Sandbox.setGravity(new THREE.Vector3(0, 1, 0), 40)
      } else if (e.keyCode === 90) {
        LEVELS.Sandbox.setGravity(new THREE.Vector3(1, 0, 0), 40)
      } else if (e.keyCode === 88) {
        LEVELS.Sandbox.setGravity(new THREE.Vector3(-1, 0, 0), 40)
      }
    })
  },

  update: function (t) {
    var level = LEVELS.Sandbox

    if (PHASED.keyboard.pressed('r')) {
      level.sphere.position.y = 10
    }

    level.map.update(t)
    // level.doorExit.update(t)
  },

  setGravity: function (direction, magnitude) {
    var level = LEVELS.Sandbox

    level.gdev.setDirection(direction)
    level.map.setGravity(direction, magnitude)
    PHASED.player.updateGravity(direction)
  },

  cleanup: function () {
    // Do nothing
  }
}
