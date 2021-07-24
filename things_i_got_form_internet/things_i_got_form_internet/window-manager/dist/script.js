class Window {
  #id = '' // window id
  #el = null // window element
  #header = null // window's header element
  #app = null // window's opened application (body)
  #close = null // window's close button
  #fullscreen = null // window's fullscreen and restore button
  #minimize = null // window's minimize button
  #iconFullscreen = document.createElement('span') // fullscreen button icon
  #iconRestore = document.createElement('span') // restore button icon
  #dragImage = new Image()
  #dragTarget = null
  #dragOffset = { // mouse position offset on the header
    x: 0,
    y: 0
  }
  #bounds = null // getBoundingClientRect - temporary bounding box created during drag start
  #restoreBounds = null // bounding box created to save size and location for window restoration after expansion
  
  constructor (templateId, options = {}) {
    // generate an id for the window
    this.#id = Math.random().toString(36).substring(7)
    this.#dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    
    // get our window template
    const tid = templateId || 'myWin'
    const template = document.querySelector(`#${tid}`)
    
    if (template) {
      // create our window and add it to the document body
      const body = document.querySelector('body')
      const win = (template.content.cloneNode(true)).querySelector('.window')
      this.#el = body.appendChild(win)
      // add id and make it draggable
      this.#el.id = this.id
      this.#el.draggable = true
      // set window size
      if (options?.width) this.#el.style.width = `${parseInt(options.width)}px`
      if (options?.height) this.#el.style.height = `${parseInt(options.height)}px`
      if (options?.x) this.#el.style.left = `${parseInt(options.x)}px`
      if (options?.y) this.#el.style.top = `${parseInt(options.y)}px`
      
      // get app/body
      this.#app = this.#el.querySelector('.body')
      if (options?.app?.view) {
        this.#app.innerHTML = ''
        this.#app.appendChild(options.app.view)
      }
      
      // get header element, title and buttons
      this.#header = this.#el.querySelector('.header')
      if (options?.title) this.#header.querySelector('.title').innerHTML = String(options.title)
      this.#fullscreen = this.#header.querySelector('.buttons > .fullscreen')
      this.#minimize = this.#header.querySelector('.buttons > .minimize')
      this.#close = this.#header.querySelector('.buttons > .close')
      
      // determine which buttons we need
      if (options?.buttons?.minimize === false) {
        this.#header.querySelector('.buttons').removeChild(this.#minimize)
      }
      if (options?.buttons?.fullscreen === false) {
        this.#header.querySelector('.buttons').removeChild(this.#fullscreen)
      } else {
        // fullscreen button icons for swapping between states
        this.#iconFullscreen.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QA/wD/AP+gvaeTAAAAzklEQVQ4jdWTMU6CQRBG3yig1NgoXIXSggNY2FEQDuA5lBPYewIgBDvPQkdv85tHwa5ZzZ+4FcGvmsn7MvMluwPnosiFeg88AR2gAWYRsSv4CHgFLhN/iYj330PWwB74SKa3iPgseB94TEvGwE1ETH5EUrfqvCa+Ole3ub8o2FdKUKOm1asOU+SaJH11WLnw30q9U68qvdfqbRtYqdPKIVN1mfvyibtAr2ZI8n17OwVogLGa679+bNM2ZMHxdh6SYQPsCj5ILN/Wc2XqE+oAPCViMMs54V4AAAAASUVORK5CYII=" width="17" height="17">'
        this.#iconRestore.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QA/wD/AP+gvaeTAAAAoklEQVQ4jc2SwQnCQBRE33rSCgIBz3aQg6ZERe3DNrQHD0FBUoMShOdlA2E1giKYue2b4fP/sDBoqSs1T1iuLj8ZUqtlwkq1fpUffbVq3xB1q1ZqBWRAk2QbIGsz6qY1QmfIFJjF5xU4hBDs+AGYA5OIjiGEyy8uGZj6OrkB+xedLIBxRM+dqJtO83e1SPwi8jazfrvefz9boh1wStg58gHrAZ5zgE3VnSEzAAAAAElFTkSuQmCC" width="17" height="17">'
        this.#fullscreen.appendChild(this.#iconFullscreen)
      }
      if (options?.buttons?.close === false) {
        this.#header.querySelector('.buttons').removeChild(this.#close)
      }

      // add event listeners to the window for dragging
      this.#el.addEventListener('mousedown', this.setTarget.bind(this))
      this.#el.addEventListener('touchstart', this.setTarget.bind(this))
      this.#el.addEventListener('dragstart', this.dragStartHandler.bind(this))
      this.#el.addEventListener('dragover', this.dragOverHandler.bind(this))
      this.#el.addEventListener('touchmove', this.dragOverHandler.bind(this))
      this.#el.addEventListener('dragend', this.dragEndHandler.bind(this))
      this.#el.addEventListener('touchend', this.dragEndHandler.bind(this))
      
      // window button event listeners
      this.#minimize.addEventListener('click', this.minimizeHandler.bind(this))
      this.#close.addEventListener('click', this.closeHandler.bind(this))
      this.#fullscreen.addEventListener('click', this.fullscreenHandler.bind(this))
    } // if(template)
  } // constructor
  
  // Methods ==========================================================//
  
  // Get & Set ........................................................//
  
  get id () {
    return this.#id
  } // get id
  
  get zindex () {
    return this.#el.style.zIndex
  } // get zindex
  
  get title () {
    return this.#header.querySelector('.title').innerHTML
  } // title
  
  set zindex (val = 0) {
     this.#el.style.zIndex = val
  } // set zindex
  
  set title (val = 'Window Title') {
    this.#header.querySelector('.title').innerHTML = val
  } // set title
  
  set visibility (val = 'visible') {
    this.#el.style.visibility = val
  } // set visibility
  
  // Drag Handlers ....................................................//
  
  /**
   * Set Target
   * @description Saves event target during initial mousedown before drag
   * start happens.
   * @param evt Event
   */
  setTarget (evt) {
    this.#dragTarget = evt.target
    this.#bounds = this.#el.getBoundingClientRect()
    this.#dragOffset.x = (evt.type === 'touchstart') ? (evt.touches[0].clientX - this.#bounds.left) : (evt.clientX - this.#bounds.left)
    this.#dragOffset.y = (evt.type === 'touchstart') ? (evt.touches[0].clientY - this.#bounds.top) : (evt.clientY - this.#bounds.top)
    
    // dispatch an event notifying that a window was clicked upon
    const event = new CustomEvent("win-activate", { 'detail': { win: this.#id, z: this.#el.style.zIndex } })
    document.dispatchEvent(event)
  } // setTarget
  
  /**
   * Drag Start Handler
   * @description Handles the drag start event, if we've grabbed the window
   * by the header then allow dragging to occur.
   * @param evt Event
   */
  dragStartHandler (evt) {
    if (this.#header.contains(this.#dragTarget)) {
      evt.dataTransfer.setData('id', this.#id)
      evt.dataTransfer.setDragImage(this.#dragImage, 0 , 0)
      this.#el.classList.add('dragging')
    } else {
      evt.preventDefault()
    }
  } // dragStartHandler
  
  /**
   * Drag Over Handler
   * @description Handles the actual dragging of the element, calls a function
   * to set the window's location based on the mouse coordinates.
   * @param evt Event
   */
  dragOverHandler (evt) {
    let coords = { x: 0, y: 0 }
    if (evt.type === 'touchmove' && (this.#header.contains(this.#dragTarget))) {
      coords = { x: evt.touches[0].clientX, y: evt.touches[0].clientY }
      this.setWindowCoords(coords.x, coords.y)
    } else if (evt.type === 'dragover') {
      coords = { x: evt.clientX, y: evt.clientY }
      this.setWindowCoords(coords.x, coords.y)
    }
  } // dragOverHandler
  
  /**
   * Drag End Handler
   * @description After dragging ends set the window's location and remove the
   * dragging CSS class.
   * @param evt Event
   */
  dragEndHandler (evt) {
    const coords = (evt.type === 'touchend') ? { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY } : { x: evt.clientX, y: evt.clientY }
    this.setWindowCoords(coords.clientX, coords.clientY)
    this.#el.classList.remove('dragging')
    this.#bounds = null
  } // dragEndHandler
  
  /**
   * Set Window Coords
   * @description Sets the window's top left coordinates based on the given X and Y.
   * @param x Number
   * @param y Number
   */
  setWindowCoords (x, y) {
    this.#el.style.left = `${x - this.#dragOffset.x}px`
    this.#el.style.top = `${y - this.#dragOffset.y}px`
  } // setWindowCoords
  
  // Button Handlers ..................................................//
  
  /**
   * Minimize Handler
   * @description Minimizes the window to the "tool bar"
   */
  minimizeHandler (evt) {
    evt.stopPropagation()
    // dispatch an event notifying that a window was clicked upon
    const event = new CustomEvent("win-minimize", { detail: { win: this.#id, z: this.#el.style.zIndex, title: this.#header.querySelector('.title').innerHTML } })
    document.dispatchEvent(event)
  } // minimizeHandler
  
  /**
   * Close Handler
   * @description Removes window from the screen.
   */
  closeHandler (evt) {
    evt.stopPropagation()
    const event = new CustomEvent("win-close", { detail: { win: this.#id }})
    document.dispatchEvent(event)
    this.#el.remove()
  } // closeHandler
  
  /**
   * Fullscreen Handler
   * @descrption Expands or restores the window's size and location based on its state.
   */
  fullscreenHandler (evt) {
    evt.stopPropagation()
    if (this.#fullscreen.contains(this.#iconFullscreen)) {
      // swap icon
      this.#fullscreen.removeChild(this.#iconFullscreen)
      this.#fullscreen.appendChild(this.#iconRestore)
      
      this.#restoreBounds = this.#el.getBoundingClientRect()
      // expand window to fill screen
      this.#el.style.top = '0px'
      this.#el.style.left = '0px'
      this.#el.style.width = '100%'
      this.#el.style.height = `${window.innerHeight}px`
    } else {
      // swap icon
      this.#fullscreen.removeChild(this.#iconRestore)
      this.#fullscreen.appendChild(this.#iconFullscreen)
      // restore window to its original state
      this.#el.style.top = `${this.#restoreBounds.top}px`
      this.#el.style.left = `${this.#restoreBounds.left}px`
      this.#el.style.width = `${this.#restoreBounds.width}px`
      this.#el.style.height = `${this.#restoreBounds.height}px`
    }
  } // fullscreenHandler
  
} // Window

class Browser {
  #id = ''
  #el = null
  #url = 'www.buffalo.edu'
  #address = null
  #working = null
  #addressBar = null
  #webview = null
  
  constructor (options) {
    this.#id = Math.random().toString(36).substring(7)
    this.#el = document.createElement('div')
    this.#el.classList.add('browser')
   
    this.#addressBar = document.createElement('div')
    this.#addressBar.classList.add('address-bar')
    
    this.#address = document.createElement('input')
    this.#address.type = 'text'
    this.#address.value = this.#url
    this.#address.addEventListener('keyup', (evt) => {
      if (evt.which === 13) { // enter
        this.#url = this.#address.value
        this.#webview.src = `https://${this.#url}`
        this.#working.classList.add('loading')
      }
    })
    this.#addressBar.appendChild(this.#address)
    
    this.#working = new Image()
    this.#working.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABJklEQVRIidWVwUrDQBRFjy2C/2D/Qyh1raF1764/IipS/J+gSKkJlkI/oIuu/ICCpYK66ibtYiY4GWcyL8aCvXA3M5d7X9688OCfoAekwKdmos/+BPfAxsNBXfNeiXnObp2AVBDwXCfgwzJrAx3rbFFm0AgEHDj09tmhsFgnEsIteiozCH3BVFDErE6ABL/2OALmhFv0qrWV0AJigXnOGDiWGEfAI7D2GLnGNOcaeADOfOa3QBaotAOcBjQZcGWbX1Roh5TnZsDLDgKGZsCXdXkiaIWtt9/mHb5n2P79m1Sb76amiYKnpEUZMAYmhIdhA4zMgNAjZ8Cloe8LAgqPDGo7+cTXjrbclehvHHpAbacUtQeWqGUS+cT6bgSsgDfU5PyofL+xBZ+I3deeaDj8AAAAAElFTkSuQmCC"
    this.#working.width = 24
    this.#working.height = 24
    this.#working.classList.add('working')
    // this.#working.classList.add('loading')
    this.#addressBar.appendChild(this.#working)
    
    this.#webview = document.createElement('iframe')
    this.#webview.src = `https://${this.#url}`
    
    this.#el.appendChild(this.#addressBar)
    this.#el.appendChild(this.#webview)
  } // constructor
  
  // Methods =========================================================//
  
  // Get & Set -------------------------------------------------------//
  
  get view () { return this.#el }
  
  // Life Cycle ------------------------------------------------------//
  
  started () {
    this.onLoad()
    this.onUnload()
  } // started
  
  onLoad () {
    this.#webview.addEventListener('load', () => {
      this.#working.classList.remove('loading')
    })
  } // 
  
  attachUnload () {
    this.#webview.contentWindow.removeEventListener('unload', this.onUnload)
    this.#webview.contentWindow.addEventListener('unload', this.onUnload.bind(this))
  } // attachUnload
  
  onUnload () {
    setTimeout(this.chkWebView.bind(this), 0)
  } // onUnload
  
  chkWebView () {
    console.log(this.#webview.contentWindow.location.href)
  }
} // Browser

class WM {
  #id = ''
  #el = null // window manager root element
  #apps = null  // predefined applications section on toolbar
  #dock = null  // docking area for minimized open applications
  #windows = [] // array of open window objects
  
  // default settings for application icons
  #icons = {  
    w: 24,
    h: 24
  }
  // default settings for window creation
  #settings = {
    title: 'Window',
    width: 400,
    height: 400,
    x: 20,
    y: 20,
    app: null
  }
  #template = 'myWin' // window template
  #zStart = 20
  
  constructor (options) {
    // grab references to elements we'll need to interact with
    if (options?.id) {
      this.#id = options.id
      this.#el = document.querySelector(`#${this.#id}`)
      this.#apps = this.#el.querySelector('.apps')
      this.#dock = this.#el.querySelector('.dock')
    }
    
    // add predefined applications
    if (options?.apps && Array.isArray(options.apps)) {
      // add each predefined application
      /*
        {
          icon: ''
          app: ''
          run: () => {}
        }
      */
      options.apps.forEach(app => {
        const icon = document.createElement('img')
        icon.src = app.icon
        icon.width = this.#icons.w
        icon.height = this.#icons.h
        icon.addEventListener('click', () => { this.spawn(app) })
        this.#apps.appendChild(icon)
      })
    }
    
    // event listeners
    
    document.addEventListener('win-activate', this.makeWindowActive.bind(this))
    document.addEventListener('win-minimize', this.minimizeWindow.bind(this))
    document.addEventListener('win-close', this.closeWindow.bind(this))
  } // constructor
  
  // Methods =========================================================//
  
  /**
   * Add
   * @description Adds a window to the window manager
   */
  add (win) {
    if (win.constructor.name === 'Window') {
      win.zindex = (this.#zStart + this.#windows.length)
      this.#windows.push(win)
    }
  } // add
  
  // calls an application's start up function when its icon is clicked
  spawn (app) {
    const application = app.run() // start up the application
    // window settings
    const options = { ...this.#settings }
    options.app = application
    options.title = app.app
    // create window
    this.add(new Window(this.#template, options))
    application?.started()
  } // spawn
  
  // Event Handlers 
  makeWindowActive (evt) { // evt.detail.win, evt.detail.z
    if (evt.detail.z !== (this.#zStart + this.#windows.length)) {
      this.#windows.forEach(win => {
        const oldZ = win.zindex
        const newZ = (this.#zStart + this.#windows.length)
        if (win.id === evt.detail.win) {
          win.zindex = (this.#zStart + this.#windows.length)
        }
        win.zindex = (win.id === evt.detail.win) ? newZ : (win.zindex > evt.detail.z) ? (win.zindex - 1) : win.zindex
      })
    }
  } // makeWindowActive
  
  minimizeWindow (evt) { // evt.detail.win, evt.detail.z, evt.detail.title
    // add window to the dock
    let item = document.createElement('div')
    let winId = document.createAttribute('data-win-id')
    winId.value = evt.detail.win
    item.setAttributeNode(winId)
    item.classList.add('item')
    let title = document.createTextNode((evt.detail.title) ? evt.detail.title : evt.detail.win)
    let titleContainer = document.createElement('div')
    titleContainer.classList.add('title')
    titleContainer.appendChild(title)
    item.appendChild(titleContainer)
    this.#dock.appendChild(item)
    
    // hide the actual window
    this.#windows.forEach(win => {
      if (win.id === evt.detail.win) {
        win.visibility = 'hidden'
      }
    }) // forEach
    
    // add eventListener to docked item
    item.addEventListener('click', this.maximizeWindow.bind(this))
  } // minimizeWindow
  
  maximizeWindow (evt) {
    evt.stopPropagation()
    let winId = evt.currentTarget.getAttribute('data-win-id')
    this.#dock.removeChild(evt.currentTarget)
    
    // open window
    this.#windows.forEach(win => {
      if (win.id === winId) {
        win.visibility = 'visible'
        // dispatch an event notifying that a window is reopened and active
        const event = new CustomEvent("win-activate", { 'detail': { win: win.id, z: win.zindex } })
        document.dispatchEvent(event)
      }
    })
  } // maximizeWindow
  
  closeWindow (evt) {
    let winIndex = null
    for (let i = 0, cnt = this.#windows.length; i < cnt; i++) {
      if (this.#windows[i].id === evt.detail.win) {
        winIndex = i
        break
      }
    }
    let removed = (this.#windows.splice(winIndex, 1))[0]
    removed = null
  } // closeWindow
} // WM

(() => {
  const wm = new WM({ id: 'wm', apps: [{ icon: 'data:image/png;base64,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', app: 'Browser', run: () => {
    return new Browser()
  }}] })
  
  wm.add(new Window())
  wm.add(new Window('myWin', { title: 'Test Window', buttons: { fullscreen: false, minimize: false }, width: 250, height: 400, x: 100, y: 100 }))
})()