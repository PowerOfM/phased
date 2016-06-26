/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/controls/Immersion.js
 *  > Cross-browser fullscreen and Pointer Lock API setup and management.
 **/

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

/* global UI */

/* namespace */
var PHASED = PHASED || {}

/*!
 * IMMERSION STATIC CLASS
 * Author: Mesbah Mowlavi
 *
 * Cross-browser implementation of pointer-lock and fullscreen requests.
 **/
PHASED.Immersion = {
  setup: function () {
    // Check support
    if (!PHASED.Immersion.checkSupport()) {
      UI.showError('This browser does not have pointer-lock support. Please upgrade to Firefox or Chrome.')
      return
    }

    // TODO: Request for fullscreen before pointer lock

    // Change game state on pointer-lock state change
    function plChange (e) {
      if (PHASED.Engine.state === PHASED.STATE.RUNNING || PHASED.Engine.state === PHASED.STATE.PUASED) {
        if (PHASED.Immersion.isLocked()) {
          // Success!
          console.log('Pointer-lock enabled.')
          PHASED.Engine.resume()
        } else {
          // Failed
          console.log('Pointer-lock disabled.')
          PHASED.Engine.pause()
          UI.showMenu()
        }
      }
    }

    // Only console notify (pressing 'no' will throw this error)
    function plError () {
      console.error('Pointer-lock acquision failed.')
    }

    // Listen to various events
    document.addEventListener('pointerlockchange', plChange, false)
    document.addEventListener('mozpointerlockchange', plChange, false)
    document.addEventListener('webkitpointerlockchange', plChange, false)
    document.addEventListener('pointerlockerror', plError, false)
    document.addEventListener('mozpointerlockerror', plError, false)
    document.addEventListener('webkitpointerlockerror', plError, false)

    PHASED.canvas.addEventListener('click', function () {
      if (PHASED.Engine.state === PHASED.STATE.RUNNING) {
        PHASED.Immersion.requestLock()
      }
    })
  },

  /**
   * Returns true if the browser supports pointer-lock
   */
  checkSupport: function () {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
  },

  /**
   * Returns true if the pointer lock has been acquired.
   */
  isLocked: function () {
    var canvas = PHASED.canvas
    return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas
  },

  /**
   * Request for pointer-lock using vendor prefix.
   */
  requestLock: function () {
    var canvas = PHASED.canvas
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock
    canvas.requestPointerLock()
  },

  /**
   * Returns true if the pointer lock has been acquired.
   */
  releaseLock: function () {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock
    document.exitPointerLock()
  }
}
