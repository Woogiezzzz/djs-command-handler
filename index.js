var Discord = require('discord.js');
var client = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"]});
var fs = require('fs')


client.once('ready', () => {
	console.log(`${client.user.username} is ready.`);
});

client.commands = new Discord.Collection()

var commandFolders = fs.readdirSync('./src/commands');

for (var folder of commandFolders) {
	var commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		var command = require(`./src/commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.on('message', async message => {
  if (message.author.bot) return
  var prefix = "prefix-here" 
  var args = message.content.slice(prefix.length).trim().split(' ')  
  var commandName = args.shift().toLowerCase()
  if (!message.content.startsWith(prefix)) return
  var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;
  try {
    command.execute(client, message, args);
	} catch(err) {
    console.log(err.stack)
  }
});

client.login(process.env.TOKEN);//make a .env file
