/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/core/Engine.js
 *  > Main file that contains the Engine static class
 **/

/* global ASSETS, LEVELS, VFX, THREE, THREEx, UI, requestAnimationFrame */

/* namespace */
var PHASED = PHASED || {}

/*!
 * STATE ENUM
 * Author: Mesbah Mowlavi
 *
 * Defines the states of the system
 **/
PHASED.STATE = { 'LOADING': 0, 'RUNNING': 1, 'PAUSED': 2, 'GG': 3, 'ERROR': 4 }

/*!
 * ENGINE STATIC CLASS
 * Author: Mesbah Mowlavi
 *
 * Contains the logic to setup the renderer, scene and other framework functions,
 * and execute the rendering loop.
 **/
PHASED.Engine = {
  state: PHASED.STATE.LOADING,

  /**
   * Preloads assets.
   */
  setup: function () {
    // Extensions
    Math.PI_2 = Math.PI / 2

    // Interface with DOM
    UI.setup()

    // Load assets
    PHASED.assetLoader = new ASSETS.AssetLoader(function (err) {
      if (err) return console.error(err)

      console.log('Done preloading textures')
      PHASED.Engine.init()
    })
  },

  /**
   * Initializes the canvas and other framework components.
   */
  init: function () {
    // Expose canvas to global namespace
    var canvas = PHASED.canvas = document.getElementById('canvas')

    // Renderer (expose to global namespace, but also using 'var' for local alias)
    var renderer = PHASED.renderer = new THREE.WebGLRenderer()
    renderer.gammaInput = true
    renderer.physicallyBasedShading = true
    canvas.appendChild(renderer.domElement)

    // Scene
    var scene = PHASED.scene = new THREE.Scene()

    // Controls and camera
    PHASED.clock = new THREE.Clock(false)
    PHASED.timer = new THREE.Clock(false)
    PHASED.keyboard = new THREEx.KeyboardState()
    PHASED.player = new PHASED.Player()
    var camera = PHASED.camera = PHASED.player.camera

    // https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
    var composer = PHASED.composer = new THREE.EffectComposer(renderer)
    composer.addPass(new THREE.RenderPass(scene, camera))

    var fxaaPass = PHASED.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader)
    composer.addPass(fxaaPass)
    fxaaPass.renderToScreen = true

    VFX.GravityShift.init()
    var gravityShiftPass = new THREE.ShaderPass(VFX.GravityShift.shader) //, 'tBase')
    composer.addPass(gravityShiftPass)
    gravityShiftPass.renderToScreen = true

    // Adjust on resize or scroll
    window.onscroll = function () { window.scrollTo(0, 0) }
    window.addEventListener('resize', PHASED.Engine.resize)
    PHASED.Engine.resize()
    PHASED.Immersion.setup()

    console.log('Reached setup end')
    PHASED.Engine.loadLevel(LEVELS.Level1)
  },

  /**
   * Resizes the renderer and camera based on the current winow size.
   */
  resize: function () {
    PHASED.renderer.setSize(window.innerWidth, window.innerHeight)
    PHASED.composer.setSize(window.innerWidth, window.innerHeight)

    PHASED.fxaaPass.uniforms.resolution.value.x = 1 / window.innerWidth
    PHASED.fxaaPass.uniforms.resolution.value.y = 1 / window.innerHeight

    PHASED.camera.aspect = window.innerWidth / window.innerHeight
    PHASED.camera.updateProjectionMatrix()
  },

  /**
   * Resumes the engine after loading.
   */
  enable: function () {
    PHASED.Engine.resume()
  },

  /**
   * Stops the engine.
   */
  disable: function () {
    PHASED.Engine.state = PHASED.STATE.LOADING
    PHASED.Engine.pause()
  },

  /**
   * Pauses the engine.
   */
  pause: function () {
    // Only update state if previously was running
    if (PHASED.Engine.state === PHASED.STATE.RUNNING) {
      PHASED.Engine.state = PHASED.STATE.PAUSED
    }

    PHASED.clock.stop()
    PHASED.timer.resume = PHASED.timer.running
    PHASED.timer.stop()

    PHASED.player.enabled = false
    console.log('Engine paused')
  },

  /**
   * Resumes the engine after a pause.
   */
  resume: function () {
    // Prevent multiple resume calls
    if (PHASED.Engine.state === PHASED.STATE.RUNNING) return
    PHASED.Engine.state = PHASED.STATE.RUNNING

    PHASED.clock.start()
    if (PHASED.timer.resume) PHASED.timer.start()
    PHASED.player.enabled = true

    PHASED.Engine.run()
    console.log('Engine resumed')
  },

  /**
   * Unload the current level, and sets and loads a new one.
   */
  loadLevel: function (level) {
    PHASED.Engine.disable()

    if (PHASED.level) {
      PHASED.scene.remove(PHASED.level.map)
      PHASED.level.cleanup()
    }

    PHASED.level = level
    level.load()
    // PHASED.Engine.enable() is called when level.load() completes
  },

  /**
   * Executes the update/rendering loop
   */
  run: function () {
    if (PHASED.Engine.state !== PHASED.STATE.RUNNING) return

    // Sync with physics timer
    var delta = PHASED.clock.getDelta()

    // Avoid messing up during lag spikes
    if (delta > 0.02) delta = 0.016 // ms

    // Game mechanics
    PHASED.level.update(delta)
    PHASED.player.update(delta)

    // UI
    if (PHASED.timer.running) {
      UI.updateTime(PHASED.timer.getElapsedTime())
    }

    // Render
    VFX.GravityShift.update(delta)
    PHASED.composer.render(delta)

    // FPS counter
    UI.updateFPS()

    // Next loop
    requestAnimationFrame(PHASED.Engine.run)
  }
}

// Application entry point
window.addEventListener('load', function () {
  PHASED.Engine.setup()
})
