const readline = require('readline');
const fs = require('fs');
const https = require('https');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('Enter Crypto Name: ', (cryptoName) => {
	https
		.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=usd`,
			(resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					console.log(`Price in USD: ${JSON.parse(data)[cryptoName]['usd']}`);
					fs.appendFile(
						`./${cryptoName}Prices.txt`,
						`\nDate: ${Date()} \nPrice in USD: ${
							JSON.parse(data)[cryptoName]['usd']
						}\n`,
						function (err) {
							if (err) {
								return console.log(err);
							}
							console.log('The file was saved!');
							process.exit(0);
						}
					);
				});
			}
		)
		.on('error', (err) => console.error(err.message));
});
