/*
	eslint no-loop-func: 0
*/

"use strict";

// deps

	// natives
	const { join } = require("path");

	// externals
	const {
		mkdirProm,
		readdirProm, copyFileProm
	} = require("node-promfs");

// module

module.exports = function copyPlugin (directory, originName, targetName) {

	const originDirectory = join(directory, originName);
	const targetDirectory = join(directory, targetName);

	// create dir
	return mkdirProm(targetDirectory).then(() => {

		// copy dir
		return readdirProm(originDirectory).then((files) => {

			return new Promise((resolve, reject) => {

				let j = 0;

				for (let i = 0; i < files.length; ++i) {

					copyFileProm(
						join(originDirectory, files[i]),
						join(targetDirectory, files[i])
					).then(() => {

						if (-1 < j) {

							++j;

							if (j === files.length) {
								resolve();
							}

						}

					}).catch((err) => {
						j = -1;
						reject(err);
					});

				}

			});

		});

	});

};
