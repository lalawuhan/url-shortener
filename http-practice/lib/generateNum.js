let characters = "abdegjkmnpqrvwxyz23456789"; //all lowercase, remove common profanities + 1/0
let IDlength = 6;
module.exports = function generateID(data) {
  let result = generateRandomId();
  let checkDuplication = data.find((num) => num.id === result);
  if (checkDuplication !== undefined) {
    return generateID(data);
  }
  return result;
};

function generateRandomId() {
  let result = "";
  for (let i = 0; i < IDlength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
