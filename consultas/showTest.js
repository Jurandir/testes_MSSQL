async function showTest( req, res ) {

    if ( req.method == 'POST' ) {
		
        console.log(req.body)
        res.json(req.body).status(200);
		
	}
    else if ( req.method == 'GET' ) {
        
		console.log(req.body)
        res.json(req.query).status(200);
		
    } else {
        res.json({ erro: "ERRO" }).status(400);
    }
    
}

module.exports = showTest