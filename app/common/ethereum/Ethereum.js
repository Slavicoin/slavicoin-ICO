const ethers = require('ethers');

const { encryptedWallet, password, contractAddress, abi } = require('../../../configuration/wallet');
const databaseService = require('app/database/database.service');
const logger = require('app/common/log/logger.service')

class Ethereum {
  static async create() {
    const provider = new ethers.providers.EtherscanProvider('homestead');
    const walletWithoutProvider = await ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWallet), password);

    const wallet = walletWithoutProvider.connect(provider);

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    return new Ethereum(provider, wallet, contract);
  }

  constructor(provider, wallet, contract) {
    this.provider = provider;
    this.wallet = wallet;
    this.contract = contract;
    this.numberOfDecimals = 18;
  }
  async checkTransaction(txHash) {
    const transaction = await this.provider.getTransaction('0x71f3a7d3d01086dd3575a71451f71ed752d08abb1518797a2e1295e6a8f2fed7');
    return transaction;
  }
  async checkBalance() {
    try{
      const balance = await this.contract.balanceOf('0x3d0d63432Db99E74A7Eb8fDE8B8eA8Cc3b5823f6');
      console.log(balance.toString());

    } catch(error) {
      console.log(error);
    }
  }
  async sendToken(address, value) {
    try {
      const valueToSend = ethers.utils.parseUnits(value.toString(), this.numberOfDecimals);
      const result = await this.contract.transfer(address, valueToSend);
    } catch(error) {
      logger.error('Error happened');
      logger.error(error);
    }
  }
  async getTransactions() {

  }
  async doClearing(scheduled) {

    const { database } = databaseService.get()
    const {rows} = await database.raw('SELECT * FROM "public"."configuration"');

    let startingBlock = 0;

    if(rows[0].currentBlock) {
      startingBlock = rows[0].currentBlock;
    } else {
      startingBlock = rows[0].defaultBlock;
    }
    const history = await this.provider.getHistory(this.wallet.address, startingBlock);

    const incomming = history.filter(item => !item.creates && item.to === this.wallet.address);

    incomming.forEach(item => {
      console.log(item.value.toString());
    });
  }
}

module.exports = Ethereum;
