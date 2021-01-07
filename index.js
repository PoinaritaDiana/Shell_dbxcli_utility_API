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
		try {
			if(!fs.existsSync(fisier1) || !fs.existsSync(fisier2)){
				res.send(`One of the files doesn't exist`)
			}
			else {
				fs.copyFile(fisier1, fisier2, ()=>{
					console.log(`Successfully copied ${fisier1} to ${fisier2}`)
					res.send('OK')
				})
			}
			
		}
		catch(e) {
			console.log(e)
			res.send('Something went wrong during copying...')
		}
		
	}
	else {
		res.send('Invalid file paths')
	}
})

app.post('/mv', urlencodedParser, (req,res) => {
	const oldPath = req.body.oldPath
	const newPath = req.body.newPath
	
	try{ 
		if(!fs.existsSync(oldPath)) {
			res.send(`File doesn't exist`)
		}
		else {
			fs.rename(oldPath, newPath, () => {
				if(!fs.existsSync(newPath)) {
					res.send(`Couldn't move to new path`)
				}
				else {
					console.log(`Successfully moved ${oldPath} to ${newPath}`)
					res.send('OK')
				}
				
			})
		}
		
	}
	catch(e) {
		res.send('NOT OK')
	}
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))