const axios = require('axios')

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMTY4NTE3MzIwMDAyMDYiLCJpYXQiOjE2MTExNTI2NjEsImV4cCI6MTYxMTIzOTA2MX0.kBqiVQu__An3pjANsRFlYGEVDjrP9lBKPiNxCEgwINI"

const logRenovig =[
{ date:'Jan 20, 2021 11:42:20 AM UTC', taxid: '08252762417',  serie: '2', number: '53920', requestNumber: '54447', key: '35201216851732000206550020000539201100210184', requestKey: '35210116851732000206550020000544471100296050'},
{ date:'Jan 20, 2021 10:50:34 AM UTC', taxid: '10824015000128',  serie: '2', number: '55367', requestNumber: '55366', key: '35210116851732000206550020000553671100295722', requestKey: '35210116851732000206550020000553661100247470'},
{ date:'Jan 19, 2021 9:37:47 PM UTC', taxid: '08544755402',  serie: '2', number: '55459', requestNumber: '363609', key: '35210116851732000206550020000554591100202906', requestKey: '25210192660406000976550050003636091000199720'},
{ date:'Jan 19, 2021 8:43:06 PM UTC', taxid: '05999381452',  serie: '2', number: '55457', requestNumber: '54852', key: '35210116851732000206550020000554571100134035', requestKey: '35210116851732000206550020000548521100129857'},
{ date:'Jan 19, 2021 8:43:04 PM UTC', taxid: '03442953000106',  serie: '2', number: '55461', requestNumber: '54860', key: '35210116851732000206550020000554611100177608', requestKey: '35210116851732000206550020000548601100279079'},
{ date:'Jan 19, 2021 8:43:01 PM UTC', taxid: '03812425521',  serie: '2', number: '55471', requestNumber: '54267', key: '35210116851732000206550020000554711100056343', requestKey: '35210116851732000206550020000542671100199189'},
{ date:'Jan 19, 2021 8:42:58 PM UTC', taxid: '17399755000103',  serie: '2', number: '55477', requestNumber: '54623', key: '35210116851732000206550020000554771100197226', requestKey: '35210116851732000206550020000546231100175090'},
{ date:'Jan 19, 2021 8:42:46 PM UTC', taxid: '05115520419',  serie: '2', number: '55464', requestNumber: '54445', key: '35210116851732000206550020000554641100098939', requestKey: '35210116851732000206550020000544451100072913'},
{ date:'Jan 19, 2021 8:39:33 PM UTC', taxid: '03442953000106',  serie: '2', number: '55461', requestNumber: '54860', key: '35210116851732000206550020000554611100177608', requestKey: '35210116851732000206550020000548601100279079'},
{ date:'Jan 19, 2021 8:39:32 PM UTC', taxid: '88351637491',  serie: '2', number: '55478', requestNumber: '54859', key: '35210116851732000206550020000554781100260723', requestKey: '35210116851732000206550020000548591100275854'},
{ date:'Jan 19, 2021 8:39:28 PM UTC', taxid: '24547344191',  serie: '2', number: '55466', requestNumber: '54855', key: '35210116851732000206550020000554661100266925', requestKey: '35210116851732000206550020000548551100314397'},
{ date:'Jan 19, 2021 8:39:17 PM UTC', taxid: '03686556448',  serie: '2', number: '55448', requestNumber: '54831', key: '35210116851732000206550020000554481100308255', requestKey: '35210116851732000206550020000548311100057414'},
{ date:'Jan 19, 2021 8:39:16 PM UTC', taxid: '05115520419',  serie: '2', number: '55464', requestNumber: '51736', key: '35210116851732000206550020000554641100098939', requestKey: '35201216851732000206550020000517361100277084'},
{ date:'Jan 19, 2021 10:58:07 AM UTC', taxid: '83598880510',  serie: '2', number: '51730', requestNumber: '52593', key: '35201216851732000206550020000517301100105328', requestKey: '35201216851732000206550020000525931100042389'},
{ date:'Jan 18, 2021 5:19:57 PM UTC', taxid: '06015277475',  serie: '2', number: '53775', requestNumber: '53779', key: '35201216851732000206550020000537751100143301', requestKey: '35201216851732000206550020000537791100068147'},
{ date:'Jan 20, 2021 10:50:34 AM UTC', taxid: '10824015000128',  serie: '2', number: '55367', requestNumber: '55366', key: '35210116851732000206550020000553671100295722', requestKey: '35210116851732000206550020000553661100247470'},
{ date:'Jan 19, 2021 9:37:47 PM UTC', taxid: '08544755402',  serie: '2', number: '55459', requestNumber: '363609', key: '35210116851732000206550020000554591100202906', requestKey: '25210192660406000976550050003636091000199720'},
{ date:'Jan 19, 2021 8:43:06 PM UTC', taxid: '05999381452',  serie: '2', number: '55457', requestNumber: '54852', key: '35210116851732000206550020000554571100134035', requestKey: '35210116851732000206550020000548521100129857'},
{ date:'Jan 19, 2021 8:43:04 PM UTC', taxid: '03442953000106',  serie: '2', number: '55461', requestNumber: '54860', key: '35210116851732000206550020000554611100177608', requestKey: '35210116851732000206550020000548601100279079'},
{ date:'Jan 19, 2021 8:43:01 PM UTC', taxid: '03812425521',  serie: '2', number: '55471', requestNumber: '54267', key: '35210116851732000206550020000554711100056343', requestKey: '35210116851732000206550020000542671100199189'},
{ date:'Jan 19, 2021 8:42:58 PM UTC', taxid: '17399755000103',  serie: '2', number: '55477', requestNumber: '54623', key: '35210116851732000206550020000554771100197226', requestKey: '35210116851732000206550020000546231100175090'},
{ date:'Jan 19, 2021 8:42:46 PM UTC', taxid: '05115520419',  serie: '2', number: '55464', requestNumber: '54445', key: '35210116851732000206550020000554641100098939', requestKey: '35210116851732000206550020000544451100072913'},
{ date:'Jan 19, 2021 8:39:33 PM UTC', taxid: '03442953000106',  serie: '2', number: '55461', requestNumber: '54860', key: '35210116851732000206550020000554611100177608', requestKey: '35210116851732000206550020000548601100279079'},
{ date:'Jan 19, 2021 8:39:32 PM UTC', taxid: '88351637491',  serie: '2', number: '55478', requestNumber: '54859', key: '35210116851732000206550020000554781100260723', requestKey: '35210116851732000206550020000548591100275854'},
{ date:'Jan 19, 2021 8:39:28 PM UTC', taxid: '24547344191',  serie: '2', number: '55466', requestNumber: '54855', key: '35210116851732000206550020000554661100266925', requestKey: '35210116851732000206550020000548551100314397'},
{ date:'Jan 19, 2021 8:39:17 PM UTC', taxid: '03686556448',  serie: '2', number: '55448', requestNumber: '54831', key: '35210116851732000206550020000554481100308255', requestKey: '35210116851732000206550020000548311100057414'},
{ date:'Jan 19, 2021 8:39:16 PM UTC', taxid: '05115520419',  serie: '2', number: '55464', requestNumber: '51736', key: '35210116851732000206550020000554641100098939', requestKey: '35201216851732000206550020000517361100277084'},
{ date:'Jan 19, 2021 10:58:07 AM UTC', taxid: '83598880510',  serie: '2', number: '51730', requestNumber: '52593', key: '35201216851732000206550020000517301100105328', requestKey: '35201216851732000206550020000525931100042389'},
{ date:'Jan 18, 2021 5:19:57 PM UTC', taxid: '06015277475',  serie: '2', number: '53775', requestNumber: '53779', key: '35201216851732000206550020000537751100143301', requestKey: '35201216851732000206550020000537791100068147'}
]

const config = { headers: { Authorization: `Bearer ${token}`  } }
const url    = 'http://siconline.termaco.com.br:5000/api/apiCliente'

logRenovig.forEach((i)=>{
	let params = { valoresParametros: [ i.taxid, i.number, i.serie ] }
	axios.post( url, params, config ).then((resposta)=>{
		let dados = resposta.data
		let NF_OK,CHAVE_OK
		
		console.log('============================================================================================================================')
		console.log(`Chamada (RENOVIG) = TaxID : ${i.taxid}, Numero: ${i.number}, Série: ${i.serie}, Chave NF: ${i.key}`)
		console.log('Retorno (API Termaco) =',dados)
		
		NF_OK     = (dados.notaFiscal.numero === i.number)
		CHAVE_OK  = (dados.notaFiscal.chaveNFe === i.key)
		
		console.log('Resultado do teste:')		
		console.log('- Numero NF OK:',NF_OK,'  = ',dados.notaFiscal.numero,i.number)
		console.log('- Chave  NF OK:',CHAVE_OK,'  = ',dados.notaFiscal.chaveNFe,i.key)
		console.log('#')		

		
	}).catch(err=>console.log('ERRO:',err.response.status))
})
