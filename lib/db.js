let namaDatabase = 'data';

alasql(/*sql*/ `
create localStorage database if not exists ${namaDatabase};
attach localStorage database ${namaDatabase};
use ${namaDatabase};
`);