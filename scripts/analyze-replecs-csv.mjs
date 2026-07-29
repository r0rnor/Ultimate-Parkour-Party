import fs from "node:fs";

function parseCsv(filePath) {
	const raw = fs.readFileSync(filePath, "utf8").trim();
	const [headerLine, ...rows] = raw.split(/\r?\n/);
	const headers = headerLine.split(",");
	return rows
		.filter((line) => line.trim().length > 0)
		.map((line) => {
			const cols = line.split(",");
			const record = {};
			for (let i = 0; i < headers.length; i++) {
				record[headers[i]] = cols[i];
			}
			return record;
		});
}

function toNum(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
}

function linReg(x, y) {
	const n = x.length;
	const mx = x.reduce((a, b) => a + b, 0) / n;
	const my = y.reduce((a, b) => a + b, 0) / n;
	const cov = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0);
	const vx = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0);
	const slope = vx === 0 ? 0 : cov / vx;
	const intercept = my - slope * mx;
	return { slope, intercept };
}

function corr(x, y) {
	const n = x.length;
	const mx = x.reduce((a, b) => a + b, 0) / n;
	const my = y.reduce((a, b) => a + b, 0) / n;
	const cov = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0);
	const vx = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0);
	const vy = y.reduce((acc, yi) => acc + (yi - my) ** 2, 0);
	if (vx === 0 || vy === 0) return 0;
	return cov / Math.sqrt(vx * vy);
}

function pct(values, p) {
	const arr = [...values].sort((a, b) => a - b);
	const idx = Math.min(arr.length - 1, Math.max(0, Math.floor((p / 100) * (arr.length - 1))));
	return arr[idx];
}

function analyze(filePath, title) {
	const rows = parseCsv(filePath);
	const idx = rows.map((_, i) => i);
	const unrelVars = rows.map((r) => toNum(r.Unrel_Vars));
	const unrelTime = rows.map((r) => toNum(r.Unrel_Time_ms));
	const totalTime = rows.map((r) => toNum(r.Time_Total_ms));

	const varToUnrel = linReg(unrelVars, unrelTime);
	const idxToUnrel = linReg(idx, unrelTime);
	const idxToVars = linReg(idx, unrelVars);

	console.log(`\n=== ${title} ===`);
	console.log(`samples: ${rows.length}`);
	console.log(`Unrel_Time ~ Unrel_Vars: y=${varToUnrel.slope.toFixed(4)}x + ${varToUnrel.intercept.toFixed(4)}`);
	console.log(`Unrel_Time ~ index: y=${idxToUnrel.slope.toFixed(4)}x + ${idxToUnrel.intercept.toFixed(4)}`);
	console.log(`Unrel_Vars ~ index: y=${idxToVars.slope.toFixed(4)}x + ${idxToVars.intercept.toFixed(4)}`);
	console.log(`corr(Unrel_Vars, Unrel_Time): ${corr(unrelVars, unrelTime).toFixed(4)}`);
	console.log(`corr(index, Unrel_Time): ${corr(idx, unrelTime).toFixed(4)}`);
	console.log(`Unrel_Time p50/p95/max: ${pct(unrelTime, 50).toFixed(2)} / ${pct(unrelTime, 95).toFixed(2)} / ${Math.max(...unrelTime).toFixed(2)}`);
	console.log(`Time_Total p50/p95/max: ${pct(totalTime, 50).toFixed(2)} / ${pct(totalTime, 95).toFixed(2)} / ${Math.max(...totalTime).toFixed(2)}`);
}

const beforePath = process.argv[2];
const afterPath = process.argv[3];

if (!beforePath) {
	console.error("Usage: node scripts/analyze-replecs-csv.mjs <before.csv> [after.csv]");
	process.exit(1);
}

analyze(beforePath, "BEFORE");
if (afterPath) analyze(afterPath, "AFTER");
