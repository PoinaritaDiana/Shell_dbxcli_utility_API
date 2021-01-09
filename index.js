const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const formidable = require('formidable')
// urlencodedParser -> for x-www-form-urlencoded

app.post('/cp',urlencodedParser, (req,res) => {
	const file1 = req.body.file1
	const file2 = req.body.file2

	if(file1 && file2) {
		try {
			if(!fs.existsSync(file1) || !fs.existsSync(file2)){
				res.send(`One of the files doesn't exist`)
			}
			else {
				fs.copyFile(file1, file2, (err)=>{
					if(err) {
						res.send(err.code)
					}

					else {
						console.log(`Successfully copied ${file1} to ${file2}`)
						res.send('OK')
					}
					
					
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
			fs.rename(oldPath, newPath, (err) => {
				if(err){
					res.send(err.code)
				}
				else {
					if(!fs.existsSync(newPath)) {
						res.send(`Couldn't move to new path`)
					}
					else {
						console.log(`Successfully moved ${oldPath} to ${newPath}`)
						res.send('OK')
					}
				}
				
				
			})
		}
		
	}
	catch(e) {
		res.send('Something went wrong...')
	}
})



app.post('/mkdir', urlencodedParser, (req, res) => {
	const pathDir = req.body.pathDir
	try {
		fs.mkdir(pathDir, { recursive: true }, (err) => {
  			if (err) {
  				res.send(err.code)

  			}
  			else {
  				console.log(`Successfully created directory ${pathDir}`)
  				res.send('OK')
  			}
  			
		});
	}
	catch(e) {
		res.send('Something went wrong...')
	}
})

app.post('/rm', urlencodedParser, (req, res) => {
	const pathRm = req.body.pathRm
	try {
		fs.rm(pathRm, (err) => {
			if (err) {
				res.send(err.code)
			}
			else {
				console.log(`Successfully removed file at ${pathRm}`)
				res.send('OK')
			}
			
		})
	}
	catch(e) {
		res.send('Something went wrong')
	}
})

app.post('/put', (req, res) => {
	const form = new formidable.IncomingForm();
    
    form.parse(req, (err, fields, files) => {

    	for(let filename in files) {
    		fs.rename(`./${filename}`, `${fields.path}/${files[filename].name}`, (err) => {
    			if (err) {
    				console.log(err)
    				res.send(err.code)
    			}
    			else {
    				res.send('OK')
    			}
    		})
    	}
    	
    });

    form.on('fileBegin', (name,file) => {
    	if(file && file.name !="") {
    		file.path = './' + name
    	}
    })

    form.on('file', (name, file) => {

    })

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))