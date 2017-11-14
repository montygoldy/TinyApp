module.exports = {

  // function to generate random number

  generateRandomString: function () {
    return Math.random().toString(36).substring(2, 8);
  }

}