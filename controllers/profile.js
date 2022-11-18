const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        // res.json({
        //   name: "suraj",dani walker
        //   age: 23,
        //   rollNo: 91700103194,
        // });
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);

  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name })
    .returning("*")
    .then((resp) => {
      if (resp) {
        return res.status(200).json(resp);
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch((err) => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
};
