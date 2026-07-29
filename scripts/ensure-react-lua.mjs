/**
 * @rbxts/react/src/init.lua does `script.Parent:WaitForChild("ReactLua")`.
 * The runtime lives in `@rbxts/react-vendor`, but it must appear as a child named `ReactLua`
 * next to the `react` package. Link it after install (pnpm hoisting alone is not enough).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const reactDir = path.join(root, "node_modules", "@rbxts", "react");
const vendorDir = path.join(root, "node_modules", "@rbxts", "react-vendor");
const linkPath = path.join(reactDir, "ReactLua");

function main() {
	if (!fs.existsSync(vendorDir) || !fs.existsSync(reactDir)) {
		console.warn("ensure-react-lua: @rbxts/react or @rbxts/react-vendor not found, skip");
		return;
	}

	if (fs.existsSync(linkPath)) {
		try {
			const st = fs.lstatSync(linkPath);
			if (st.isSymbolicLink() || st.isDirectory()) {
				return;
			}
		} catch {
			// fall through to replace
		}
		fs.rmSync(linkPath, { recursive: true, force: true });
	}

	if (process.platform === "win32") {
		fs.symlinkSync(vendorDir, linkPath, "junction");
	} else {
		const rel = path.relative(reactDir, vendorDir);
		fs.symlinkSync(rel, linkPath, "dir");
	}
}

main();
