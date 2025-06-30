const spawn = require('cross-spawn');

const args = process.argv.slice(2); // e.g. --serve
const result = spawn.sync('npx', ['webpack', ...args], {
  stdio: 'inherit',
  shell: true,
});

if (result.error) {
  console.error('Error running webpack:', result.error);
  process.exit(1);
}
