//  API Cliente V2
//  03/12/2020 - Jurandir Ferreira 
//  TESTE : parametros = ["16851732000206","43673","2"]
//  http://localhost:5000/apitracking?cnpj=16851732000206&documento=43673&serie=2

"use strict";

const easydocs                = require('../controllers/checkImagemEasyDocs')
const agileprocess            = require('../controllers/checkImagemAgileProcess')
const sqlQuery                = require('../connection/sqlQuery')

 
async function apiCliente( req, res ) {

  let retorno = {}
  let wemp, wctrc, wcnhserie, wwhere, wtrecho, wunidest, wcnpjentrega, wchave
  let wcnpj, wnf, wnfserie, werror, wsqlerr
  let userId_Token


  retorno.numero           = 0
  retorno.filial           = ''
  retorno.serie            = 'E'
  retorno.dataEmissao      = null 
  retorno.prevEntrega      = null
  retorno.tipoPesoM3       = null
  retorno.pesoM3           = null
  retorno.valorMercadoria  = null
  retorno.valorFrete       = null
  retorno.chave            = null
  retorno.origemPrestacao  = {}
  retorno.notaFiscal       = {}
  retorno.unidadeDestino   = {}
  retorno.ocorrencias      = []
  retorno.destinoPrestacao = {}
  retorno.localEntrega     = {}
  retorno.comprovantes     = []
  
  werror  = 'apiCliente'
  wsqlerr = ''

  //------------------------------------ 
  if ( req.method == 'GET' ) {
     let { cnpj, documento, serie } = req.query
     wcnpj    = cnpj
     wnf      = documento
     wnfserie = serie ? serie : ''
  }
  
  //------------------------------------ 
  if ( req.method == 'POST' ) {
      let { valoresParametros } = req.body
      if (valoresParametros) {
          wcnpj    = valoresParametros[0]
          wnf      = valoresParametros[1]
          wnfserie = valoresParametros[2]
      } else {
          let { cnpj, documento, serie } = req.query
          wcnpj    = cnpj
          wnf      = documento
          wnfserie = serie ? serie : '1' 
      }    
  }
  
 //------------------------------------ 
 // CNPJ extraido do Token
  userId_Token = req.userId



async function set_nf() {
  werror = 'set_nf'
    let data = await sqlQuery(`
    SELECT NFR.EMP_CODIGO AS CNH_EMPRESA,NFR.CNH_SERIE,NFR.CNH_CTRC,
           NFR.NF,NFR.SERIE,NFR.DATA,NFR.VALOR,NFR.CHAVENFE,
           CNH.CLI_CGCCPF_DEST   
    FROM NFR
    JOIN CNH ON CNH.EMP_CODIGO = NFR.EMP_CODIGO AND CNH.SERIE = NFR.CNH_SERIE AND CNH.CTRC = NFR.CNH_CTRC
    WHERE (CNH.CLI_CGCCPF_REMET='${wcnpj}' 
       OR  CNH.CLI_CGCCPF_REMET='${userId_Token}' 
       OR  CNH.CLI_CGCCPF_PAG  ='${wcnpj}'
       OR  NFR.CLI_CGCCPF_REMET='${wcnpj}')
      AND  NFR.NF = ${wnf}
      AND  NFR.SERIE = '${wnfserie}'
    ORDER BY (CASE WHEN NFR.CNH_SERIE='E' THEN 0 ELSE 1 END )
  `)

   let { Erro } = data
   if ((Erro) || (!data[0])) { 
        console.log(`Nota fiscal: (${wnf}-${wnfserie}) - CNPJ (${wcnpj}), não encontrada !!! - `,data,Erro)
        wsqlerr = Erro 
        retorno.numero              = 0
        retorno.filial              = ''
        retorno.serie               = 'E'      
        retorno.notaFiscal.numero   = wnf
        retorno.notaFiscal.serie    = wnfserie
   } else {
      //------------------------------------
        retorno.filial          = data[0].CNH_EMPRESA
        retorno.serie           = data[0].CNH_SERIE
        retorno.numero          = data[0].CNH_CTRC
        retorno.dataEmissao     = data[0].DATA
        retorno.valorMercadoria = data[0].VALOR
      //------------------------------------
        retorno.notaFiscal.numero          = data[0].NF
        retorno.notaFiscal.serie           = data[0].SERIE
        retorno.notaFiscal.dataEmissao     = data[0].DATA
        retorno.notaFiscal.valor           = data[0].VALOR
        retorno.notaFiscal.chaveNFe        = data[0].CHAVENFE
      //------------------------------------
        wemp      = data[0].CNH_EMPRESA
        wcnhserie = data[0].CNH_SERIE
        wctrc     = data[0].CNH_CTRC
      //------------------------------------
   }
}

async function set_cnh() {
    let data
    werror = 'set_cnh'
    if (retorno.numero  === 0) { 
        wwhere=`
        ( CNH.CLI_CGCCPF_REMET       = '${wcnpj}'
          OR  CNH.CLI_CGCCPF_DEST    = '${wcnpj}'
          OR  CNH.CLI_CGCCPF_PAG     = '${wcnpj}' ) 
          AND CNH.NF LIKE '%${wnf}%' `
    } else {
        wwhere=`CNH.EMP_CODIGO='${wemp}' AND CNH.SERIE='${wcnhserie}' and CNH.CTRC=${wctrc} ` 
    }   

    data = await sqlQuery(`
      SELECT CNH.*,
            NFR.SERIE    AS NF_SERIE,
            NFR.DATA     AS NF_EMISSAO,
            NFR.CHAVENFE AS NF_CHAVE        
      FROM CNH
      LEFT JOIN NFR ON NFR.EMP_CODIGO = CNH.EMP_CODIGO 
                   AND NFR.CNH_SERIE  = CNH.SERIE 
                   AND NFR.CNH_CTRC   = CNH.CTRC
                   AND NFR.NF         = '${wnf}'
      WHERE  ${wwhere} 
    `)

    // caso tenha erro na consulta ao banco
    let { Erro } = data
    if (Erro) { 
         wsqlerr = Erro 
         console.log('set_cnh',data,Erro)
    }        
    
    // caso a consulta ao banco não volte com dados
    if (!data[0]) {
        
        wsqlerr = 'EOF - Não há dados para os parâmetros informados !!!'
        werror = 'PesquisaNF'
        throw new Error(`EOF() - ${Erro} `)

    } else {
          if (retorno.numero  === 0) {
              retorno.notaFiscal.serie           = data[0].NF_SERIE 
              retorno.notaFiscal.dataEmissao     = data[0].NF_EMISSAO
              retorno.notaFiscal.valor           = data[0].VALORNF
              retorno.notaFiscal.chaveNFe        = data[0].NF_CHAVE
          } 

          //------------------------------------
          retorno.filial           = data[0].EMP_CODIGO
          retorno.serie            = data[0].SERIE 
          retorno.numero           = data[0].CTRC
          retorno.dataEmissao      = data[0].DATA 
          retorno.prevEntrega      = data[0].PREVENTREGA 
          retorno.tipoPesoM3       = data[0].ESP_CODIGO
          retorno.pesoM3           = data[0].VOLUME
          retorno.valorMercadoria  = data[0].VALORNF
          retorno.valorFrete       = data[0].TOTFRETE
          retorno.chave            = data[0].CHAVECTE
          //--------------------------------------------
          wtrecho       = data[0].TRE_CODIGO
          wcnpjentrega  = data[0].CLI_CGCCPF_DEST
          //--------------------------------------------
          wemp      = wemp      ? wemp      : data[0].EMP_CODIGO
          wcnhserie = wcnhserie ? wcnhserie : data[0].SERIE
          wctrc     = wctrc     ? wctrc     : data[0].CTRC
          wchave    = `${wemp}${wcnhserie}${wctrc}` 
          //----------
          // valida raiz do usuario com dados
          let raiz_dest    = (data[0].CLI_CGCCPF_DEST    || '').substring(0,8)   
          let raiz_remet   = (data[0].CLI_CGCCPF_REMET   || '').substring(0,8)  
          let raiz_receb   = (data[0].CLI_CGCCPF_RECEB   || '').substring(0,8)  
          let raiz_pag     = (data[0].CLI_CGCCPF_PAG     || '').substring(0,8)    
          let raiz_cns     = (data[0].CLI_CGCCPF_CNS     || '').substring(0,8)    
          let raiz_exped   = (data[0].CLI_CGCCPF_EXPED   || '').substring(0,8)  
          let raiz_rds     = (data[0].CLI_CGCCPF_RDS     || '').substring(0,8)    
          let raiz_tomador = (data[0].CLI_CGCCPF_TOMADOR || '').substring(0,8)
          let raiz_user    = userId_Token.substring(0,8)
          let ok_raiz =  (( raiz_user == raiz_dest ) || ( raiz_user == raiz_remet ) || ( raiz_user == raiz_receb ) || 
              ( raiz_user == raiz_pag ) || ( raiz_user == raiz_cns ) || ( raiz_user == raiz_exped ) || 
              ( raiz_user == raiz_rds ) || ( raiz_user == raiz_tomador ))

          if (!ok_raiz) {
             throw new Error(`Access ERRO - RAIZ do CNPJ pesquisado não pertence ao usuário de Login`)
          }

    }
}

async function set_trecho() {
  let data
  werror = 'set_trecho'
  data = await sqlQuery(`
    SELECT TRE.CODIGO   AS TRECHO
        ,TRE.ORIGEM     AS TRECHO_ORIGEM
        ,TRE.DESTINO    AS TRECHO_DESTINO
        ,ORIGEM.NOME    AS CIDADE_ORIGEM
        ,DESTINO.NOME   AS CIDADE_DESTINO
        ,ORIGEM.UF      AS UF_ORIGEM
        ,DESTINO.UF     AS UF_DESTINO
        ,ORIGEM.CODMUN  AS IBGE_ORIGEM
        ,DESTINO.CODMUN AS IBGE_DESTINO
        ,TRE.EMP_CODIGO_ENTREGA AS UNID_DESTINO
    FROM TRE
    LEFT JOIN CID ORIGEM ON ORIGEM.CODIGO = SUBSTRING(TRE.CODIGO, 1, 3)
    LEFT JOIN CID DESTINO ON DESTINO.CODIGO = SUBSTRING(TRE.CODIGO, 4, 3)
    WHERE TRE.CODIGO = '${wtrecho}'
  `)

  // caso tenha erro na consulta ao banco
  let { Erro } = data
  if (Erro) { 
       wsqlerr = Erro 
  }        

  // caso a consulta ao banco não volte com dados
  if (!data[0]) {       
        wunidest = '*'
  } else {
      //------------------------------------
        retorno.origemPrestacao.nome  = data[0].CIDADE_ORIGEM
        retorno.origemPrestacao.uf    = data[0].UF_ORIGEM
        retorno.origemPrestacao.ibge  = data[0].IBGE_ORIGEM
        retorno.destinoPrestacao.nome = data[0].CIDADE_DESTINO
        retorno.destinoPrestacao.uf   = data[0].UF_DESTINO
        retorno.destinoPrestacao.ibge = data[0].IBGE_DESTINO
        //------------------------------------
        wunidest = data[0].UNID_DESTINO
  }  
}

async function set_unid_destino() {
  let data
  werror = 'set_unid_destino'
  data = await sqlQuery(`
        SELECT EMP.CODIGO,  
          EMP.NOME,    
          EMP.ENDERECO,
          EMP.NUMERO,  
          EMP.BAIRRO,  
          CID.CODMUN AS IBGE,  
          CID.NOME AS CIDADE,    
          CID.UF      
        FROM EMP
        LEFT JOIN CID ON CID.CODIGO = EMP.CID_CODIGO
        WHERE EMP.CODIGO = '${wunidest}'
  `)
  
  // caso tenha erro na consulta ao banco
  let { Erro } = data
  if (Erro) { 
       wsqlerr = Erro 
  }        

  // Caso retornou dados
  if (data[0]) {       
      //------------------------------------
        retorno.unidadeDestino.sigla        = data[0].CODIGO   
        retorno.unidadeDestino.nome         = data[0].NOME     
        retorno.unidadeDestino.endereco     = data[0].ENDERECO 
        retorno.unidadeDestino.numero       = data[0].NUMERO   
        retorno.unidadeDestino.bairro       = data[0].BAIRRO   
        retorno.unidadeDestino.cidade       = {}
        retorno.unidadeDestino.cidade.ibge  = data[0].IBGE         
        retorno.unidadeDestino.cidade.nome  = data[0].CIDADE       
        retorno.unidadeDestino.cidade.uf    = data[0].UF       
      //------------------------------------
  }
}

async function set_local_entrega() {
  let data
  werror = 'set_local_entrega'
  data = await sqlQuery(`
        SELECT CLI.NOME,ENDERECO,NUMERO,BAIRRO,CID.NOME AS CIDADE,CID.UF,CID.CODMUN AS IBGE
        FROM CLI 
        LEFT JOIN CID ON CID.CODIGO = CLI.CID_CODIGO
        WHERE CGCCPF = '${wcnpjentrega}'
  `)

  // caso tenha erro na consulta ao banco
  let { Erro } = data
  if (Erro) { 
       wsqlerr = Erro 
  } else {
        // Caso retornou dados
        if (data[0]) {       
            //------------------------------------
                retorno.localEntrega.nome        = data[0].NOME
                retorno.localEntrega.endereco    = data[0].ENDERECO
                retorno.localEntrega.numero      = data[0].NUMERO
                retorno.localEntrega.bairro      = data[0].BAIRRO
                retorno.localEntrega.cidade      = {}
                retorno.localEntrega.cidade.nome = data[0].CIDADE
                retorno.localEntrega.cidade.uf   = data[0].UF
                retorno.localEntrega.cidade.ibge = data[0].IBGE
            //------------------------------------
        }    
  }
}

async function set_ocorrencias() {
  let data
  werror = 'set_ocorrencias'
  data = await sqlQuery(`
        SELECT OUN.*, OCO.NOME AS NOMEOCORRENCIA, MOT.NOME AS MOTORISTA  
        FROM OUN  
        LEFT JOIN OCO ON OCO.CODIGO=OUN.OCO_CODIGO  
        LEFT JOIN MOT ON MOT.PRONTUARIO = OUN.MOT_PRONTUARIO  
        WHERE TABELA='CNH' AND CHAVE='${wchave}'
        AND OCO.NAOENVIAEDI=0 
        ORDER BY DATA
  `)

  // caso tenha erro na consulta ao banco
  let { Erro } = data
  if (Erro) { 
       wsqlerr = Erro 
  }        

  //------------------------------------  
  let elem
  data.forEach((item, index)=>{
      elem = {} 
      elem.codigoInterno           = item.OCO_CODIGO 
      elem.codigoProceda           = item.OCO_CODIGO
      elem.descricaoOcorrencia     = (item.OCO_CODIGO == 99) ? item.DESCRICAO : item.NOMEOCORRENCIA
      elem.dataRegistro            = item.DATAOCO       
      retorno.ocorrencias.push(elem)  
  })
  //------------------------------------
}

/// ( PESQUISA COMPROVANTES)
async function set_comprovantes(doc) {
  werror = 'set_comprovantes'
  try {
    let documento =  doc
    let evidencia = await easydocs(documento)

    if (evidencia.ok==false){
        evidencia = await agileprocess(documento)
      } 

    if (evidencia.ok==true){
        retorno.comprovantes.push(evidencia.imagem)
    } else {
      retorno.comprovantes = []
    }   
  } catch (err) {
    console.log(err)
     wsqlerr = err
  }
}

try {

    // validaAcesso(userId_Token, wcnpj )

    await set_nf()
    await set_cnh() 
    await set_trecho() 
    await set_unid_destino() 
    await set_local_entrega() 
    await set_ocorrencias()
    
    let doc = wemp + wcnhserie + wctrc
    console.log('DOC:',doc)
    
    await set_comprovantes(doc)
    
    res.json(retorno).status(200) 

} catch (err) { 
    res.send({ "erro" : err.message, "rotina" : werror, "sql" : wsqlerr }).status(500) 
}  
}

module.exports = apiCliente
