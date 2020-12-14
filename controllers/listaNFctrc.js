const sqlQuery     = require('../connection/sqlQuery')

async function listaNFctrc( req, res ) {
    var userId_Token = req.userId

    var { cod_ctrc } = req.body 

    // XXX-X-99999999
    let empresa   = `${cod_ctrc}`.substr(0,3)
    let serie     = `${cod_ctrc}`.substr(4,1)
    let numero    = `${cod_ctrc}`.substr(6,10)    

    if ( (!empresa) || (!serie) || (!serie) ) {
        res.send({ "erro" : "body sem parâmetros", "rotina" : "listaNFctrc", "sql" : "Sem todos os Parâmetros" }).status(500) 
    }    

    var wsql = `SELECT DISTINCT 
                    CONCAT (NFR.EMP_CODIGO,'-',NFR.CNH_SERIE,'-',NFR.CNH_CTRC) AS DOCUMENTO,
                    NFR.DATA, NFR.NF, NFR.VALOR, NFR.VOLUME, NFR.CHAVENFE
                FROM NFR
                WHERE 
                EMP_CODIGO='${empresa}' AND CNH_SERIE='${serie}' AND CNH_CTRC=${numero}
                `				
    try {
				
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${cnpj}, ${list_nfs} ]`)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "dadosLoteNF", "sql" : wsql }).status(500) 
    }    
}

module.exports = listaNFctrc