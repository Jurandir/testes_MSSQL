const sqlQuery     = require('../connection/sqlQuery')

async function dadosCTRC( req, res ) {
    var userId_Token = req.userId

    var { empresa, serie, documento } = req.body // wcnpj
    if ( (empresa) && (serie) && (documento) ) {
        empresa     = empresa
        serie       = serie
        documento   = documento
    } else {
        res.send({ "erro" : "body sem parâmetros", "rotina" : "dadosCTRC", "sql" : "Sem Parâmetros" }).status(500) 
    }    

    var wsql = `SELECT 
                    CNH.DATA,
                    CONCAT(CNH.EMP_CODIGO,'-',CNH.SERIE,'-',CNH.CTRC) as CONHECIMENTO,
                    REME.NOME              as REMETENTE,
                    DEST.NOME              as DESTINATARIO,
                    CNH.NF,
                    CNH.TRE_CODIGO         as TRECHO,
                    CNH.EMP_CODIGO         as FILIAL,
                    CNH.CTRC               as NUMERO_CTRC,
                    CNH.CHAVECTE,
                    EMP.CGC                as EMITENTE,
                    DAE.CODDAE             as DAE_CODIGO,
                    DAE.CODRECEITA         as DAE_CODRECEITA,
                    DAE.CLI_CGCCPF_CLIDEST as DAE_CONTRIBUINTE,
                    DAE.DATAEMISSAO        as DAE_EMISSAO,
                    DAE.VENCIMENTO         as DAE_VENCIMENTO,
                    DAE.DATABAIXA          as DAE_BAIXA,
                    DAE.VALOR              as DAE_VALOR,
                    CONCAT(DAE.EMP_CODIGO,DAE.CODIGO) as DAE_IMPRESSO
                    FROM CNH
                    LEFT JOIN CLI REME ON REME.CGCCPF    = CNH.CLI_CGCCPF_REMET
                    LEFT JOIN CLI DEST ON DEST.CGCCPF    = CNH.CLI_CGCCPF_REMET
                    LEFT JOIN EMP      ON EMP.CODIGO     = CNH.EMP_CODIGO
                    LEFT JOIN DAE      ON EMP_CODIGO_CNH = CNH.EMP_CODIGO AND CNH_CTRC = CNH.CTRC
                WHERE  
				     CNH.EMP_CODIGO = '${empresa}' AND
					 CNH.SERIE      = '${serie}'   AND
					 CNH.CTRC       = ${documento}
                `
				
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${empresa}, ${serie}, ${documento} ]`)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "dadosCTRC", "sql" : wsql }).status(500) 
    }    
}

module.exports = dadosCTRC