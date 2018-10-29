

const SHA256 = require('crypto-js/sha256');
//const leveldb = require('./levelSandbox');
var LevelSandbox = require('./levelSandbox')
var levelInst = new LevelSandbox.LevelSandbox();

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""

    }
}



class Blockchain{
  constructor(){

      this.getBlockHeight().then((height) => {
          if (height < 0) {
              let newBlock = new Block("Genesis block ");
              this.addBlock(newBlock).then(() => console.log("Genesis block added!"));
          }
      });
  }


  async addBlock(newBlock){

      const height = await this.getBlockHeight();
      newBlock.height = height + 1;


      newBlock.time = new Date().getTime().toString().slice(0, -3);


      if (newBlock.height > 0) {
          const prevBlock = await this.getBlock(height);
          newBlock.previousBlockHash = prevBlock.hash;
          console.log(`Previous hash: ${newBlock.previousBlockHash}`);

          console.log(`the time stamp is:${newBlock.time}`)
          console.log(`height of the block is:${newBlock.height}`)
      }

      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      console.log(`New hash: ${newBlock.hash}`);

      await levelInst.addBlock(newBlock.height, JSON.stringify(newBlock));
  }


   async getBlockHeight(){
        return await levelInst.getBlockHeight();
    }


  async getBlock(blockHeight){

        return JSON.parse(await levelInst.getBlock(blockHeight));
    }


    async validateBlock(blockHeight){

      let block = this.getBlock(blockHeight);

      let blockHash = block.hash;

      block.hash = '';

      let validBlockHash = SHA256(JSON.stringify(block)).toString();

      if (blockHash == validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }


    async validateChain(){
      let errorLog = [];
      let blockhash ='';
      const height = await this.getBlockHeight();
      for (var i = 0; i < height; i++) {
        let block = await this.getBlock(i);

        if (!this.validateBlock(i))errorLog.push(i);
        if (block.previousBlockHash != blockhash){
          errorLog.push(i)
        }
        blockhash = block.hash

      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}}

let blockChain = new Blockchain();

(function theLoop(i) {
    setTimeout(() => {
        blockChain.addBlock(new Block(`Test data ${i}`)).then(() => {

            i++;
            if (i < 10) theLoop(i);
        });

    }, 1000);
})(0);;




