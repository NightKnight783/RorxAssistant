const Papa = require("papaparse");
const fs = require("fs");  

const save = (data) => {
    fs.writeFileSync("data.json", JSON.stringify(data, null, '\t'), function(err) {
        if (err) {
            console.log("Une erreur est survenue pendant la sauvegarde des données:\n" + err);
            return false
        }
    });
    return true
}

const load = () => {
    try {
        let rawdata = fs.readFileSync('data.json');
        let data = JSON.parse(rawdata);
        return data
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = {
    save,
    load
}