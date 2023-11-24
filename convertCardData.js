const excelToJson = require('convert-excel-to-json');
const fs = require('fs')

sortFunction = (a, b) => {

}

const pathDataFile = "./card_bank/data.json"

const result = excelToJson({
    sourceFile: 'RoRx_Cards_a0_7_2.xlsx',
    columnToKey: {
        '*': '{{columnHeader}}'
    },
    header:{
        rows: 1
    },
});

let data = {
    Robots: result.Robots.sort((a, b) => { 
        if (a.Cost != b.Cost)
            return a.Cost - b.Cost
        if (a.Family != b.Family)
            return a.Family.localeCompare(b.Family)
        return a.Name.localeCompare(b.Name)
    }),
    Buildings: result.Buildings.sort((a, b) => {
        if (a.Family != b.Family)
            return a.Family.localeCompare(b.Family)
        if (a.Cost != b.Cost)
            return a.Cost - b.Cost
        return a.Name.localeCompare(b.Name)
    }),
    Masteries: result.Masteries.sort((a, b) => {
        if (a.Family != b.Family)
            return a.Family.localeCompare(b.Family)
        if (a.Cost != b.Cost)
            return a.Cost - b.Cost
        return a.Name.localeCompare(b.Name)
    })
}

if (fs.existsSync(pathDataFile))
    fs.rm(pathDataFile, () => {
        fs.writeFileSync(pathDataFile, JSON.stringify(data, null, 2))
    })
else {
    fs.writeFileSync(pathDataFile, JSON.stringify(data, null, 2))
}