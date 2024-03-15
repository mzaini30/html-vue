import { mdjsProcess } from '@mdjs/core';
import { readFileSync, writeFileSync } from 'fs';

let markdown = readFileSync('./coba-mdjs/index.md').toString();

let jadiHtml = await mdjsProcess(markdown);
let hasil = `
<script>
    ${jadiHtml.jsCode.replace(/;$/, '')}
</script>

${jadiHtml.html}
`;

console.log(hasil);