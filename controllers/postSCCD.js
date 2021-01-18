const fs            = require('fs')
const path          = require('path')

const sccd_mobile   = require('../models/sccd_mobile')
const sccd_db       = require('../models/sccd_db')
const sqlExec       = require('../connection/sqlExec')

const sqlFileName   = path.join(__dirname, '../sql/rotinas/INSERT_SCCD.sql')
var   sqlFile       = fs.readFileSync(sqlFileName, "utf8")

const postSCCD = async (req, res) => {

    let dados = {}

    let v_mobile = await sccd_mobile(req)
    let v_db     = await sccd_db(v_mobile)
    let s_sql    = eval('`'+sqlFile+'`');

    console.log('REQ: MOBILE =',v_mobile)
    console.log('REQ: SQL =',s_sql)

    try {
        result = await sqlExec(s_sql)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${s_sql} ]`)
        }
              
        res.json(v_mobile).status(200) 
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "postSCCD", "sql" : s_sql, rowsAffected: -1 }
        res.send({ "success":false, "message" : err.message, "rotina" : "posicaoCarga", "sql" : s_sql }).status(500) 
    } 


}

module.exports = postSCCD