/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/levels/Level1.js
 *  > "Coming to Terms"
 **/

/* global PHASED, PHYSED, ASSETS, UI, VFX, THREE */
/* eslint-disable space-infix-ops */

/* namespace */
var LEVELS = LEVELS || {}

LEVELS.Level1 = {
  load: function () {
    var level = LEVELS.Level1
    level.elements = []
    level.firstRun = true

    function createMaterial (w, h, name, shininess, panelSize, dark) {
      panelSize = panelSize || (name === 'panel1' || name === 'floor' ? 1 : name === 'panel2' ? 4 : 2)
      return new THREE.MeshPhongMaterial({
        color: dark ? 0x15181b : 0xffffff, specular: 0xffffff, shininess: shininess,
        map: PHASED.assetLoader.get(name, 'map', { repeatU: w/panelSize, repeatV: h/panelSize }),
        normalMap: PHASED.assetLoader.get(name, 'normal', { repeatU: w/panelSize, repeatV: h/panelSize }),
        specularMap: PHASED.assetLoader.get(name, 'specular', { repeatU: w/panelSize, repeatV: h/panelSize })
      })
    }

    // Materials
    var corrMat6x20 = createMaterial(6, 20, 'plainwall', 1, 1)
    var corrMat6x6 = createMaterial(6, 6, 'plainwall', 1, 1)
    var floorDMat6x20 = createMaterial(6, 20, 'panel3', 1, 1)
    var floorMat6x20 = createMaterial(6, 20, 'floor', 1)
    var wallMat30x16 = createMaterial(30, 16, 'panel2', 10)
    var wallMat30x4 = createMaterial(30, 4, 'panel1', 10)
    var wallMat16x4 = createMaterial(16, 4, 'panel1', 10)
    var floorMat = createMaterial(30, 30, 'floor', 1)
    var fakeDoorMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 1, map: PHASED.assetLoader.get('fakedoor', 'map') })

    // Create map
    var map = level.map = new PHYSED.Chamber()
    map.setGravity(new THREE.Vector3(0, -1, 0), 30)
    level.elements.push(map)

    // Entrance corridor
    map.createStaticPlane(6, 20, [0, 0, -25], [-Math.PI_2, 0, 0], floorDMat6x20)            // floor
    map.createStaticPlane(6, 20, [0, 6, -25], [Math.PI_2, 0, 0], floorMat6x20)             // ceiling
    map.createStaticPlane(6, 20, [3, 3, -25], [-Math.PI_2, -Math.PI_2, 0], corrMat6x20) // left wall
    map.createStaticPlane(6, 20, [-3, 3, -25], [-Math.PI_2, Math.PI_2, 0], corrMat6x20) // right wall
    map.createStaticPlane(6, 6, [0, 3, -35], [0, 0, 0], corrMat6x6)
    var fakeDoor = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.1), fakeDoorMat)
    fakeDoor.position.set(0, 2.5, -34.95)
    map.add(fakeDoor)

    // Door bounding
    map.createStaticPlane(6, 2, [0, 5, 9.8-25], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [2.80, 3, 9.8-25], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [-2.80, 3, 9.8-25], [0, Math.PI, 0], corrMat6x20)

    // Lighting
    var clp1 = new ASSETS.LightPanel()
    clp1.rotation.set(-Math.PI_2, 0, 0)
    clp1.position.set(0, 5, -15.5)
    map.add(clp1)
    var clp2 = new ASSETS.LightPanel()
    clp2.rotation.set(Math.PI, Math.PI_2, 0)
    clp2.position.set(0, 6, -30)
    map.add(clp2)

    // Entrance door
    var doorEnter = level.doorEnter = new ASSETS.Doorway(
      function () {
        if (level.firstRun) {
          level.firstRun = false
          UI.updateChamber('Press E to<br/>open the door.')
        }
        level.curDoor = doorEnter
      },
      function () {
        level.curDoor = null
        doorEnter.close()
      }
    )
    doorEnter.position.set(0, 2, -15)
    doorEnter.updateCollider()
    map.addStaticBody(doorEnter)
    level.elements.push(doorEnter)

    // Chamber
    map.createStaticPlane(30, 30, [0, 0, 0], [-Math.PI_2, 0, 0], floorMat)                    // floor
    map.createStaticPlane(30, 30, [0, 20, 0], [Math.PI_2, 0, 0], floorMat)                    // ceiling
    map.createStaticPlane(30, 16, [15, 12, 0], [0, -Math.PI_2, 0], wallMat30x16)   // left wall
    map.createStaticPlane(30, 4, [15, 2, 0], [0, -Math.PI_2, 0], wallMat30x4)   // left wall
    map.createStaticPlane(30, 16, [-15, 12, 0], [0, Math.PI_2, 0], wallMat30x16)   // right wall
    map.createStaticPlane(30, 4, [-15, 2, 0], [0, Math.PI_2, 0], wallMat30x4)   // left wall

    // Door walls
    map.createStaticPlane(30, 16, [0, 12, -14.9], [0, 0, 0], wallMat30x16)  // back wall-upper
    map.createStaticPlane(13, 4, [-8.5, 2, -14.9], [0, 0, 0], wallMat16x4) // back wall-left
    map.createStaticPlane(13, 4, [8.5, 2, -14.9], [0, 0, 0], wallMat16x4)  // back wall-left

    map.createStaticPlane(30, 16, [0, 12, 14.9], [0, Math.PI, 0], wallMat30x16)  // front wall-upper
    map.createStaticPlane(13, 4, [-8.5, 2, 14.9], [0, Math.PI, 0], wallMat16x4) // front wall-left
    map.createStaticPlane(13, 4, [8.5, 2, 14.9], [0, Math.PI, 0], wallMat16x4)  // front wall-left

    // Lights
    var lightPlate1 = new ASSETS.LightPlate()
    lightPlate1.rotation.set(0, Math.PI_2, 0)
    lightPlate1.position.set(-15, 10, 0)
    map.add(lightPlate1)
    var lightPlate2 = new ASSETS.LightPlate()
    lightPlate2.rotation.set(0, -Math.PI_2, 0)
    lightPlate2.position.set(15, 10, 0)
    map.add(lightPlate2)
    var lightPlate3 = new ASSETS.LightPlate()
    lightPlate3.position.set(0, 10, -14.9)
    map.add(lightPlate3)
    var lightPlate4 = new ASSETS.LightPlate()
    lightPlate4.rotation.set(0, Math.PI, 0)
    lightPlate4.position.set(0, 10, 14.9)
    map.add(lightPlate4)
    var ambience = new THREE.AmbientLight(0x2c2c2c)
    map.add(ambience)

    // Glass
    var glassBarrier = new ASSETS.GlassBarrier(30, 8)
    glassBarrier.position.set(0, 4, 0)
    map.addStaticBody(glassBarrier)

    // Buttons
    var buttonUp = new ASSETS.Button(function () {
      level.setGravity(new THREE.Vector3(0, 1, 0), 30)
    })
    buttonUp.position.set(0, 0, -3.5)
    map.addStaticBody(buttonUp)

    var buttonDown = new ASSETS.Button(function () {
      level.setGravity(new THREE.Vector3(0, -1, 0), 30)
    })
    buttonDown.rotation.set(Math.PI, 0, 0)
    buttonDown.position.set(0, 20, 3.5)
    map.addStaticBody(buttonDown)

    // Exit door
    var doorExit = new ASSETS.Doorway(
      function () {
        level.curDoor = doorExit
        doorExit.open()
      },
      function () {
        level.curDoor = null
        doorExit.close()
      }
    )
    doorExit.position.set(0, 2, 15)
    doorExit.updateCollider()
    map.addStaticBody(doorExit)
    level.elements.push(doorExit)

    // Exit corridor
    map.createStaticPlane(6, 20, [0, 0, 25], [-Math.PI_2, 0, 0], floorDMat6x20)            // floor
    map.createStaticPlane(6, 20, [0, 6, 25], [Math.PI_2, 0, 0], floorMat6x20)             // ceiling
    map.createStaticPlane(6, 20, [3, 3, 25], [-Math.PI_2, -Math.PI_2, 0], corrMat6x20) // left wall
    map.createStaticPlane(6, 20, [-3, 3, 25], [-Math.PI_2, Math.PI_2, 0], corrMat6x20) // right wall
    map.createStaticPlane(6, 2, [0, 5, 15.1], [0, 0, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [2.80, 3, 15.1], [0, 0, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [-2.80, 3, 15.1], [0, 0, 0], corrMat6x20)
    map.createStaticPlane(6, 2, [0, 5, 35.1], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [2.80, 3, 35.1], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [-2.80, 3, 35.1], [0, Math.PI, 0], corrMat6x20)

    // Load trigger
    var loadTrigger = new PHYSED.AABBCollider(
      null, new THREE.Vector3(0, 3, 25), new THREE.Euler(),
      { min: new THREE.Vector3(-3, -3, -3), max: new THREE.Vector3(3, 3, 3) },
      true, function () {
        UI.showLoader()
        PHASED.Engine.loadLevel(LEVELS.Level2)
      }
    )
    map.addStaticCollider(loadTrigger)

    // Level 2 fake door
    var doorLevel2 = new ASSETS.Doorway()
    doorLevel2.position.set(0, 2, 35)
    map.addStaticBody(doorLevel2)

    // Lighting
    var clp3 = new ASSETS.LightPanel()
    clp3.rotation.set(Math.PI_2, 0, 0)
    clp3.position.set(0, 5, 15.5)
    map.add(clp3)
    var clp4 = new ASSETS.LightPanel()
    clp4.rotation.set(-Math.PI_2, 0, 0)
    clp4.position.set(0, 5, 34.9)
    map.add(clp4)

    // Player setup
    PHASED.player.position.set(0, 0, -25)
    map.addDynamicBody(PHASED.player)

    // Start
    UI.hideLoader()
    PHASED.scene.add(map)
    PHASED.Engine.enable()
  },

  update: function (t) {
    var level = LEVELS.Level1

    if (PHASED.keyboard.pressed('e')) {
      if (level.curDoor && !(level.curDoor.isOpen || level.curDoor.animating)) {
        level.curDoor.open()

        if (level.curDoor === level.doorEnter) {
          UI.flashLevel('CHAMBER 1: COMING TO TERMS')
          UI.updateChamber('CHAMBER 1')
          PHASED.timer.start()
        }
      }
    }

    for (var i = 0; i < level.elements.length; ++i) {
      level.elements[i].update(t)
    }
  },

  setGravity: function (direction, magnitude) {
    var level = LEVELS.Level1

    level.map.setGravity(direction, magnitude)
    PHASED.player.updateGravity(direction)
    UI.updateGravity(direction.x + '' + direction.y + '' + direction.z)
    VFX.GravityShift.show()
  },

  restart: function () {
    LEVELS.Level1.setGravity(new THREE.Vector3(0, -1, 0), 30)
    PHASED.player.position.set(0, 0, -10)
    PHASED.player.enablePhasor(false)
    PHASED.Engine.resume()
  },

  cleanup: function () {
    var level = LEVELS.Level1
    for (var i = level.map.children.length - 1; i >= 0; i--) {
      level.map.remove(level.map.children[i])
    }
    level.map = null
    level.elements = []
    level.doorEnter = null
    level.doorExit = null
  }
}
