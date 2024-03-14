export default function BuatDatabase() {
    return /*html*/ `<style>
    .pilihan-tabel {
        padding: 3px;
    }

    .table-database td {
        vertical-align: top;
    }

    .block {
        display: block;
    }

    .mb {
        margin-bottom: 10px;
    }

    .punya-tabel {
        overflow: auto;
        display: inline-block;
        width: 50vw;
    }

    table {
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid black;
        padding: 3px 6px;
    }
</style>

<div @vue:mounted="mounted" v-scope="{
    tabel: [],
    header: [],
    data: [],
    query: '',
    queryHeader: [],
    queryJson: [],
    submitQuery(){
        this.queryJson = alasql(this.query)
        this.queryHeader = Object.keys(this.queryJson[0])
    },
    mounted(){
        for (let n in alasql.tables){
            this.tabel.push(n)
        }
    },
    ambilTabel(){
        this.header = alasql.tables[params.tabel].columns.map(x => x.columnid)
        this.data = alasql(/*sql*/ 'select * from ' + params.tabel)
    }
}">
    <div class="table-database" v-effect="if (params.tabel && key) ambilTabel()">
        <table>
            <tbody>
                <tr>
                    <td>
                        <ol>
                            <li v-for="x in tabel.sort()"><a :href="'#/database?tabel=' + x ">{{ x }}</a></li>
                        </ol>
                    </td>

                    <td class="punya-tabel">
                        <h2>{{ params.tabel }}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th v-for="x in header">{{ x }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="x in data">
                                    <td v-for="y in header">{{ x[y] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <h2>Query</h2>
                        <form action="" @submit.prevent="submitQuery">

                            <textarea v-model="query" required name="" class="block mb" id="" cols="30"
                                rows="10"></textarea>
                            <input type="submit" value="Cobain" class="mb">
                        </form>
                        <table>
                            <thead>
                                <tr>
                                    <th v-for="x in queryHeader">{{ x }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="x in queryJson">
                                    <td v-for="y in queryHeader">{{ x[y] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}