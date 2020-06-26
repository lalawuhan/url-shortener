module.exports = function generateID() {
  let characters = "abdegjkmnpqrvwxyz23456789"; //all lowercase, remove common profanities + 1/0
  let IDlength = 6;
  let result = "";
  for (let i = 0; i < IDlength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
