(window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] = window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] || []).push([["EthicsAndTickets-property-pane"],{

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

/***/ "fySl":
/*!*************************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/ethicsAndTickets/EthicsAndTicketsPropertyPane.js ***!
  \*************************************************************************************/
/*! exports provided: EthicsAndTicketsPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EthicsAndTicketsPropertyPane", function() { return EthicsAndTicketsPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Auth/AuthMode */ "OpA4");
/* harmony import */ var EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! EthicsAndTicketsAdaptiveCardExtensionStrings */ "avII");
/* harmony import */ var EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__);



var EthicsAndTicketsPropertyPane = /** @class */ (function () {
    function EthicsAndTicketsPropertyPane() {
    }
    EthicsAndTicketsPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["TitleFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneChoiceGroup"])('authMode', {
                                    label: EthicsAndTicketsAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_2__["AuthMode"],
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
    return EthicsAndTicketsPropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.EthicsAndTickets-property-pane.js.map