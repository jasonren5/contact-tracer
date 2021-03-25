

export function seperateGrid(oldChunk, rowsFirst = true) {
    if ( !oldChunk ) {
        return {
            type: "error",
            value: oldChunk
        }
    }
    if ( !oldChunk[0] ) {
        return {
            type: "error",
            value: oldChunk
        }
    }
    const tl = oldChunk[0][0]
    const br = oldChunk[oldChunk.length -1 ][oldChunk[0].length - 1]

    if ( tl === br ) {
        return {
            type: "item",
            value: oldChunk
        }
    }

    var newChunks = [[]];

    console.log("====== beginning to process chunk =======")
    console.log(oldChunk)

    var chunk = oldChunk;

    if(!rowsFirst) {
        console.log("====== beginning to transpose chunk =======")
        chunk = transpose(oldChunk);
        console.log(chunk)
    }

    console.log("====== beginning to seperate chunk with "+chunk.length + " rows =======")
    for (var row = 0; row < chunk.length; row++) {
        var doSplit = true;
        console.log("====== beginning to check row with "+chunk[0].length + " cols =======")
        for (var col = 0; col < chunk[0].length; col++) {
            if(row + 1 === chunk.length) {
                doSplit = false;
            } else if (chunk[row][col] === chunk[row + 1][col]) {
                doSplit = false;
            }
        }
        const rowArray = chunk[row];
        console.log("Adding " + rowArray + " and then " + (doSplit ? "splitting." : "not splitting."))

        newChunks[newChunks.length - 1].push(rowArray);
        if (doSplit) {
            newChunks.push([])
        } 
    }

    var items = [];

    console.log("====== seperated into " + newChunks.length + " chunks =======")
    console.log(newChunks)
    newChunks.forEach((newChunk) => {
        const cleanChunk = (rowsFirst ? newChunk : transpose(newChunk));
        const item = seperateGrid(cleanChunk, !rowsFirst)
        items.push(item);
    })

    const type = (rowsFirst ? "rows" : "cols")

    return {
        type: type,
        value: items
    }
}

function transpose(matrix) {
    var newMatrix = [];
    console.log(matrix[0])
    console.log(matrix[0].length)
    for(var col = 0; col < matrix[0].length; col++) {
        var newRow = [];
        for(var row = 0; row < matrix.length; row++) {
            newRow.push(matrix[row][col]);
        }
        console.log("adding transposed row from col " + col);
        newMatrix.push(newRow);
    }
    return newMatrix;
}