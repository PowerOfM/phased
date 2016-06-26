/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/levels/Level3.js
 *  > "Directional Difficulties"
 **/

/* global PHASED, PHYSED, ASSETS, UI, VFX, THREE */
/* eslint-disable space-infix-ops */

/* namespace */
var LEVELS = LEVELS || {}

LEVELS.Level3 = {
  load: function () {
    var level = LEVELS.Level3
    level.elements = []
    level.hazards = []
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
    var corrMat6x40 = createMaterial(6, 40, 'plainwall', 1, 1)
    var floorDMat6x40 = createMaterial(6, 40, 'panel3', 1, 1)
    var floorMat6x40 = createMaterial(6, 40, 'floor', 1)
    var wallMat50x21 = createMaterial(50, 21, 'panel1', 5)
    var wallMat50x25 = createMaterial(50, 25, 'panel1', 5)
    var wallMat120x50 = createMaterial(120, 50, 'panel2', 5)
    var wallMat24x4 = createMaterial(24, 4, 'panel2', 5)
    var floorMat50x120 = createMaterial(50, 120, 'floor', 1)
    var floorMatD50x120 = createMaterial(50, 120, 'panel3', 1)

    // Light helpers
    function addLightPlate (x, y, z, rotX, rotY, rotZ, colour, intensity, distance) {
      var lightPlate = new ASSETS.LightPlate()
      lightPlate.position.set(x, y, z)
      lightPlate.rotation.set(rotX || 0, rotY || 0, rotZ || 0)
      map.add(lightPlate)
    }
    function addLightPanel (x, y, z, rotX, rotY, rotZ, distance, colour, intensity) {
      var lightPanel = new ASSETS.LightPanel(distance, colour, intensity)
      lightPanel.position.set(x, y, z)
      lightPanel.rotation.set(rotX || 0, rotY || 0, rotZ || 0)
      map.add(lightPanel)
    }

    // Create map
    var map = level.map = new PHYSED.Chamber()
    map.setGravity(new THREE.Vector3(0, -1, 0), 30)
    level.elements.push(map)

    // Level1 exit door
    var doorLevel1 = new ASSETS.Doorway()
    doorLevel1.position.set(0, 2, -100)
    map.addStaticBody(doorLevel1)

    // Entrance corridor
    map.createStaticPlane(6, 40, [0, 0, -80], [-Math.PI_2, 0, 0], floorDMat6x40)            // floor
    map.createStaticPlane(6, 40, [0, 6, -80], [Math.PI_2, 0, 0], floorMat6x40)             // ceiling
    map.createStaticPlane(6, 40, [3, 3, -80], [-Math.PI_2, -Math.PI_2, 0], corrMat6x40) // left wall
    map.createStaticPlane(6, 40, [-3, 3, -80], [-Math.PI_2, Math.PI_2, 0], corrMat6x40) // right wall
    map.createStaticPlane(6, 2, [0, 5, -60.2], [0, Math.PI, 0], corrMat6x40)
    map.createStaticPlane(1, 6, [2.80, 3, -60.2], [0, Math.PI, 0], corrMat6x40)
    map.createStaticPlane(1, 6, [-2.80, 3, -60.2], [0, Math.PI, 0], corrMat6x40)
    map.createStaticPlane(6, 2, [0, 5, -100], [0, 0, 0], corrMat6x40)
    map.createStaticPlane(1, 6, [2.80, 3, -100], [0, 0, 0], corrMat6x40)
    map.createStaticPlane(1, 6, [-2.80, 3, -100], [0, 0, 0], corrMat6x40)

    // Intro dir-hazard
    var dh1 = new ASSETS.HazardField(6, 6, new THREE.Vector3(0, 1, 0), 'up')
    dh1.position.set(0, 3, -80)
    map.addStaticBody(dh1)
    level.hazards.push(dh1)

    // Lighting
    addLightPanel(0, 5, -60.2, -Math.PI_2, 0, 0)
    addLightPanel(0, 5, -100, Math.PI_2, 0, 0)

    // Entrance door
    var doorEnter = level.doorEnter = new ASSETS.Doorway(function () { level.curDoor = doorEnter }, function () { level.curDoor = null; doorEnter.close() })
    doorEnter.position.set(0, 2, -60.1)
    doorEnter.updateCollider()
    level.elements.push(doorEnter)
    map.addStaticBody(doorEnter)

    // Entrace platform
    var platformFaces = { sides: createMaterial(4, 2, 'panel3', 5, 2), top: createMaterial(6, 4, 'panel3', 5, 2), front: createMaterial(6, 2, 'panel3', 5, 2) }
    var platformMat = new THREE.MeshFaceMaterial([
      platformFaces.sides, platformFaces.sides, platformFaces.top, platformFaces.top, platformFaces.front, platformFaces.front
    ])
    var enterPlat = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 4), platformMat)
    enterPlat.position.set(0, -1, -58)
    enterPlat.geometry.computeBoundingBox()
    enterPlat.collider = new PHYSED.AABBCollider(enterPlat.geometry.vertices, enterPlat.position, enterPlat.rotation, enterPlat.geometry.boundingBox)
    map.addStaticBody(enterPlat)

    // Chamber
    map.createStaticPlane(50, 120, [0, -25, 0], [-Math.PI_2, 0, 0], floorMatD50x120)  // floor
    map.createStaticPlane(50, 120, [0, 25, 0], [Math.PI_2, 0, 0], floorMat50x120)  // ceiling
    map.createStaticPlane(120, 50, [25, 0, 0], [0, -Math.PI_2, 0], wallMat120x50)   // left wall
    map.createStaticPlane(120, 50, [-25, 0, 0], [0, Math.PI_2, 0], wallMat120x50)   // right wall

    // Door walls
    map.createStaticPlane(50, 21, [0, 21/2+4, -60], [0, 0, 0], wallMat50x21)  // back wall-upper
    map.createStaticPlane(22, 4, [-14, 2, -60], [0, 0, 0], wallMat24x4) // back wall-left
    map.createStaticPlane(22, 4, [14, 2, -60], [0, 0, 0], wallMat24x4)  // back wall-left
    map.createStaticPlane(50, 25, [0, -25/2, -60], [0, 0, 0], wallMat50x25)  // back wall-lower

    map.createStaticPlane(50, 21, [0, 21/2+4, 60], [0, Math.PI, 0], wallMat50x21)  // back wall-upper
    map.createStaticPlane(22, 4, [-14, 2, 60], [0, Math.PI, 0], wallMat24x4) // back wall-left
    map.createStaticPlane(22, 4, [14, 2, 60], [0, Math.PI, 0], wallMat24x4)  // back wall-left
    map.createStaticPlane(50, 25, [0, -25/2, 60], [0, Math.PI, 0], wallMat50x25)  // back wall-lower

    // Hazards
    function addHazard (w, h, x, y, z, dir, localdir) {
      var dh = new ASSETS.HazardField(w, h, dir, localdir, true)
      dh.position.set(x, y, z)
      map.addStaticBody(dh)
      level.hazards.push(dh)
    }
    addHazard(50, 50, 0, 0, -40, new THREE.Vector3(0, -1, 0), 'down')
    addHazard(50, 50, 0, 0, -25, new THREE.Vector3(1, 0, 0), 'left')
    addHazard(50, 50, 0, 0, 25, new THREE.Vector3(0, 0, 1), 'out')
    addHazard(25, 50, -25/2, 0, 40, new THREE.Vector3(-1, 0, 0), 'right')
    addHazard(25, 50, 25/2, 0, 40, new THREE.Vector3(0, -1, 0), 'down')

    // Lights
    addLightPlate(-25, 0, 30, 0, Math.PI_2, 0, 0xffffff, 1, 20)
    addLightPlate(-25, 0, 0, 0, Math.PI_2, 0, 0xffffff, 1, 20)
    addLightPlate(-25, 0, -30, 0, Math.PI_2, 0, 0xffffff, 1, 20)
    addLightPlate(25, 0, 30, 0, -Math.PI_2, 0, 0xffffff, 1, 20)
    addLightPlate(25, 0, 0, 0, -Math.PI_2, 0, 0xffffff, 1, 20)
    addLightPlate(25, 0, -30, 0, -Math.PI_2, 0, 0xffffff, 1, 20)
    var ambience = new THREE.AmbientLight(0x2c2c2c)
    map.add(ambience)

    // Exit door
    var doorExit = level.doorExit = new ASSETS.Doorway(function () { level.curDoor = doorExit }, function () {
      UI.showGG(true)
    })
    doorExit.rotation.set(0, Math.PI, 0)
    doorExit.position.set(0, 2, 60.1)
    doorExit.updateCollider()
    level.elements.push(doorExit)
    map.addStaticBody(doorExit)
    var exitPlat = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 4), platformMat)
    exitPlat.position.set(0, -1, 58)
    exitPlat.geometry.computeBoundingBox()
    exitPlat.collider = new PHYSED.AABBCollider(exitPlat.geometry.vertices, exitPlat.position, exitPlat.rotation, exitPlat.geometry.boundingBox)
    map.addStaticBody(exitPlat)

    // Player setup
    PHASED.player.position.set(0, 0, -95)
    PHASED.player.enablePhasor(true)
    map.addDynamicBody(PHASED.player)

    // Start
    UI.hideLoader()
    PHASED.scene.add(map)
    PHASED.Engine.enable()
  },

  update: function (t) {
    var level = LEVELS.Level3

    if (PHASED.keyboard.pressed('e')) {
      if (level.curDoor && !(level.curDoor.isOpen || level.curDoor.animating)) {
        level.curDoor.open()

        if (level.curDoor === level.doorEnter) {
          UI.flashLevel('CHAMBER 3: DIRECTIONAL DIFFICULTIES')
          UI.updateChamber('CHAMBER 3')
        }
      }
    }

    for (var i = 0; i < level.elements.length; ++i) {
      level.elements[i].update(t)
    }
  },

  setGravity: function (direction, magnitude) {
    var level = LEVELS.Level3

    level.map.setGravity(direction, magnitude)
    PHASED.player.updateGravity(direction)
    UI.updateGravity(direction.x + '' + direction.y + '' + direction.z)
    VFX.GravityShift.show()

    for (var i = 0; i < level.hazards.length; ++i) {
      level.hazards[i].updateGravity(direction)
    }
  },

  restart: function () {
    LEVELS.Level3.setGravity(new THREE.Vector3(0, -1, 0), 30)
    PHASED.player.position.set(0, 0, -95)
    PHASED.player.enablePhasor(true)
    PHASED.Engine.resume()
  },

  cleanup: function () {
    var level = LEVELS.Level3
    for (var i = level.map.children.length - 1; i >= 0; i--) {
      level.map.remove(level.map.children[i])
    }
    level.map = null
    level.elements = []
    level.doorEnter = null
    level.doorExit = null
  }
}
