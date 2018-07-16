function genMat(w, h, init) {
    var mat = [];
    for (var y = 0; y < h; y++) {
        mat.push([]);
        for (var x = 0; x < w; x++) {
            mat[y].push(init || 0);
        }
    }
    return mat;
}

let fieldOld = genMat(10, 5, 0);
let fieldNew = genMat(10, 5, 0);

fieldOld[3][3] = 6;
fieldOld[3][6] = 9;
fieldOld[1][4] = 9;
function spreadProb(fuel) {
    return Math.random() < (fuel / 9);
}
console.log(fieldOld);

let w = 10;
let h = 5;

setInterval(() => {

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            let fuel = fieldOld[y][x];
            fieldNew[y][x] = Math.max(0, fuel - 0.35);
            for (let [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                let nx = x + dx;
                let ny = y + dy;
                // console.log(nx, ny);
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    if (spreadProb(fuel)) {
                        fieldNew[ny][nx] = fieldNew[y][x] * 0.7;
                    }
                }
            }
        }
    }
    console.log("-".repeat(w + 2));
    for (var y = 0; y < h; y++) {
        let str = "|";
        for (var x = 0; x < w; x++) {
            str += fieldNew[y][x] > 0 ? Math.floor(fieldNew[y][x]) : " ";
        }
        str += '|'
        console.log(str);
    } 
    console.log("-".repeat(w + 2));
            // console.log(fieldNew);
    fieldOld = fieldNew;
}, 200);