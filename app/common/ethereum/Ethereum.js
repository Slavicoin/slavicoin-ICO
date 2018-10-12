const ethers = require('ethers');

const { encryptedWallet, password, contractAddress, abi } = require('../../../configuration/wallet');

class Ethereum {
  static async create() {
    const provider = ethers.getDefaultProvider();
    const wallet = await ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWallet), password);

    const contract = new ethers.Contract(contractAddress, abi, provider);

    return new Ethereum(provider, wallet, contract);
  }
  constructor(provider, wallet, contract) {
    this.provider = provider;
    this.wallet = wallet;
    this.contract = contract;
  }
  async checkTransaction(txHash) {

  }
  async checkBalance() {

    try{
      const balance = await this.contract.balanceOf('0x3d0d63432Db99E74A7Eb8fDE8B8eA8Cc3b5823f6');
      console.log(balance.toString());

    } catch(error) {
      console.log(error);
    }
  }
}

module.exports = Ethereum;
