const { createSession } = require("./session");

const handleRegister = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  const user = await db
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          return trx("users").returning("*").insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json("unable to register"));

  return user[0];
};

const registerAuthentication = async (req, res, db, bcrypt) => {
  if (req.body) {
    const data = await handleRegister(req, res, db, bcrypt);
    const userWithToken = await createSession(data);

    return res.status(201).json(userWithToken);
  }
  return res.status(401).json("Missing credentials");
};

module.exports = {
  registerAuthentication: registerAuthentication,
};
