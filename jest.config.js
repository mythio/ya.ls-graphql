module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/tests"],
	setupFiles: ["<rootDir>/tests/init.ts"],
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts",
		"!**/node_modules/**",
		"!**/coverage/**",
		"!webpack.**.js"
	]
};
