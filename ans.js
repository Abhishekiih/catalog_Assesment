const fs = require('fs');

function loadJson(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}

function decodeYValues(testCase) {
    const points = [];
    for (let key in testCase) {
        if (key === 'keys') continue; 

        const x = parseInt(key); 
        const base = parseInt(testCase[key].base); 
        const encodedValue = testCase[key].value;

        const y = parseInt(encodedValue, base);
        points.push({ x, y });
    }
    return points;
}

function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        const { x: xi, y: yi } = points[i];
        
        let numerator = 1;
        let denominator = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const { x: xj } = points[j];
                numerator *= (0 - xj);  // (0 - xj)
                denominator *= (xi - xj);  // (xi - xj)
            }
        }

        const li = numerator / denominator; 
        constantTerm += yi * li; 
    }

    return Math.round(constantTerm);
}

function findSecret(filePath) {
    const testData = loadJson(filePath);
    const keys = testData.keys;
    const n = keys.n;
    const k = keys.k;

    const points = decodeYValues(testData);

    return lagrangeInterpolation(points, k);
}

const filePath1 = 'testcase1.json';
const filePath2 = 'testcase2.json';

const secret1 = findSecret(filePath1);
console.log('Secret for Test Case 1:', secret1);

const secret2 = findSecret(filePath2);
console.log('Secret for Test Case 2:', secret2);
