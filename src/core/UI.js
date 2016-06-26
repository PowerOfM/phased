/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/core/UI.js
 *  > Contains the HUD and controls for other 2D gui elements.
 **/

/* global PHASED, LEVELS, performance */

/*!
 * UI STATIC CLASS
 * Author: Mesbah Mowlavi
 *
 * Controls the HTML+CSS-based loading screens and gui
 **/
var UI = {
  setup: function () {
    // Fetch UI elements from DOM
    // HUD
    UI.fps = document.getElementById('fps')
    UI.gravity = document.getElementById('gravity')
    UI.chamber = document.getElementById('chamber')
    UI.time = document.getElementById('time')

    // Overlay
    UI.overlay = document.getElementById('overlay')

    // Level
    UI.level = document.getElementById('level')

    // Loader
    UI.loader = document.getElementById('loader')
    UI.loader.progress = document.getElementById('progress')
    UI.loader.message = document.getElementById('message')

    // GG
    UI.gg = document.getElementById('gg')
    UI.gg.level = document.getElementById('gg-label')
    UI.gg.time = document.getElementById('gg-time')
    UI.gg.restart = document.getElementById('gg-restart')
    UI.gg.lobby = document.getElementById('gg-lobby')
    UI.gg.restart.addEventListener('click', UI.restartLevel)
    UI.gg.lobby.addEventListener('click', UI.returnToLobby)

    // Menu
    UI.menu = document.getElementById('menu')
    UI.menu.resume = document.getElementById('menu-resume')
    UI.menu.restart = document.getElementById('menu-restart')
    UI.menu.lobby = document.getElementById('menu-lobby')
    UI.menu.resume.addEventListener('click', UI.resumeLevel)
    UI.menu.restart.addEventListener('click', UI.restartLevel)
    UI.menu.lobby.addEventListener('click', UI.returnToLobby)

    // Setup FPS
    UI.perf = performance || Date
    UI.fpsTracker = {
      frames: 0,
      prevTime: UI.perf.now()
    }

    // Init visibility variable
    UI.overlay._visible = UI.loader._visible = UI.menu._visible = UI.gg._visible = true

    // Hide everything
    UI.hideGG(true)
    UI.hideMenu(true)
    UI.hideLoader(true)
    setTimeout(function () {
      document.getElementById('uicover').style.display = 'none'
    }, 50)
  },

  // Overlay
  showOverlay: function (opacity, colour) {
    if (UI.overlay._visible) return
    UI.overlay._visible = true

    // Clear opacity delay and hide delay
    clearTimeout(UI.overlay._timeout1)
    clearTimeout(UI.overlay._timeout2)
    UI.overlay.style.display = 'block'
    if (colour) {
      UI.overlay.style.backgroundColor = colour
      setTimeout(function () { UI.overlay.style.opacity = opacity || 1 }, 100)
    } else {
      UI.overlay.style.backgroundColor = 'black'
      UI.overlay.style.opacity = opacity || 1
    }
  },
  hideOverlay: function () {
    if (!UI.overlay._visible) return
    UI.overlay._visible = false

    // Delays needed to prevent overloading current thread after loading or
    // other cpu-heavy event
    UI.overlay._timeout1 = setTimeout(function () {
      UI.overlay.style.opacity = 0
      UI.overlay._timeout2 = setTimeout(function () {
        UI.overlay.style.display = 'none'
      }, 3000)
    }, 100)
  },

  // Loader
  showLoader: function () {
    if (UI.loader._visible) return
    UI.loader._visible = true

    clearTimeout(UI.loader._timeout)
    UI.loader.style.display = 'block'
    UI.showOverlay(1)
    UI.loader.style.opacity = 1
    UI.loader.progress.style.width = '0%'
  },
  hideLoader: function (rapid) {
    if (!UI.loader._visible) return
    UI.loader._visible = false

    UI.hideOverlay()
    UI.loader.progress.style.width = '100%'
    if (rapid) {
      UI.loader.style.opacity = 0
      UI.loader.style.display = 'none'
    } else {
      setTimeout(function () {
        UI.loader.style.opacity = 0
        UI.loader._timeout = setTimeout(function () { UI.loader.style.display = 'none' }, 1000)
      }, 100)
    }
  },
  // Disabled due to performance cost
  // updateLoader: function (progress) {
  //   UI.showLoader()
  //   UI.loader.progress.style.width = progress
  // },
  showError: function (message) {
    clearTimeout(UI.loader._timeout)
    UI.showOverlay(1)
    UI.loader.style.display = 'block'
    UI.loader.className = 'error'
    UI.loader.message.innerHTML = message
  },

  // Level
  flashLevel: function (text) {
    UI.level.style.display = 'block'
    UI.level.style.opacity = 1
    UI.level.innerHTML = text

    setTimeout(function () {
      UI.level.style.opacity = 0
      setTimeout(function () {
        UI.level.style.display = 'none'
      }, 3000)
    }, 5000)
  },

  // Menu
  showMenu: function () {
    if (UI.menu._visible) return
    UI.menu._visible = true

    clearTimeout(UI.menu._timeout)
    UI.menu.style.display = 'block'
    UI.showOverlay(0.7)
    UI.menu.style.opacity = 1
  },
  hideMenu: function (rapid) {
    if (!UI.menu._visible) return
    UI.menu._visible = false

    UI.hideOverlay()
    UI.menu.style.opacity = 0
    UI.menu._timeout = setTimeout(function () {
      UI.menu.style.display = 'none'
    }, rapid ? 0 : 1000)
  },

  // GG
  showGG: function (success) {
    if (UI.gg._visible) return
    UI.gg._visible = true

    PHASED.Engine.state = PHASED.STATE.GG
    PHASED.Immersion.releaseLock()

    clearTimeout(UI.gg._timeout)
    UI.gg.style.display = 'block'

    setTimeout(function () {
      UI.gg.style.opacity = 1
      if (success) {
        UI.gg.className = 'success'
        UI.gg.level.innerHTML = 'CONGRADULATIONS!'
        UI.gg.time.style.display = 'inline-block'
        UI.gg.restart.style.display = 'none'
        UI.gg.time.innerHTML = 'TIME: ' + UI.time.innerHTML
        UI.showOverlay(0.7, '#006600')
      } else {
        UI.gg.className = ''
        UI.gg.level.innerHTML = 'GAME OVER'
        UI.gg.time.style.display = 'none'
        UI.gg.restart.style.display = 'inline-block'
        UI.showOverlay(0.7, '#990024')
      }
    }, 100)
  },
  hideGG: function (rapid) {
    if (!UI.gg._visible) return
    UI.gg._visible = false

    UI.hideOverlay()
    UI.gg.style.opacity = 0
    if (rapid) {
      UI.gg.style.display = 'none'
    } else {
      UI.gg._timeout = setTimeout(function () {
        UI.gg.style.display = 'none'
      }, 2000)
    }
  },

  // Gameplay
  resumeLevel: function () {
    PHASED.Engine.resume()
    UI.hideGG()
    UI.hideMenu()
    PHASED.Immersion.requestLock()
  },
  restartLevel: function () {
    PHASED.Engine.state = PHASED.STATE.PAUSED
    UI.resumeLevel()
    PHASED.level.restart()

    // Timeout to ensure level resumes
    setTimeout(function () { PHASED.Engine.enable() }, 200)
  },
  returnToLobby: function () {
    UI.resumeLevel()
    PHASED.Engine.loadLevel(LEVELS.Level1)
  },

  // HUD
  updateGravity: function (directionString) {
    UI.gravity.style.backgroundImage = 'url("src/resources/hud/g' + directionString + '.png")'
  },
  updateTime: function (time) {
    var hh = Math.floor(time / 3600)
    var mm = Math.floor((time - (hh * 3600)) / 60)
    var ss = Math.floor(time) - (hh * 3600) - (mm * 60)

    if (hh < 10) hh = '0' + hh
    if (mm < 10) mm = '0' + mm
    if (ss < 10) ss = '0' + ss

    UI.time.innerHTML = hh + ':' + mm + ':' + ss
  },
  updateChamber: function (name) {
    UI.chamber.innerHTML = name
  },
  updateFPS: function () {
    var fps = UI.fpsTracker
    var t = UI.perf.now()

    // Increment frames
    fps.frames++

    // Update if 1 second has passed
    if (t - 1000 > fps.prevTime) {
      UI.fps.innerHTML = 'FPS: ' + Math.round(fps.frames / (t - fps.prevTime) * 1000) // frames per (ms * second)

      // Reset values
      fps.frames = 0
      fps.prevTime = t
    }
  }
}
