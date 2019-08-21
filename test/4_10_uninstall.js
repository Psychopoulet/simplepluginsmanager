"use strict";

// deps

	// natives
	const { join } = require("path");
	const { strictEqual } = require("assert");

	// externals
	const { rmdirpProm } = require("node-promfs");

	// locals
	const PluginsManager = require(join(__dirname, "..", "lib", "main.js"));

// const

	const MAX_TIMOUT = 30 * 1000;

	const GITHUB_USER = "Psychopoulet";
	const GITHUB_REPO = "node-pluginsmanager-plugin-test";

	const PLUGINS_DIRECTORY = join(__dirname, "plugins");

		const GOOD_PLUGIN_DIRECTORY = join(PLUGINS_DIRECTORY, GITHUB_REPO);

	const EVENTS_DATA = "test";

// tests

describe("pluginsmanager / uninstall", () => {

	const pluginsManager = new PluginsManager({
		"directory": PLUGINS_DIRECTORY
	});

	before(() => {
		return pluginsManager.loadAll();
	});

	after(() => {

		return pluginsManager.releaseAll().then(() => {
			return pluginsManager.destroyAll();
		}).then(() => {
			return rmdirpProm(GOOD_PLUGIN_DIRECTORY);
		});

	});

	describe("params", () => {

		it("should test update without plugin", (done) => {

			pluginsManager.uninstall().then(() => {
				done(new Error("tests does not generate error"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "Generated error is not an object");
				strictEqual(err instanceof ReferenceError, true, "Generated error is not an instance of Error");

				done();

			});

		});

		it("should test update with wrong plugin", (done) => {

			pluginsManager.uninstall(false).then(() => {
				done(new Error("tests does not generate error"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "Generated error is not an object");
				strictEqual(err instanceof TypeError, true, "Generated error is not an instance of Error");

				done();

			});

		});

	});

	describe("execute", () => {

		it("should uninstall plugin", () => {

			pluginsManager.on("uninstalled", (plugin, data) => {

				strictEqual(typeof data, "string", "Events data is not a string");
				strictEqual(data, EVENTS_DATA, "Events data is not as expected");

				(0, console).log("--- [PluginsManager/events/uninstalled] " + plugin.name + " - " + data);

			});

			return pluginsManager.installViaGithub(GITHUB_USER, GITHUB_REPO).then((plugin) => {

				strictEqual(typeof plugin, "object", "Plugin is not an object");
				strictEqual(typeof plugin.name, "string", "Plugin name is not a string");
				strictEqual(plugin.name, GITHUB_REPO, "Plugin name is not as expected");

				return pluginsManager.uninstall(plugin, EVENTS_DATA);

			});

		}).timeout(MAX_TIMOUT);

	});

});
