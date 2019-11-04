const handleSignin = (db, bcrypt)=> (req, res) =>{
   console.log(req.body);
   const {email, password} = req.body;  
   console.log(email);
   if (!email || !password) {
    return res.status(400).json('incorrect form submission');
   };
   db.select('*').from('login')
      .where('email', '=', email)
      .then(data => {
          var isValid = bcrypt.compareSync(password, data[0].hash);
         // console.log(data[0].hash);
          console.log(isValid);
          //console.log(req.body.password);
          if (isValid) {
            return db.select('*').from('users')
             .where('email', '=', email)
             .then(user =>  {
              //console.log(user)
              res.json(user[0])
             })
              .catch(err=> {
                      console.log(err) 
                      res.status(400).json('unable to get user')
                     })
          } else{
            console.log('error');
            res.status(400).json('wrong credentials')
          }
      })
       .catch(err => {
                console.log(err) 
               res.status(400).json('wrong credentials')
            })
   
}

module.exports = {
  handleSignin : handleSignin
}