/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/client.ts":
/*!***********************!*\
  !*** ./app/client.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var app_utils_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/canvas */ \"./app/utils/canvas.ts\");\n/* harmony import */ var app_initialize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/initialize */ \"./app/initialize.ts\");\n\n\n(0,app_initialize__WEBPACK_IMPORTED_MODULE_1__.initializeGame)();\nconst state = {\n    horizontal: 400,\n    vertical: 600,\n    isADown: false,\n    isDDown: false,\n    isWDown: false,\n    isSDown: false\n};\nfunction update() {\n    if (state.isADown) {\n        state.horizontal = state.horizontal - 10;\n    }\n    if (state.isDDown) {\n        state.horizontal = state.horizontal + 10;\n    }\n    if (state.isWDown) {\n        state.vertical = state.vertical - 10;\n    }\n    if (state.isSDown) {\n        state.vertical = state.vertical + 10;\n    }\n}\nfunction render(context) {\n    // Draw a black background\n    context.fillStyle = 'black';\n    context.fillRect(0, 0, 800, 800);\n    // Draw character\n    context.beginPath();\n    context.arc(state.horizontal, state.vertical, 20, 0, 2 * Math.PI);\n    context.fillStyle = 'yellow';\n    context.fill();\n}\nfunction renderLoop() {\n    try {\n        window.requestAnimationFrame(renderLoop);\n        render(app_utils_canvas__WEBPACK_IMPORTED_MODULE_0__.mainContext);\n    }\n    catch (e) {\n        console.log(e);\n        debugger;\n    }\n}\nrenderLoop();\nsetInterval(update, 20);\ndocument.addEventListener('keydown', event => {\n    //console.log(event.which)\n    if (event.which === 65) { // A    Change here\n        state.isADown = true;\n    }\n    if (event.which === 68) { // D\n        state.isDDown = true;\n    }\n    if (event.which === 87) { // W\n        state.isWDown = true;\n    }\n    if (event.which === 83) { // S\n        state.isSDown = true;\n    }\n});\ndocument.addEventListener('keyup', event => {\n    if (event.which === 65) { // A    \n        state.isADown = false;\n    }\n    if (event.which === 68) { // D   \n        state.isDDown = false;\n    }\n    if (event.which === 87) { // W   \n        state.isWDown = false;\n    }\n    if (event.which === 83) { // S   \n        state.isSDown = false;\n    }\n});\n\n\n//# sourceURL=webpack://alttp/./app/client.ts?");

/***/ }),

/***/ "./app/initialize.ts":
/*!***************************!*\
  !*** ./app/initialize.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeGame: () => (/* binding */ initializeGame)\n/* harmony export */ });\n/* harmony import */ var app_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/dom */ \"./app/utils/dom.ts\");\n\nfunction initializeGame() {\n    (0,app_utils_dom__WEBPACK_IMPORTED_MODULE_0__.query)('.js-loading').style.display = 'none';\n    (0,app_utils_dom__WEBPACK_IMPORTED_MODULE_0__.query)('.js-gameContent').style.display = '';\n}\n\n\n//# sourceURL=webpack://alttp/./app/initialize.ts?");

/***/ }),

/***/ "./app/utils/canvas.ts":
/*!*****************************!*\
  !*** ./app/utils/canvas.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createCanvas: () => (/* binding */ createCanvas),\n/* harmony export */   createCanvasAndContext: () => (/* binding */ createCanvasAndContext),\n/* harmony export */   drawCanvas: () => (/* binding */ drawCanvas),\n/* harmony export */   mainCanvas: () => (/* binding */ mainCanvas),\n/* harmony export */   mainContext: () => (/* binding */ mainContext),\n/* harmony export */   require2dContext: () => (/* binding */ require2dContext)\n/* harmony export */ });\n/* harmony import */ var app_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/dom */ \"./app/utils/dom.ts\");\n\nconst mainCanvas = (0,app_utils_dom__WEBPACK_IMPORTED_MODULE_0__.query)('.js-mainCanvas');\n// @ts-ignore\nwindow['mainCanvas'] = mainCanvas;\n// mainCanvas.width = mainCanvas.height = 512;\nconst mainContext = require2dContext(mainCanvas);\n// mainContext.imageSmoothingEnabled = false;\n// @ts-ignore\nwindow['mainContext'] = mainContext;\nfunction require2dContext(canvas) {\n    const context = canvas.getContext('2d');\n    if (!context) {\n        throw new Error('Failed to get context');\n    }\n    return context;\n}\nfunction createCanvas(width, height, classes = '') {\n    const canvas = document.createElement('canvas');\n    canvas.className = classes;\n    canvas.width = width;\n    canvas.height = height;\n    return canvas;\n}\nfunction createCanvasAndContext(width, height) {\n    const canvas = createCanvas(width, height);\n    const context = require2dContext(canvas);\n    return [canvas, context];\n}\n/**\n * Safari (and possibly other browsers) will not draw canvases if the source\n * rectangle has any parts outside the dimensions of the actual canvas, so this\n * method takes arbitrary rectangles and then modifies them to only draw the\n * part that overlaps with the canvas.\n */\nfunction drawCanvas(context, canvas, { x, y, w, h }, { x: tx, y: ty, w: tw, h: th }) {\n    if (w > canvas.width - x) {\n        const dx = w - (canvas.width - x);\n        w += dx;\n        tw += dx;\n    }\n    if (h > canvas.height - y) {\n        const dy = h - (canvas.height - y);\n        h += dy;\n        th += dy;\n    }\n    if (x < 0) {\n        tx -= x;\n        tw += x;\n        w += x;\n        x = 0;\n    }\n    if (y < 0) {\n        ty -= y;\n        th += y;\n        h += y;\n        y = 0;\n    }\n    if (w > 0 && h > 0) {\n        context.drawImage(canvas, x, y, w, h, tx, ty, tw, th);\n    }\n}\n\n\n//# sourceURL=webpack://alttp/./app/utils/canvas.ts?");

