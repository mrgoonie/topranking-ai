module.exports = {
	"*": () => ["pnpm check-secret", "pnpm format"],
	"*.{js,jsx,ts,tsx}": ["eslint --fix", "eslint"],
	"**/*.ts?(x)": () => "pnpm check-types",
};
