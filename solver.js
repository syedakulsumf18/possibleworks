const fs = require("fs");

// Function to decode a number from a given base
function decodeBase(value, base) {
    return parseInt(value, base);
}

// Function to read and parse JSON input
function readInput(filename) {
    let rawData = fs.readFileSync(filename);
    let data = JSON.parse(rawData);
    return data; // Return entire JSON object
}

// Function to extract points from a single test case
function extractPoints(testCase) {
    let n = testCase.keys.n;
    let k = testCase.keys.k;
    let m = k - 1;

    let points = {};
    for (let key in testCase) {
        if (key !== "keys") {
            let x = parseInt(key);
            let base = parseInt(testCase[key].base);
            let y = decodeBase(testCase[key].value, base);
            points[x] = y;
        }
    }
    return { points, m };
}

// Function to solve for the constant term using Lagrange Interpolation
function solvePolynomial(points, m) {
    let xs = Object.keys(points).map(Number);
    let ys = Object.values(points);

    function lagrange(x) {
        let result = 0;
        for (let i = 0; i <= m; i++) {
            let term = ys[i];
            for (let j = 0; j <= m; j++) {
                if (i !== j) {
                    term *= (x - xs[j]) / (xs[i] - xs[j]);
                }
            }
            result += term;
        }
        return result;
    }

    return lagrange(0); // Solve for f(0), which is the constant term `c`
}

// Main function to process multiple test cases
function main() {
    let data = readInput("input.json");

    let results = [];
    for (let testCaseKey in data) {
        let { points, m } = extractPoints(data[testCaseKey]);
        let constantC = solvePolynomial(points, m);
        results.push(`Secret constant (c) for ${testCaseKey}: ${Math.round(constantC)}`);
    }

    console.log(results.join("\n")); // Print both outputs
}

main();
