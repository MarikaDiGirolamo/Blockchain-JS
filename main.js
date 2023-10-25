//importo la libreria cryptojs
const SHA256 = require('crypto-js/sha256');

//creo la classe Block e definisco il construttore - primo passo
class Block {
    constructor(index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){ //devo installare la libreria cryptojs per avere a disposizione la cartella con gli hashes(npm install --save crypto-js)
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

//creo un'altra classe per la gestione e inizializzazione del blockchain
class Blockchain {
    constructor(){
        this.chain =[this.createGenesisBlock()];
        // this.difficulty = 2;
    }

    //creo un metodo per genereare il genesis block
    createGenesisBlock(){
        return new Block(0, "01/01/2023", 'Genesis Block', "0"); //essendo il primo blocco devo impostare il numero di index e l'ultimo valore a 0
    }

    getLatestBlock(){ //restituisce l'ultimo blocco della blockchain
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){ //mi permette di aggiungere un nuovo blocco nella blockchain
        newBlock.previousHash = this.getLatestBlock().hash; //in questo modo requesto l'hash del blocco precedente
        newBlock.hash = newBlock.calculateHash(); //in questo modo calcolo e richiedo l'hash del nuovo blocco
        this.chain.push(newBlock); //aggiungo il nuovo blocco nella blockchain
    }

    isChainValid(){ //restituisce true se la blockchain è valida, false se non lo è. Mi serve per verificare l'integrita della blockchain
        for(let c = 1; c < this.chain.length; c++){ //non inizio dall'index 0 perchè corrisponde al Genesis Block
            const currentBlock = this.chain[c];
            const previousBlock = this.chain[c - 1];

            //creo la condizione che si vuole verificare se il blocco corrente è valido
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true; //la blockchain funziona 
    }
}


let myBlockchain = new Blockchain();
myBlockchain.addBlock(new Block(1, "09/10/2023", {amount: 4})); //aggiungo un mio blocco nella blockchain
myBlockchain.addBlock(new Block(4, "12/10/2023", {amount: 5})); 
myBlockchain.addBlock(new Block(2, "10/10/2023", {amount: 10}));
myBlockchain.addBlock(new Block(3, "11/10/2023", {amount: 7})); 

console.log('Is My Block Valid?' + myBlockchain.isChainValid()); //controllo che la blockchain sia valida, runno di nuovo il comando in terminale node main.js

//provo a cambiare i dati al secondo blocco
myBlockchain.chain[1].data = {amount: 100};
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash(); //in questo modo calcolo e richiedo l'hash del blocco di cui ho provato a cambiare i dati. Non funzionerà perchè il previousHash non corrisponde a quello dell'ultimo blocco.
console.log('Is My Second Block Valid?' + myBlockchain.isChainValid()); //controllo di nuovo se la blockchain è valida

//console.log(JSON.stringify(myBlockchain, null, 4)); //per far si che si veda la blockchain a terminale devo scrivere il comando node main.js