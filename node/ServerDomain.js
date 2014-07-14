/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";

    var exec = require("child_process").exec,
        _domainManager;

    /**
     * @private
     * Handler function for the simple.getMemory command.
     * @param {boolean} total If true, return total memory; if false, return free memory only.
     * @return {number} The amount of memory.
     */
    function cmdServerMac(password, action) {
        var command = "",
            sudo;

        if (action) {
            command = "stop";
            console.log("[Server Mac] the server is trying to " + command);
        } else {
            command = "start";
            console.log("[Server Mac] the server is trying to " + command);
        }

        sudo = exec("echo "  + password + " | sudo -S apachectl " + command, function (error, stdout, stderr) {
            if (error !== null && error.code === 1) {
                _domainManager.emitEvent("azakura", "showPasswordDialog");
            } else {
                if (command === "stop") {
                    _domainManager.emitEvent("azakura", "returnServerStatus", false);
                } else {
                    _domainManager.emitEvent("azakura", "returnServerStatus", true);
                }
            }
        });
    }

    function cmdServerStatus() {
        var status;

        status = exec("ps aux | grep '[h]ttpd'", function (error, stdout, stderr) {
            if (error !== null && error.code === 1) {
                _domainManager.emitEvent("azakura", "returnServerStatus", false);
            } else {
                _domainManager.emitEvent("azakura", "returnServerStatus", true);
            }
        });
    }

    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        _domainManager = domainManager;

        if (!domainManager.hasDomain("azakura")) {
            domainManager.registerDomain("azakura", {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            "azakura",       // domain name
            "serverMac",    // command name
            cmdServerMac,   // command handler function
            false,          // this command is synchronous in Node
            "Start or stop de native apache server in mac os"
        );

        domainManager.registerCommand(
            "azakura",
            "serverStatus",
            cmdServerStatus,
            false,
            "Check the status of the server"
        );

        domainManager.registerEvent(
            "azakura",
            "returnServerStatus"
        );

        domainManager.registerEvent(
            "azakura",
            "showPasswordDialog"
        );
    }

    exports.init = init;

}());
