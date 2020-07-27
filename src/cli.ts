const translate = require('./main')

const { program } = require('commander');

program
  .command('fanyi [english]')
  .description('to fan yi dickhead')
  .action(async (english) => {
    console.log(await translate(english));
  });

program.parse(process.argv);

