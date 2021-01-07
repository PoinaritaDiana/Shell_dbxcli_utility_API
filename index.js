const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// urlencodedParser -> for x-www-form-urlencoded

app.post('/cp',urlencodedParser, (req,res) => {
	const fisier1 = req.body.fisier1
	const fisier2 = req.body.fisier2

	if(fisier1 && fisier2) {
		fs.copyFile(fisier1,fisier2,()=>{
			console.log(`Successfully copied ${fisier1} to ${fisier2}`)
			res.send('OK')
		})
	}
	else {
		res.send('NOT OK')
	}
})

app.post('/mv', urlencodedParser,(req,res) => {

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))