const express = require('express');
const { ArduinoDataTemp } = require('./newserial');
const db = require('./database')
const router = express.Router();

router.get('/', (request, response, next) => {
    var sql = `
    SELECT * FROM luminosidade`;

    db.query(sql, function(err, result) {
        if (err) throw err;
        const data = result;

        let sum = 0;
        let lum = [];

        for (const item of data) {
            sum += Number(item.registroLuminosidade);

            lum.push(Number(item.registroLuminosidade));
        }

        let average = (sum / lum.length);
        let total = lum.length;
        average = isNaN(average) ? 0 : average;

        var sql = `
        SELECT * FROM temperatura`;
    
        db.query(sql, function(err, result) {
            if (err) throw err;

            const data2 = result;

            let sum2 = 0;
            let temp = [];
            for (const item of data2) {
                sum2 += Number(item.registroTemperatura);

                temp.push(Number(item.registroTemperatura));
            }

            let average2 = (sum2 / temp.length);
            let total2 = temp.length;

            average2 = isNaN(average2) ? 0 : average2;

            response.json({
                data: lum,
                total: total,
                average: (isNaN(average) ? 0 : average),

                data2: temp,
                total2: total2,
                average2: (isNaN(average2) ? 0 : average2),
            });
        });
    });
    
    /*
    ArduinoDataTemp.List.map((item)=>{
        let sum = item.data.reduce((a, b) => a + b, 0);
        let average = (sum / item.data.length).toFixed(2);
        item.total = item.data.length;
        item.average = isNaN(average) ? 0 : average
    });
    console.log(ArduinoDataTemp.List);
    response.json(ArduinoDataTemp.List);
    */
});
router.post('/sendData', (request, response) => {
    var luminosidade = ArduinoDataTemp.List[2].data[ArduinoDataTemp.List[2].data.length - 1];
    var temperatura_lm35 = ArduinoDataTemp.List[3].data[ArduinoDataTemp.List[3].data.length - 1];

    if(!luminosidade || !temperatura_lm35) {
        console.log("deu erro");
        return;
    }

    var sql = `
    INSERT INTO temperatura (fkSensor, data_hora, registroTemperatura) VALUES (1, NOW(), ${temperatura_lm35.toFixed(2)});`;

    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log(`Luminosidade: ${luminosidade}\nTemperatura LM35: ${temperatura_lm35}\n`);
        console.log("Number of records inserted: " + result.affectedRows);
    });
    
    var sql = `
    INSERT INTO luminosidade (fkSensor, data_hora, registroLuminosidade) VALUES (2, NOW(), ${luminosidade});`;
    
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log(`Luminosidade: ${luminosidade}\n`);
        console.log("Number of records inserted: " + result.affectedRows);
    });
    response.sendStatus(200);
})

module.exports = router;