/***/ }),

/***/ "./app/utils/dom.ts":
/*!**************************!*\
  !*** ./app/utils/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   bodyDiv: () => (/* binding */ bodyDiv),\n/* harmony export */   divider: () => (/* binding */ divider),\n/* harmony export */   findEmptyElement: () => (/* binding */ findEmptyElement),\n/* harmony export */   getClosestElement: () => (/* binding */ getClosestElement),\n/* harmony export */   getDomRectCenter: () => (/* binding */ getDomRectCenter),\n/* harmony export */   getElementIndex: () => (/* binding */ getElementIndex),\n/* harmony export */   handleChildEvent: () => (/* binding */ handleChildEvent),\n/* harmony export */   mainContent: () => (/* binding */ mainContent),\n/* harmony export */   mouseContainer: () => (/* binding */ mouseContainer),\n/* harmony export */   query: () => (/* binding */ query),\n/* harmony export */   queryAll: () => (/* binding */ queryAll),\n/* harmony export */   tag: () => (/* binding */ tag),\n/* harmony export */   tagElement: () => (/* binding */ tagElement),\n/* harmony export */   titleDiv: () => (/* binding */ titleDiv),\n/* harmony export */   toggleElement: () => (/* binding */ toggleElement),\n/* harmony export */   toggleElements: () => (/* binding */ toggleElements)\n/* harmony export */ });\nfunction query(className) {\n    return document.querySelector(className);\n}\nfunction queryAll(className) {\n    return document.querySelectorAll(className);\n}\nconst mouseContainer = query('.js-mouseContainer');\nconst mainContent = query('.js-gameContent');\nfunction tag(type, classes = '', content = '') {\n    return '<' + type + ' class=\"' + classes + '\">' + content + '</' + type + '>';\n}\nfunction tagElement(type, classes = '', content = '') {\n    const element = document.createElement(type);\n    element.className = classes || '';\n    element.innerHTML = '' + (content || '');\n    return element;\n}\nconst divider = tag('div', 'centered medium', tag('div', 'divider'));\nfunction titleDiv(titleMarkup) {\n    return titleMarkup && tag('div', 'title', titleMarkup);\n}\nfunction bodyDiv(bodyMarkup) {\n    return bodyMarkup && tag('div', 'body', bodyMarkup);\n}\n;\nfunction findEmptyElement(elements) {\n    return [...elements].find(element => element.innerHTML === '');\n}\nfunction getDomRectCenter(r) {\n    return [r.x + r.width / 2, r.y + r.height / 2];\n}\nfunction getClosestElement(element, elements, threshold) {\n    let closestElement = null;\n    let closestDistanceSquared = threshold * threshold;\n    const center = getDomRectCenter(element.getBoundingClientRect());\n    elements.forEach(element => {\n        const elementCenter = getDomRectCenter(element.getBoundingClientRect());\n        const d2 = (center[0] - elementCenter[0]) ** 2 + (center[1] - elementCenter[1]) ** 2;\n        if (d2 <= closestDistanceSquared) {\n            closestDistanceSquared = d2;\n            closestElement = element;\n        }\n    });\n    return closestElement;\n}\nfunction toggleElements(elements, show) {\n    elements.forEach(element => toggleElement(element, show));\n}\nfunction toggleElement(element, show) {\n    element.style.display = show ? '' : 'none';\n}\nfunction handleChildEvent(eventType, container, selector, handler) {\n    container.addEventListener(eventType, event => {\n        const element = event.target;\n        const matchedElement = element.closest(selector);\n        if (matchedElement) {\n            return handler(matchedElement, event);\n        }\n    });\n}\nfunction getElementIndex(element) {\n    if (!element.parentElement) {\n        return -1;\n    }\n    return [...element.parentElement.children].indexOf(element);\n}\n\n\n//# sourceURL=webpack://alttp/./app/utils/dom.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app/client.ts");
/******/ 	
/******/ })()
;