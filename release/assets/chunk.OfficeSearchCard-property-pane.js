(window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] = window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] || []).push([["OfficeSearchCard-property-pane"],{

/***/ "I6eJ":
/*!*************************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/officeSearchCard/OfficeSearchCardPropertyPane.js ***!
  \*************************************************************************************/
/*! exports provided: OfficeSearchCardPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OfficeSearchCardPropertyPane", function() { return OfficeSearchCardPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! OfficeSearchCardAdaptiveCardExtensionStrings */ "D+i2");
/* harmony import */ var OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Auth/AuthMode */ "OpA4");



var OfficeSearchCardPropertyPane = /** @class */ (function () {
    function OfficeSearchCardPropertyPane() {
    }
    OfficeSearchCardPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneChoiceGroup"])('authMode', {
                                    label: OfficeSearchCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AuthMode"],
                                    options: [
                                        { key: _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_2__["AuthMode"].Primary, text: "Primary" },
                                        { key: _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_2__["AuthMode"].Secondary, text: "Secondary" },
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return OfficeSearchCardPropertyPane;
}());



/***/ }),

/***/ "OpA4":
/*!*****************************************************!*\
  !*** ./lib/adaptiveCardExtensions/Auth/AuthMode.js ***!
  \*****************************************************/
/*! exports provided: AuthMode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthMode", function() { return AuthMode; });
var AuthMode;
(function (AuthMode) {
    AuthMode[AuthMode["Primary"] = 0] = "Primary";
    AuthMode[AuthMode["Secondary"] = 1] = "Secondary";
})(AuthMode || (AuthMode = {}));


/***/ })

}]);
//# sourceMappingURL=chunk.OfficeSearchCard-property-pane.js.map