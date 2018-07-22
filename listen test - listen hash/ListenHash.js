class ListenHash {
    constructor(hash) {
        this.hash = hash;
    }
    copy() {
        return ListenHash.addHashes(this.hash);
    }
    add(...others) {
        this.hash = ListenHash.addHashes(this, ...others);
    }
    sub(...others) {
        this.hash = ListenHash.subtractHashes(this, ...others);
    }
    static addHashes(...hashes) {
        let finalHash = {};
        for (let hash of hashes) {
            for (let key in hash) {
                if (hash.hasOwnProperty(key)) {
                    if (finalHash[key] === undefined) {
                        finalHash[key] = hash[key]; 
                    } else {
                        finalHash[key] += hash[key];
                    }
                }
            }
        }
        return finalHash;
    }
    static subtractHashes(hash1, ...hashes) {
        let finalHash = hash1;
        for (let hash of hashes) {
            for (let key in hash) {
                if (hash.hasOwnProperty(key)) {
                    if (finalHash[key] !== undefined) {
                        finalHash[key] -= hash[key];
                    }
                    if (finalHash[key] === 0) delete finalHash[key];
                }
            }
        }
        return finalHash;
    }
}

module.exports = { ListenHash };