const handleRegister = (req, res, db, bcrypt) => {						/*Durch Verknüpfung in server.js können hier die entsprechendne Funktionen gerufen werden*/
	const { email, name, password } = req.body;
	if(!email || !name || !password) {
		return res.status(400).json('inccorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {											/*um Daten in zwei SQL Tabellen zu bringen*/
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			returning('email')
			.then(loginEmail=> {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],							/*weil loginEmail ein Array ist*/
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);	
				})
			})
			.then(trx.commit)										/*um Daten auch wirklich in DB zu bringen*/
			.catch(trx.rollback)								/*bei Fehler werden Daten nicht in DB übertragen*/
		})
		.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};