"use strict";

var browserSync = require("../../../index");

var assert      = require("chai").assert;
var request     = require("supertest");

describe("E2E script path test - given a callback", function () {

    var instance;

    before(function (done) {

        var config = {
            server: {
                baseDir: "test/fixtures"
            },
            open: false,
            scriptPath: function (scriptPath) {
                return "localhost:PORT" + scriptPath;
            }
        };
        instance = browserSync(config, done);
    });

    after(function () {
        instance.cleanup();
    });

    it("Sets the script path", function () {
        assert.include(instance.options.snippet, "localhost:PORT/browser-sync/browser-sync-client.");
    });
});

describe("E2E Socket path test - given a callback", function () {

    var instance;

    before(function (done) {

        var config = {
            server: {
                baseDir: "test/fixtures"
            },
            open: false,
            socket: {
                namespace: function (namespace) {
                    return namespace + "TEST";
                }
            }
        };
        instance = browserSync(config, done);
    });

    after(function () {
        instance.cleanup();
    });

    it("sets the socket path", function (done) {
        request(instance.server)
            .get(instance.options.scriptPaths.path)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "io('/browser-sync/socket.ioTEST'");
                done();
            });
    });
});
describe("E2E Socket path test - given a callback 2", function () {

    var instance;

    before(function (done) {

        var config = {
            server: {
                baseDir: "test/fixtures"
            },
            open: false,
            socket: {
                namespace: function (namespace) {
                    return "localhost:3003" + namespace;
                }
            }
        };
        instance = browserSync(config, done);
    });

    after(function () {
        instance.cleanup();
    });

    it("sets the socket path", function (done) {
        request(instance.server)
            .get(instance.options.scriptPaths.path)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "___browserSync___.io('localhost:3003/browser-sync/socket.io',");
                done();
            });
    });
});
