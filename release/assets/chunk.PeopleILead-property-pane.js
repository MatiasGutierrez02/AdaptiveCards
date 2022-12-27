(window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] = window["webpackJsonp_2fe7e8653568b751ff0a507d66507817"] || []).push([["PeopleILead-property-pane"],{

/***/ "E908":
/*!***************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/peopleILead/PeopleILeadPropertyPane.js ***!
  \***************************************************************************/
/*! exports provided: PeopleILeadPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeopleILeadPropertyPane", function() { return PeopleILeadPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! PeopleILeadAdaptiveCardExtensionStrings */ "Ym14");
/* harmony import */ var PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Auth_AuthMode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Auth/AuthMode */ "OpA4");



var PeopleILeadPropertyPane = /** @class */ (function () {
    function PeopleILeadPropertyPane() {
    }
    PeopleILeadPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneChoiceGroup"])('authMode', {
                                    label: PeopleILeadAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AuthMode"],
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
    return PeopleILeadPropertyPane;
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
//# sourceMappingURL=chunk.PeopleILead-property-pane.js.map