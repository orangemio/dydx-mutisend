const Solo = require('@dydxprotocol/solo');

const fs = require('fs');
const readline = require('readline');
let solo;

const infura = `https://kovan.infura.io/v3/b6f0f1c1788e452d83b17d1d2d3cf4e3`
const filePath = `./20201226022925_addresses_with_keys.txt`
const network = Solo.Networks.KOVAN
const defaultGasPrice = 50000000000 //WEI 
const depositAmount = new Solo.BigNumber('1e16') //0.01 ETH




const accounts = [];
const accountsWithKey = [];

  async function processLineByLine() {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      const arr = line.split( ',' );
      accounts.push(arr[0]);
      accountsWithKey.push({
        address:arr[0],
        privateKey:`0x${arr[1]}`
      })
    }
  }


  async function desposit(address) {
    const despositResult = await solo.standardActions.deposit({
      accountOwner: address,
      marketId: Solo.MarketId.ETH,
      accountNumber: Solo.AccountNumbers.SPOT,
      amount: depositAmount
    });
    // GAS USED: 160,000 
    console.log(`Address: ${address} deposit : `+ despositResult.transactionHash)
  }


  async function withdraw(address) {
    const withdrawResult = await solo.standardActions.withdrawToZero({
      accountOwner: address,
      marketId: Solo.MarketId.ETH,
      accountNumber: Solo.AccountNumbers.SPOT
    });
    // GAS USED: 160,000 
    console.log(`Address: ${address} withdraw : `+withdrawResult.transactionHash)
  }



async function  main(){

  await processLineByLine();


  solo = new Solo.Solo(
    infura,
    network,
    {
      accounts: accountsWithKey,
      defaultGasPrice:defaultGasPrice //WEI
    },
  );
  
  accounts.forEach( async (v, i) => {
  
    await desposit(v);

    await withdraw(v);
    
  }
  );

}

main()



