/**
 * PHASED.JS
 * Copyright (c) 2016 Mesbah Mowlavi (m@ionx.ca)
 * Created for Project 4 of CPSC 314 (spring 2016).
 *
 * src/assets/AssetLoader.js
 *  > Batch-loads assets and provides progress updates
 **/

/* global THREE, UI */

/* namespace */
var ASSETS = ASSETS || {}

/*!
 * ASSET LOADER CLASS
 * Author: Mesbah Mowlavi
 *
 * Extends THREE.LoadingManager
 * Controls the css-based loading screen, displaying the current loading
 * progress there.
 **/
ASSETS.AssetLoader = function (preloadCallback) {
  THREE.LoadingManager.call(this)

  // Resource holders
  this.textures = {}
  this.shaders = {}
  this.models = {}

  // Status
  this.errorOccured = false

  // Adjust loading screen based on events
  this.onLoad = function () {
    UI.hideLoader()
  }
  this.onError = function (item) {
    this.errorOccured = item
    console.error('Error loading item', item)
    UI.showError('An asset error occured. Please check connectivity/permissions, reload the page, and try again.')
  }

  // >> Showing loading progress is not feasible without multi-threading
  // this.progress = {}
  // this.onStart = function (item, itemsLoaded, itemsTotal) {
  //   this.progress[item] = 0
  // }
  // this.onProgress = function (item, itemsLoaded, itemsTotal) {
  //   this.progress[item] = 1

  //   var progSum = 0
  //   for (var p in this.progress) {
  //     progSum += this.progress[p]
  //   }
  //   progSum = Math.round(progSum / itemsTotal * 100)
  //   UI.loader.percent = progSum
  // }
  // this.onItemProgress = function (item, amountLoaded, amountTotal) {
  //   this.progress[item] = amountLoaded / amountTotal
  // }

  // Preload elements
  console.log('Starting to preload game elements.')
  UI.showLoader()
  this.preload(preloadCallback)
}

// Extends THREE.LoadingManager
ASSETS.AssetLoader.prototype = Object.create(THREE.LoadingManager.prototype)
ASSETS.AssetLoader.prototype.constructor = ASSETS.AssetLoader

/**
 * Loads a texture from a url.
 */
ASSETS.AssetLoader.prototype.loadTexture = function (url, callback) {
  var loader = new THREE.TextureLoader(this)
  loader.setCrossOrigin(this.crossOrigin)
  return loader.load(url, callback)
}

/**
 * Loads a collada model from a url.
 */
ASSETS.AssetLoader.prototype.loadCollada = function (url, callback) {
  this.itemStart(url)

  var loader = new THREE.ColladaLoader()
  loader.load(url, function (model) {
    this.itemEnd(url)
    callback(model)
  }.bind(this))
}

/**
 * Loads a obj model from a url.
 */
ASSETS.AssetLoader.prototype.loadOBJ = function (url, callback) {
  var loader = new THREE.OBJLoader(this)
  return loader.load(url, callback)
}

/**
 * Loads a json object model from a url.
 */
ASSETS.AssetLoader.prototype.loadObject = function (url, callback) {
  var loader = new THREE.ObjectLoader(this)
  return loader.load(url, callback)
}

/**
 * Loads a batch of textures. The third parameter is an array of objects with
 * the properties 'name' and 'url'. The callback function will be returned with
 * a map of names to textures.
 */
ASSETS.AssetLoader.prototype.loadTextures = function (directory, suffix, names, callback) {
  var textures = {}
  var count = 0
  for (var nn in names) { count += names[nn].length }
  console.log('Batch loading ' + count + ' textures...')

  for (var name in names) {
    textures[name] = {}

    for (var i = 0; i < names[name].length; ++i) {
      var type = names[name][i]
      var url = directory + name + '/' + type + suffix

      textures[name][type] = this.loadTexture(url, function (texture) {
        if (--count === 0) {
          console.log('Batch texture loading complete.')
          callback(textures)
        }
      })
    }
  }
}
ASSETS.AssetLoader.prototype.loadShader = function (url, callback) {
  var loader = new THREE.XHRLoader(this)
  return loader.load(url, callback)
}

/**
 * Loads a batch of shaders in the provided directory. The second parameter is
 * a string array of the different names. A vertex shader and fragment shader
 * for each name will be loaded.
 */
ASSETS.AssetLoader.prototype.loadShaders = function (directory, names, callback) {
  var scope = this
  var results = {}
  console.log('Batch loading ' + names.length + ' shaders...')

  var recurse = function (fs, i) {
    if (i === names.length) {
      console.log('Batch shader loading complete.')
      return callback(results)
    }

    var type = fs ? 'fs' : 'vs'
    var url = directory + names[i] + '.' + type
    scope.loadShader(url, function (data) {
      if (!results[names[i]]) results[names[i]] = {}

      results[names[i]][type] = data
      recurse(!fs, fs ? i : i + 1)
    })
  }

  recurse(true, 0)
}

/**
 * Loads all assets used by the game.
 */
ASSETS.AssetLoader.prototype.preload = function (callback) {
  var count = 3

  function done () {
    // Trigger callback when everything is finished
    if (--count === 0) callback(this.errorOccured)
  }

  // Textures
  this.loadTextures('src/resources/', '.png', {
    glassbarrier: ['map'],
    lightpanel: ['map', 'normal'],
    glassplate: ['map', 'normal', 'specular'],
    floor: ['map', 'normal', 'specular'],
    panel1: ['map', 'normal', 'specular'],
    panel2: ['map', 'normal', 'specular'],
    panel3: ['map', 'normal', 'specular'],
    plainwall: ['map', 'normal'],
    concrete: ['map'],
    metal: ['map'],
    fakedoor: ['map'],
    dots: ['map', 'normal'],
    directions: ['up', 'down', 'left', 'right', 'in', 'out']
  }, function (textures) {
    // Save textures to object
    this.textures = textures
    done()
  }.bind(this))

  // Shaders
  this.loadShaders('src/shaders/', [
    'additive', 'field', 'phased'
  ], function (shaders) {
    // Save shaders to object
    this.shaders = shaders
    done()
  }.bind(this))

  this.loadObject('src/resources/phasor/model.json', function (model) {
    this.models.phasor = model
    done()
  }.bind(this))
}

/**
 * Fetches a pre-loaded resource.
 *  > For Textures: get(name, type, options)
 *  > For Shaders: get(name, uniforms, options)
 */
ASSETS.AssetLoader.prototype.get = function (name, type, options) {
  if (this.textures[name]) {
    if (!this.textures[name][type]) {
      console.error('Failed to find ' + type + ' for texture ' + name + '.')
      return null
    }

    var t = this.textures[name][type].clone()
    t.needsUpdate = true
    t.wrapS = (options ? (options.wrapS || options.wrap) : null) || THREE.RepeatWrapping
    t.wrapT = (options ? (options.wrapT || options.wrap) : null) || THREE.RepeatWrapping

    if (options && options.repeatU && options.repeatV) {
      t.repeat.set(options.repeatU, options.repeatV)
    }

    t.anisotropy = (options ? options.anisotropy : null) || 4
    return t
  }

  if (this.shaders[name]) {
    if (options && options.raw) {
      return this.shaders[name][options.raw]
    }
    return new THREE.ShaderMaterial({
      uniforms: type,
      vertexShader: this.shaders[name].vs,
      fragmentShader: this.shaders[name].fs
    })
  }

  if (this.models[name]) {
    return this.models[name].clone()
  }

  console.error('Failed to find resource ' + name + '.')
  return null
}
