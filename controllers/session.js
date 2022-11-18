const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (email) => {
  const jwtPayload = { email };
  const token = jwt.sign(jwtPayload, "SECRET", { expiresIn: "2 days" });
  return token;
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token, user };
    })
    .catch(console.log);
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

module.exports = {
  redisClient,
  signToken,
  setToken,
  createSession,
  getAuthTokenId,
};
