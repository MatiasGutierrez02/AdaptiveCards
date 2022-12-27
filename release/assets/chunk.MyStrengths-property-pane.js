(window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] = window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] || []).push([["MyStrengths-property-pane"],{

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


/***/ }),

/***/ "oORg":
/*!***************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/myStrengths/MyStrengthsPropertyPane.js ***!
  \***************************************************************************/
/*! exports provided: MyStrengthsPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyStrengthsPropertyPane", function() { return MyStrengthsPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Auth/AuthMode */ "OpA4");
/* harmony import */ var MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! MyStrengthsAdaptiveCardExtensionStrings */ "sx7+");
/* harmony import */ var MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__);



var MyStrengthsPropertyPane = /** @class */ (function () {
    function MyStrengthsPropertyPane() {
    }
    MyStrengthsPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["TitleFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneChoiceGroup"])('authMode', {
                                    label: MyStrengthsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["AuthMode"],
                                    options: [
                                        { key: _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_1__["AuthMode"].Primary, text: "Primary" },
                                        { key: _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_1__["AuthMode"].Secondary, text: "Secondary" },
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MyStrengthsPropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.MyStrengths-property-pane.js.map