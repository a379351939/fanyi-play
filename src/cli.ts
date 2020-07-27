const translate = require('./main')

const { program } = require('commander');

program
  .usage('<English>')
  .arguments('<English>')
  .action(async (English:string) => {
    console.log(await translate(English));
  });

program.parse(process.argv);

