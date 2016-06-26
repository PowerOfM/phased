_Original project readme_

# Project 4

### Academic Honesty
  By submitting this file, I hereby declare that I worked individually on this assignment and wrote all of the code (with the exceptions noted below). I have listed all external resources (web pages, books) used below. I have listed all people with whom I have had significant discussions about the project below as well.

### What
  PHASED is a Portal-inspired, first-person, puzzle-platformer, where the goal is to get out unscathed from an undeground testing track developed scretly by crazy physicists. The testing chambers they devised experiement with gravity waves, and the power fo their PHASOR, a hand-held gravity wave shifter, that can affect the gravity in a bounded region (such as a testing chamber).

  Using this mechanic, I created a 3-level game that introduces the player to the gravity-shift mechanic, as well as the hazard field. The final level requires some experimentation to figure out exactly what is going on.

  The game has a custom-built physics engine, shaders for hazard fields and the gravity effect, and minor animation (on the doors and the shaders have animation cycles).

### What
  The code is organized into main namespaces: PHASED (for more game content), PHYSED (the physics engine), ASSETS (objects that extend either THREE.Object3D or THREE.Mesh and can be added to the scene), VFX (visual effects), and LEVELS. The starting point of the application is PHASED.Engine (located in the Engine.js file in src/core/). From there, the AssetLoader is instaniated, as well as most other global components, and then the first level is created and loaded onto the scene. All texture, shader and model loading occurs before any 3D components of the engine run. The UI is completely done in HTML+CSS3, and is controlled by the UI static class (located in src/core/UI.js).

  I hope you will find it easy to navigate the code, as most classes are separated into their own files.

### HOW-TO
  The game is fairly straight-forward. The goal in each chamber is to get to the exit door. The game uses FPS-style controls: WASD to move and mouse to look. Please click once on the game when it loads, and accept the Pointer-Capture message. Entrance doors are opened by pressing 'E'. Buttons are interacted with by simply walking on them. When you acquire the Phasor, click with the left-mouse-button to use it.

  Due to a lack of time, directional-hazard fields might be a bit confusing. Just try different gravity directions :)
  
  _Note: PHASED runs best on Chrome._

### SOURCES
  Littered throughout the code are various notes, explaining the sources used. The Three.JS documentation and examples were extremely useful. Besides those, I also used the following:

  - Portal 2 (game by Valve Software)
  - https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
  - http://cpetry.github.io/NormalMap-Online/
  - http://www.html5rocks.com/en/tutorials/pointerlock/intro/
  - https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
  - http://o3d.googlecode.com/svn/trunk/samples/convolution.html
  - http://www.metanetsoftware.com/technique/tutorialA.html
  - http://www.dtecta.com/papers/jgt98convex.pdf
  - https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects
  - http://www.dtecta.com/papers/gdc2001depth.pdf
  - http://steve.hollasch.net/cgindex/geometry/ptintet.html
  - https://www.shadertoy.com/view/MdlXz8
  - https://www.shadertoy.com/view/ltlGDH
  - http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl

