// @commit_stalker functions
exports.greeting = function(){
  console.log('hello');
}

// get all users from the team, and make
exports.getTeamUsers = function(users){
  usernames = [];

  function CreateUser(username, userId){
    this.username = username;
    this.userId = userId;
  }

  var tempArray = bot.getUsers()._value.members;

  tempArray.forEach(function(user){
    var tempUser = new CreateUser(user.name, user.id);

    usernames.push(tempUser);
  });

  var usernamesLength = usernames.length;
  console.log('getTeamUsers() completed - ' + usernamesLength + ' users found.');
}
