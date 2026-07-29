import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const localesRoot = path.join(root, "src", "client", "ui", "locales");
const localeDirs = ["en", "ru"];

function readLocaleKeys(dirName) {
	const dir = path.join(localesRoot, dirName);
	const files = fs.readdirSync(dir).filter((file) => file.endsWith(".ts") && file !== "index.ts");

	const keys = new Set();
	for (const file of files) {
		const filePath = path.join(dir, file);
		const content = fs.readFileSync(filePath, "utf8");
		const matches = content.matchAll(/"([^"]+)":/g);
		for (const match of matches) {
			keys.add(match[1]);
		}
	}

	return keys;
}

function diff(baseKeys, comparedKeys) {
	const missing = [];
	for (const key of baseKeys) {
		if (!comparedKeys.has(key)) {
			missing.push(key);
		}
	}
	return missing.sort();
}

const [baseLocale, compareLocale] = localeDirs;
const baseKeys = readLocaleKeys(baseLocale);
const compareKeys = readLocaleKeys(compareLocale);

const missingInCompare = diff(baseKeys, compareKeys);
const extraInCompare = diff(compareKeys, baseKeys);

if (missingInCompare.length === 0 && extraInCompare.length === 0) {
	process.stdout.write(`[locales:check] OK: ${baseLocale} and ${compareLocale} key sets are in sync.\n`);
	process.exit(0);
}

if (missingInCompare.length > 0) {
	process.stderr.write(`[locales:check] Missing in ${compareLocale}:\n`);
	for (const key of missingInCompare) {
		process.stderr.write(`  - ${key}\n`);
	}
}

if (extraInCompare.length > 0) {
	process.stderr.write(`[locales:check] Extra in ${compareLocale}:\n`);
	for (const key of extraInCompare) {
		process.stderr.write(`  - ${key}\n`);
	}
}

process.exit(1);
