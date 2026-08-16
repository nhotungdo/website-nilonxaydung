const fs = require('fs');
const path = require('path');

const tsCode = fs.readFileSync('f:/OJT-Review/website-nilonxaydung/nilon-website/data/products.ts', 'utf8');

// The file exports PRODUCTS. We can hackily evaluate it by stripping the types and exports.
// Or better, let's just write a ts-node script and run it from nilon-invoices
