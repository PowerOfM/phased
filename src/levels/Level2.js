/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/levels/Level2.js
 *  > "Mind the Red"
 **/

/* global PHASED, PHYSED, ASSETS, UI, VFX, THREE */
/* eslint-disable space-infix-ops */

/* namespace */
var LEVELS = LEVELS || {}

LEVELS.Level2 = {
  load: function () {
    var level = LEVELS.Level2
    level.elements = []

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
    var floorDMat6x20 = createMaterial(6, 20, 'panel3', 1, 1)
    var corrMat6x20 = createMaterial(6, 20, 'plainwall', 1, 1)
    var wallMat30x32 = createMaterial(30, 32, 'panel2', 5)
    var wallMat30x28 = createMaterial(30, 28, 'panel2', 5)
    var wallMat30x12 = createMaterial(30, 12, 'panel2', 5)
    var wallMat30x8 = createMaterial(30, 8, 'panel2', 5)
    var wallMat30x4 = createMaterial(30, 4, 'panel2', 5)
    var wallMat14x12 = createMaterial(14, 12, 'panel1', 5, 2)
    var wallMat8x12 = createMaterial(8, 12, 'panel2', 5)
    var wallMat12x4 = createMaterial(12, 4, 'panel2', 5)
    var wallMat12x12 = createMaterial(12, 12, 'panel3', 5, 2)
    var floorMat = createMaterial(30, 30, 'floor', 1)
    var floorMat30x14 = createMaterial(30, 14, 'floor', 1)
    var floorMat12x14 = createMaterial(12, 14, 'floor', 1)
    var floorMat43x30 = createMaterial(43, 30, 'floor', 1)
    var floorMat43x32 = createMaterial(43, 32, 'floor', 1)
    var floorMat6x20 = createMaterial(6, 20, 'floor', 1)

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

    // Level1 exit door
    var doorLevel1 = new ASSETS.Doorway()
    doorLevel1.position.set(0, 2, -35)
    map.addStaticBody(doorLevel1)

    // Entrance corridor
    map.createStaticPlane(6, 20, [0, 0, -25], [-Math.PI_2, 0, 0], floorDMat6x20)            // floor
    map.createStaticPlane(6, 20, [0, 6, -25], [Math.PI_2, 0, 0], floorMat6x20)             // ceiling
    map.createStaticPlane(6, 20, [3, 3, -25], [-Math.PI_2, -Math.PI_2, 0], corrMat6x20) // left wall
    map.createStaticPlane(6, 20, [-3, 3, -25], [-Math.PI_2, Math.PI_2, 0], corrMat6x20) // right wall
    map.createStaticPlane(6, 2, [0, 5, -15.2], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [2.80, 3, -15.2], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [-2.80, 3, -15.2], [0, Math.PI, 0], corrMat6x20)
    map.createStaticPlane(6, 2, [0, 5, -35.1], [0, 0, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [2.80, 3, -35.1], [0, 0, 0], corrMat6x20)
    map.createStaticPlane(1, 6, [-2.80, 3, -35.1], [0, 0, 0], corrMat6x20)

    // Lighting
    addLightPanel(0, 5, -15.5, -Math.PI_2, 0, 0)
    addLightPanel(0, 5, -34.9, Math.PI_2, 0, 0)

    // Entrance door
    var doorEnter = level.doorEnter = new ASSETS.Doorway(function () { level.curDoor = doorEnter }, function () { level.curDoor = null; doorEnter.close() })
    doorEnter.position.set(0, 2, -15.1)
    doorEnter.updateCollider()
    level.elements.push(doorEnter)
    map.addStaticBody(doorEnter)

    // Main floor & ceiling
    map.createStaticPlane(30, 30, [0, 0, 0], [-Math.PI_2, 0, 0], floorMat)
    map.createStaticPlane(30, 30, [0, 32, 0], [Math.PI_2, 0, 0], floorMat)

    // Back wall (entrace door-way)
    map.createStaticPlane(30, 28, [0, 18, -15], [0, 0, 0], wallMat30x28) // back
    map.createStaticPlane(12, 4, [-9, 2, -15], [0, 0, 0], wallMat12x4) // back wall-left
    map.createStaticPlane(12, 4, [9, 2, -15], [0, 0, 0], wallMat12x4)  // back wall-right

    // Left wall (flat)
    map.createStaticPlane(30, 32, [15, 16, 0], [0, -Math.PI_2, 0], wallMat30x32) // left

    // Front wall (phaser in cavity)
    map.createStaticPlane(30, 12, [0, 6, 15], [0, Math.PI, 0], wallMat30x12) // lower
    map.createStaticPlane(30, 8, [0, 28, 15], [0, Math.PI, 0], wallMat30x8) // upper
    map.createStaticPlane(30, 12, [0, 18, 29], [0, Math.PI, 0], wallMat30x12) // inner-front
    map.createStaticPlane(14, 12, [15, 18, 22], [0, -Math.PI_2, 0], wallMat14x12) // inner-left
    map.createStaticPlane(14, 12, [-15, 18, 22], [0, Math.PI_2, 0], wallMat14x12) // inner-right
    map.createStaticPlane(30, 14, [0, 24, 22], [Math.PI_2, 0, 0], floorMat30x14) // ceiling
    map.createStaticPlane(30, 14, [0, 12, 22], [-Math.PI_2, 0, 0], floorMat30x14) // floor

    // Pedestal
    var pedestal = level.pedestal = new ASSETS.Pedestal(function () {
      PHASED.player.enablePhasor(true)
      pedestal.setPhasor(false)
    })
    pedestal.position.set(0, 12, 20)
    pedestal.rotation.set(0, -Math.PI_2, 0)
    map.addStaticBody(pedestal)

    // Pedestal spotlight
    var pSpot = new ASSETS.Spotlight(0xffffcc, 1.5, 25, Math.PI / 4)
    pSpot.position.set(0, 23.5, 15.5)
    pSpot.rotation.set(Math.PI_2, Math.PI_2, 0)
    map.addStaticBody(pSpot)

    // Cavity lighting
    var pLight1 = new THREE.PointLight(0xffffff, 0.5, 30)
    pLight1.position.set(0, 26, 24)
    map.add(pLight1)
    addLightPanel(15, 18, 18, 0, 0, Math.PI_2, 10)
    addLightPanel(-15, 18, 18, 0, 0, -Math.PI_2, 10)

    // Cavity hazard
    var hazard0 = new ASSETS.HazardField(30, 12)
    hazard0.rotation.set(Math.PI_2, 0, 0)
    hazard0.position.set(0, 23, 22)
    hazard0.updateCollider()
    map.addStaticBody(hazard0)
    level.elements.push(hazard0)

    // Right wall (passage)
    map.createStaticPlane(30, 12, [-15, 6, 0], [0, Math.PI_2, 0], wallMat30x12) // lower
    map.createStaticPlane(30, 8, [-15, 28, 0], [0, Math.PI_2, 0], wallMat30x8) // upper
    map.createStaticPlane(8, 12, [-15, 18, -11], [0, Math.PI_2, 0], wallMat8x12) // left
    map.createStaticPlane(8, 12, [-15, 18, 11], [0, Math.PI_2, 0], wallMat8x12) // right

    // Main lighting
    addLightPlate(-15, 10, 0, 0, Math.PI_2, 0)
    addLightPlate(15, 10, 0, 0, -Math.PI_2, 0)
    addLightPlate(0, 10, -15)
    addLightPlate(0, 10, 15, 0, Math.PI, 0)

    // Passage
    map.createStaticPlane(12, 14, [-21, 24, 0], [Math.PI_2, 0, 0], floorMat12x14) // inner-floor
    map.createStaticPlane(12, 14, [-21, 12, 0], [-Math.PI_2, 0, 0], floorMat12x14) // inner-ceiling
    map.createStaticPlane(12, 12, [-21, 18, 7], [0, Math.PI, 0, 0], wallMat12x12) // inner-left
    map.createStaticPlane(12, 12, [-21, 18, -7], [0, 0, 0, 0], wallMat12x12) // inner-right

    // Passage lighting
    addLightPanel(-20, 18, 7, Math.PI_2, Math.PI_2, Math.PI, 10)
    addLightPanel(-20, 18, -7, Math.PI_2, Math.PI_2, 0, 10)

    // Passage Back wall (behind 'Right wall')
    map.createStaticPlane(30, 12, [-27, 6, 0], [0, -Math.PI_2, 0], wallMat30x12) // lower
    map.createStaticPlane(30, 8, [-27, 28, 0], [0, -Math.PI_2, 0], wallMat30x8) // upper
    map.createStaticPlane(8, 12, [-27, 18, -11], [0, -Math.PI_2, 0], wallMat8x12) // left
    map.createStaticPlane(8, 12, [-27, 18, 11], [0, -Math.PI_2, 0], wallMat8x12) // right

    // Room 30x32x43
    map.createStaticPlane(43, 30, [-48.5, 0, 0], [-Math.PI_2, 0, 0], floorMat43x30) // floor
    map.createStaticPlane(43, 30, [-48.5, 32, 0], [Math.PI_2, 0, 0], floorMat43x30) // ceiling
    map.createStaticPlane(43, 32, [-48.5, 16, 15], [0, Math.PI, 0], floorMat43x32) // left wall
    map.createStaticPlane(43, 32, [-48.5, 16, -15], [0, 0, 0], floorMat43x32) // right wall

    // Room front wall (door)
    map.createStaticPlane(30, 28, [-70, 22, 0], [0, Math.PI_2, 0], wallMat30x28) // front lower
    map.createStaticPlane(30, 4, [-70, 2, 0], [0, Math.PI_2, 0], wallMat30x4) // front upper
    map.createStaticPlane(12, 4, [-70, 6, -9], [0, Math.PI_2, 0], wallMat12x4) // front left
    map.createStaticPlane(12, 4, [-70, 6, 9], [0, Math.PI_2, 0], wallMat12x4) // front left

    // Room lighting
    addLightPlate(-36.5, 16, 15, 0, Math.PI, 0, 0xffccff, 0.8, 30)
    addLightPlate(-36.5, 16, -15, 0, 0, 0, 0xffccff, 0.8, 30)
    addLightPlate(-60.5, 16, 15, 0, Math.PI, 0, 0xffccff, 0.8, 30)
    addLightPlate(-60.5, 16, -15, 0, 0, 0, 0xffccff, 0.8, 30)

    // Room hazards
    var hazard1 = new ASSETS.HazardField(43, 30)
    hazard1.rotation.set(-Math.PI_2, 0, 0)
    hazard1.position.set(-48.5, 2, 0)
    hazard1.updateCollider()
    map.addStaticBody(hazard1)
    level.elements.push(hazard1)

    var hazard2 = new ASSETS.HazardField(43, 30)
    hazard2.rotation.set(Math.PI_2, 0, 0)
    hazard2.position.set(-48.5, 30, 0)
    hazard2.updateCollider()
    map.addStaticBody(hazard2)
    level.elements.push(hazard2)

    // Room glass panels
    var glassMid = new ASSETS.GlassBarrier(30, 15)
    glassMid.rotation.set(0, Math.PI_2, 0)
    glassMid.position.set(-45, 16, 0)
    glassMid.updateCollider()
    map.addStaticBody(glassMid)

    var glassLeft = new ASSETS.GlassBarrier(26, 10)
    glassLeft.position.set(-58, 16, 10)
    glassLeft.rotation.set(Math.PI_2, Math.PI_2, 0)
    glassLeft.updateCollider()
    map.addStaticBody(glassLeft)

    var glassRight = new ASSETS.GlassBarrier(26, 10)
    glassRight.position.set(-62, 16, -10)
    glassRight.rotation.set(Math.PI_2, Math.PI_2, 0)
    glassRight.updateCollider()
    map.addStaticBody(glassRight)

    // Exit door
    var doorExit = level.doorExit = new ASSETS.Doorway(function () { level.curDoor = doorExit }, function () {
      level.curDoor = null
      doorExit.close()
      UI.showLoader()
      PHASED.Engine.loadLevel(LEVELS.Level3)
    }, true)
    doorExit.position.set(-70.1, 6, 0)
    doorExit.rotation.set(0, -Math.PI_2, 0)
    doorExit.updateCollider()
    map.addStaticBody(doorExit)
    level.elements.push(doorExit)

    // Exit platform
    var exitPlatFaces = { sides: createMaterial(6, 4, 'panel3', 5, 2), top: createMaterial(4, 6, 'panel3', 5, 2), front: createMaterial(4, 2, 'panel3', 5, 2) }
    var exitPlat = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 6), new THREE.MeshFaceMaterial([
      exitPlatFaces.sides, exitPlatFaces.sides, exitPlatFaces.top, exitPlatFaces.top, exitPlatFaces.front, exitPlatFaces.front
    ]))
    exitPlat.position.set(-68, 3, 0)
    exitPlat.geometry.computeBoundingBox()
    exitPlat.collider = new PHYSED.AABBCollider(exitPlat.geometry.vertices, exitPlat.position, exitPlat.rotation, exitPlat.geometry.boundingBox)
    map.addStaticBody(exitPlat)

    // Buttons
    var buttonUp = new ASSETS.Button(function () {
      level.setGravity(new THREE.Vector3(0, 1, 0), 30)
    })
    buttonUp.position.set(0, 0, 1)
    map.addStaticBody(buttonUp)

    var buttonDown = new ASSETS.Button(function () {
      level.setGravity(new THREE.Vector3(0, -1, 0), 30)
    })
    buttonDown.rotation.set(Math.PI, 0, 0)
    buttonDown.position.set(0, 32, 1)
    map.addStaticBody(buttonDown)

    // Player setup
    PHASED.player.position.set(0, 0, -20)
    map.addDynamicBody(PHASED.player)

    // Start
    UI.hideLoader()
    PHASED.scene.add(map)
    PHASED.Engine.enable()
  },

  update: function (t) {
    var level = LEVELS.Level2

    if (PHASED.keyboard.pressed('e')) {
      if (level.curDoor && !(level.curDoor.isOpen || level.curDoor.animating)) {
        level.curDoor.open()

        if (level.curDoor === level.doorEnter) {
          UI.flashLevel('CHAMBER 2: MIND THE RED')
          UI.updateChamber('CHAMBER 2')
        }
      }
    }

    for (var i = 0; i < level.elements.length; ++i) {
      level.elements[i].update(t)
    }
    level.map.update(t)
  },

  setGravity: function (direction, magnitude) {
    var level = LEVELS.Level2

    level.map.setGravity(direction, magnitude)
    PHASED.player.updateGravity(direction)
    UI.updateGravity(direction.x + '' + direction.y + '' + direction.z)
    VFX.GravityShift.show()
  },

  restart: function () {
    LEVELS.Level2.setGravity(new THREE.Vector3(0, -1, 0), 30)
    LEVELS.Level2.pedestal.setPhasor(true)
    PHASED.player.enablePhasor(false)
    PHASED.player.position.set(0, 0, -20)
    PHASED.Engine.resume()
  },

  cleanup: function () {
    var level = LEVELS.Level2
    for (var i = level.map.children.length - 1; i >= 0; i--) {
      level.map.remove(level.map.children[i])
    }
    level.map = null
    level.elements = []
    level.doorEnter = null
    level.doorExit = null
    level.pedestal = null
  }
}
