/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global $, define, brackets, Mustache */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        NodeDomain = brackets.getModule("utils/NodeDomain");

    // Domain Node
    var serverDomain = new NodeDomain("azakura", ExtensionUtils.getModulePath(module, "node/ServerDomain"));

    // Templates
    var dialogTemplate = require("text!html/dialog.html");

    // Css
    ExtensionUtils.loadStyleSheet(module, "styles/server.css");

    // Vars
    var serverIcon,
        serverStatus,
        dialog,
        self = this;

    function handleIcon() {
        if (self.serverStatus) {
            serverIcon.addClass("active");
        } else {
            serverIcon.removeClass("active");
        }
    }

    // (Start / Stop) Server Mac
    function serverMac(password) {
        serverDomain.exec("serverMac", password, self.serverStatus);
    }

    // Check the status of the server
    function checkServerStatus() {
        serverDomain.exec("serverStatus");
    }

    // Handle password dialog
    function handlePasswordDialog() {
        dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(dialogTemplate));
        dialog.done(function (buttonId) {
            if (buttonId === "ok") {
                serverMac($("#sm-password", dialog.getElement()).val());
            }
        });
    }

    function handleServerStatus(e, status) {
        self.serverStatus = status;
        handleIcon();
    }

    AppInit.appReady(function () {
        // Add icon to toolbar.
        serverIcon = $("<a href='#' title='Server Mac' id='brackets-sm-icon'></a>");
        serverIcon.click(function () {
            serverMac();
        }).appendTo('#main-toolbar .buttons');

        $(serverDomain).on("showPasswordDialog", handlePasswordDialog);
        $(serverDomain).on("returnServerStatus", handleServerStatus);

        checkServerStatus();
    });
});
