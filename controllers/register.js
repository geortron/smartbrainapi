const handleRegister = (req, res, db, bcrypt)=> {
  const {email, name, password} = req.body;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  //console.log(hash);
	 db.transaction(trx => {
    	trx.insert({
          hash: hash,
          email: email
    	})
    	  .into('login')
    	  .returning('email')
    	  .then(loginEmail => {
    	  	 return trx('users')
    			  .returning('*')
    			  .insert({
      			 	name: name,
      			 	email: loginEmail[0],
      			 	joined: new Date()
    			  }).then(response=> {
              //console.log(response[0]);
    				  res.json(response[0]);
    			  })

        	  })
        	  .then(trx.commit)
        	  .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister : handleRegister
}