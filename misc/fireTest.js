function genMat(w, h, init) {
    let mat = [];
    for (let y = 0; y < h; y++) {
        mat.push([]);
        for (let x = 0; x < w; x++) {
            mat[y].push(init || 0);
        }
    }
    return mat;
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

let fieldOld = genMat(20, 10, 0);
let fieldNew = genMat(20, 10, 0);

// fieldOld[3][3] = 6;
// fieldOld[3][6] = 9;
// fieldOld[1][4] = 9;
function spreadProb(fuel, max) {
    return Math.random() < (fuel / max);
}
console.log(fieldOld);

let w = 20;
let h = 10;
let ctr = 0;
setInterval(() => {
    // if (Math.random() < 0.1) {
    //     fieldNew[randomInt(1, h-2)][randomInt(1, w-2)] += randomInt(5, 9);
    // }
    // if (Math.random() < 0.1) {
    //     fieldNew[randomInt(1, h-2)][randomInt(1, w-2)] += randomInt(5, 9);
    // }
    if (ctr++ % 10 == 0) {
        fieldOld[randomInt(1, h-2)][randomInt(1, w-2)] += randomInt(4, 4);
    }
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            // fire on tile
            let fire = fieldOld[y][x];
            // reduce fire on tile
            // fieldNew[y][x] = Math.max(0, fire * 0.3 - 0.02);
            fieldNew[y][x] = Math.max(0, fire);
            for (let [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                let nx = x + dx;
                let ny = y + dy;
                // if within boundaries
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    // spread fire
                    // if (spreadProb(fire, 10)) {
                    //     fieldNew[ny][nx] += fieldNew[y][x] * 0.5 + Math.random() * 2;
                    // }
                    fieldNew[ny][nx] = fire;
                }
            }
        }
    }
    // print code
    console.log("-".repeat(w + 2));
    for (let y = 0; y < h; y++) {
        let str = "|";
        for (let x = 0; x < w; x++) {
            str += fieldNew[y][x] > 0 ? Math.floor(fieldNew[y][x]) : " ";
        }
        str += '|'
        console.log(str);
    } 
    console.log("-".repeat(w + 2));
            // console.log(fieldNew);
    fieldOld = fieldNew;
}, 400);