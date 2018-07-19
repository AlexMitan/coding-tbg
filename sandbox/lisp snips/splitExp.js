function refine(exp='') {
    let refined = exp.replace('\n', ' ')
                     .replace(/\)/g, ' ) ')
                     .replace(/\(/g, ' ( ')
                     .replace(/ {2,}/g, ' ');
    let rawTokens = refined.split(' ');
    let i = 0;
    let refinedTokens = [];
    let listStarts = ['(', '\'(', '#\'('];
    
    while (i < rawTokens.length) {
        let tok = rawTokens[i];
        if (i+1 < rawTokens.length) {
            let combined = rawTokens[i] + rawTokens[i+1];
            if (listStarts.indexOf(combined) > -1) {
                tok = combined;
                i += 1;
            }
        }
        refinedTokens.push(tok);
        i += 1;
    }
    return refinedTokens;
}