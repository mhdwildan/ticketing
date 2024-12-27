"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./api/build-client.js":
/*!*****************************!*\
  !*** ./api/build-client.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (({ req  })=>{\n    if (true) {\n        // We are on the server\n        return axios__WEBPACK_IMPORTED_MODULE_0___default().create({\n            baseURL: \"https://ingress-nginx-controller.ingress-nginx.svc.cluster.local\",\n            headers: req.headers\n        });\n    } else {}\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcGkvYnVpbGQtY2xpZW50LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQjtBQUUxQixpRUFBZSxDQUFDLEVBQUVDLEdBQUcsR0FBRSxHQUFLO0lBQzFCLElBQUksSUFBNkIsRUFBRTtRQUNqQyx1QkFBdUI7UUFFdkIsT0FBT0QsbURBQVksQ0FBQztZQUNsQkcsT0FBTyxFQUNMLGtFQUFrRTtZQUNwRUMsT0FBTyxFQUFFSCxHQUFHLENBQUNHLE9BQU87U0FDckIsQ0FBQyxDQUFDO0lBQ0wsT0FBTyxFQUtOO0FBQ0gsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2xpZW50Ly4vYXBpL2J1aWxkLWNsaWVudC5qcz9jNmYwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICh7IHJlcSB9KSA9PiB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIC8vIFdlIGFyZSBvbiB0aGUgc2VydmVyXG5cbiAgICByZXR1cm4gYXhpb3MuY3JlYXRlKHtcbiAgICAgIGJhc2VVUkw6XG4gICAgICAgICdodHRwczovL2luZ3Jlc3MtbmdpbngtY29udHJvbGxlci5pbmdyZXNzLW5naW54LnN2Yy5jbHVzdGVyLmxvY2FsJyxcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIFdlIG11c3QgYmUgb24gdGhlIGJyb3dzZXJcbiAgICByZXR1cm4gYXhpb3MuY3JlYXRlKHtcbiAgICAgIGJhc2VVcmw6ICcvJyxcbiAgICB9KTtcbiAgfVxufTtcbiJdLCJuYW1lcyI6WyJheGlvcyIsInJlcSIsImNyZWF0ZSIsImJhc2VVUkwiLCJoZWFkZXJzIiwiYmFzZVVybCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./api/build-client.js\n");

/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _api_build_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/build-client */ \"./api/build-client.js\");\n\n\nconst LandingPage = ({ currentUser  })=>{\n    // console.log(currentUser);\n    // axios.get('/api/users/currentuser');\n    console.log(currentUser);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n        children: \"Landing Page\"\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\User\\\\Desktop\\\\Microservices\\\\ticketing\\\\client\\\\pages\\\\index.js\",\n        lineNumber: 8,\n        columnNumber: 10\n    }, undefined);\n};\nLandingPage.getInitialProps = async (context)=>{\n    try {\n        const client = (0,_api_build_client__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(context);\n        const { data  } = await client.get(\"/api/users/currentuser\");\n        return data;\n    } catch (err) {\n        console.log(\"Gagal transaksi data\".err);\n        return {};\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LandingPage);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9pbmRleC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFBOEM7QUFFOUMsTUFBTUMsV0FBVyxHQUFHLENBQUMsRUFBRUMsV0FBVyxHQUFFLEdBQUs7SUFDdkMsNEJBQTRCO0lBQzVCLHVDQUF1QztJQUN2Q0MsT0FBTyxDQUFDQyxHQUFHLENBQUNGLFdBQVcsQ0FBQyxDQUFDO0lBRXpCLHFCQUFPLDhEQUFDRyxJQUFFO2tCQUFDLGNBQVk7Ozs7O2lCQUFLLENBQUM7QUFDL0IsQ0FBQztBQUVESixXQUFXLENBQUNLLGVBQWUsR0FBRyxPQUFNQyxPQUFPLEdBQUk7SUFDN0MsSUFBSTtRQUNGLE1BQU1DLE1BQU0sR0FBR1IsNkRBQVcsQ0FBQ08sT0FBTyxDQUFDO1FBQ25DLE1BQU0sRUFBRUUsSUFBSSxHQUFFLEdBQUcsTUFBTUQsTUFBTSxDQUFDRSxHQUFHLENBQUMsd0JBQXdCLENBQUM7UUFFM0QsT0FBT0QsSUFBSSxDQUFDO0lBQ2QsRUFBRSxPQUFNRSxHQUFHLEVBQUU7UUFDWFIsT0FBTyxDQUFDQyxHQUFHLENBQUMsc0JBQXNCLENBQUVPLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sRUFBRTtJQUNYLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixpRUFBZVYsV0FBVyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2xpZW50Ly4vcGFnZXMvaW5kZXguanM/YmVlNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVpbGRDbGllbnQgZnJvbSAnLi4vYXBpL2J1aWxkLWNsaWVudCc7XG5cbmNvbnN0IExhbmRpbmdQYWdlID0gKHsgY3VycmVudFVzZXIgfSkgPT4ge1xuICAvLyBjb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG4gIC8vIGF4aW9zLmdldCgnL2FwaS91c2Vycy9jdXJyZW50dXNlcicpO1xuICBjb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG5cbiAgcmV0dXJuIDxoMT5MYW5kaW5nIFBhZ2U8L2gxPjtcbn07XG5cbkxhbmRpbmdQYWdlLmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIGNvbnRleHQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGNsaWVudCA9IGJ1aWxkQ2xpZW50KGNvbnRleHQpO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgY2xpZW50LmdldCgnL2FwaS91c2Vycy9jdXJyZW50dXNlcicpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gY2F0Y2goZXJyKSB7XG4gICAgY29uc29sZS5sb2coXCJHYWdhbCB0cmFuc2Frc2kgZGF0YVwiLiBlcnIpO1xuICAgIHJldHVybiB7fVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBMYW5kaW5nUGFnZTtcbiJdLCJuYW1lcyI6WyJidWlsZENsaWVudCIsIkxhbmRpbmdQYWdlIiwiY3VycmVudFVzZXIiLCJjb25zb2xlIiwibG9nIiwiaDEiLCJnZXRJbml0aWFsUHJvcHMiLCJjb250ZXh0IiwiY2xpZW50IiwiZGF0YSIsImdldCIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/index.js\n");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/index.js"));
module.exports = __webpack_exports__;

})();