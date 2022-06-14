var gridHtml = "";
var possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var board = []; // board[row][column] means go down to the row, over to the column

function step() {
    deleteListsIfAlreadySolved();
    drawBoard();
    checkRows();
    drawBoard();
    checkColumns();
    drawBoard();
    checkSubGrids();
    drawBoard();
    checkSubGridOrphanCandidates();
    drawBoard();
    checkSubRowsForConstraints();
    drawBoard();
    checkSubColumnsForConstraints();
    drawBoard();
    checkRowsForUniquePossibilities();
    checkColumnsForUniquePossibilities();
    drawBoard();
    checkRowsForSimilarCandidatePairs();
    drawBoard();
    checkColumnsForSimilarCandidatePairs();
    drawBoard();
    checkForAnswers();
    drawBoard();
    //checkIfDone();
}

function checkIfDone() {
    var done = true;
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer == 0) {
                done = false;
            }
        }
    }
    if (done) {
        alert("You're done!");
    }
}

function deleteListsIfAlreadySolved() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer != 0) {
                board[y][x].list = [board[y][x].answer];
            }
        }
    }
}

function checkForAnswers() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].list.length == 1) {
                board[y][x].answer = [board[y][x].list[0]];
            }
        }
    }
}

// For each cell, remove from possible list any values found in that row
function checkRows() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer == 0) {
                board[y][x].list = Array.from(pruneByRow(y, x));
            }
        }
    }
}

// For each cell, remove from possible list any values found in that column
function checkColumns() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer == 0) {
                board[y][x].list = Array.from(pruneByColumn(y, x));
            }
        }
    }
}

// For each cell, remove from possible list any values found in that sub-grid
function checkSubGrids() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer == 0) {
                board[y][x].list = Array.from(pruneBySubGrid(y, x));
            }
        }
    }
}

// Check rows for candidate pairs
function checkRowsForSimilarCandidatePairs() {
    for (var row = 0; row < 9; row++) {
        checkRowForSimilarCandidatePairs(row);
    }
}

// Check columns for candidate pairs
function checkColumnsForSimilarCandidatePairs() {
    for (var column = 0; column < 9; column++) {
        checkColumnForSimilarCandidatePairs(column);
    }
}

// Check row for candidate pairs and remove those values from other cells in that row
function checkRowForSimilarCandidatePairs(row) {
    for (var column = 0; column < 9; column++) {
        var cell = board[row][column];
        if (cell.list.length == 2) {
            // check for another similar pair to the right
            for (var otherColumn = (column + 1); otherColumn < 9; otherColumn++) {
                if (candidateListsAreTheSame(board[row][column].list, board[row][otherColumn].list)) {
                    removeTheseCandidatesFromOtherCellsInRow(row, column, otherColumn);
                }
            }
        }
    }
}

// Check column for candidate pairs and remove those values from other cells in that column
function checkColumnForSimilarCandidatePairs(column) {
    for (var row = 0; row < 9; row++) {
        var cell = board[row][column];
        if (cell.list.length == 2) {
            // check for another similar pair to the below
            for (var otherRow = (row + 1); otherRow < 9; otherRow++) {
                if (candidateListsAreTheSame(board[row][column].list, board[otherRow][column].list)) {
                    removeTheseCandidatesFromOtherCellsInColumn(row, column, otherRow);
                }
            }
        }
    }
}

function removeTheseCandidatesFromOtherCellsInRow(row, column, otherColumn) {
    for (var i = 0; i < 9; i++) {
        if (i != column && i != otherColumn) { // we're looking at another cell
            board[row][i].list = Array.from(removePossibilitiesFromList(board[row][column].list, board[row][i].list));
        }
    }
}

function removeTheseCandidatesFromOtherCellsInColumn(row, column, otherRow) {
    for (var i = 0; i < 9; i++) {
        if (i != row && i != otherRow) { // we're looking at another cell
            board[i][column].list = Array.from(removePossibilitiesFromList(board[row][column].list, board[i][column].list));
        }
    }
}

function candidateListsAreTheSame(list1, list2) {
    var temp = true;
    if (list1.length != list2.length) {
        temp = false;
    } else {
        // check every item
        for (var i = 0; i < list1.length; i++) {
            if (list1[i] != list2[i]) {
                temp = false;
            }
        }
    }
    return temp;
}

function checkRowsForUniquePossibilities() {
    for (var row = 0; row < 9; row++) {
        checkRowForUniquePossibilities(row);
    }
}

function checkRowForUniquePossibilities(row) {
    // for each cell in row
    for (var column = 0; column < 9; column++) {
        // for each possibility in cell
        for (var j = 0; j < board[row][column].list.length; j++) {
            var candidate = board[row][column].list[j];
            if (candidateIsUniqueInRow(candidate, row, column)) {
                board[row][column].answer = candidate;
            }
        }
    }
}

function candidateIsUniqueInRow(candidateBeingChecked, rowBeingChecked, columnBeingChecked) {
    var tempCandidateIsUniqueInRow = true;
    // for each cell in row, except in column being checked
    for (var column = 0; column < 9; column++) {
        if (column != columnBeingChecked) {
            // for each candidate
            for (var candidate = 0; candidate < board[rowBeingChecked][column].list.length; candidate++) {
                if (board[rowBeingChecked][column].list[candidate] == candidateBeingChecked) {
                    tempCandidateIsUniqueInRow = false;
                }
            }
        }
    }
    return tempCandidateIsUniqueInRow;
}

function checkColumnsForUniquePossibilities() {
    for (var column = 0; column < 9; column++) {
        checkColumnForUniquePossibilities(column);
    } 
}

function checkColumnForUniquePossibilities(column) {
    // for each cell in column
    for (var row = 0; row < 9; row++) {
        // for each possibility in cell
        for (var j = 0; j < board[row][column].list.length; j++) {
            var candidate = board[row][column].list[j];
            if (candidateIsUniqueInColumn(candidate, row, column)) {
                board[row][column].answer = candidate;
            }
        }
    }
}

function candidateIsUniqueInColumn(candidateBeingChecked, rowBeingChecked, columnBeingChecked) {
    var tempCandidateIsUniqueInRow = true;
    // for each cell in column, except in row being checked
    for (var row = 0; row < 9; row++) {
        if (row != rowBeingChecked) {
            // for each candidate
            for (var candidate = 0; candidate < board[row][columnBeingChecked].list.length; candidate++) {
                if (board[row][columnBeingChecked].list[candidate] == candidateBeingChecked) {
                    tempCandidateIsUniqueInRow = false;
                }
            }
        }
    }
    return tempCandidateIsUniqueInRow;
}

// For each sub-row (a row within a sub-grid), check if it is constrained to 2 or 3 values
function checkSubRowsForConstraints() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x+=3) {
            checkSubRowForConstraints(y, x);
        }
    }
}

// For each sub-column (a column within a sub-grid), check if it is constrained to 2 or 3 values
function checkSubColumnsForConstraints() {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 9; y+=3) {
            checkSubColumnForConstraints(y, x);
        }
    }
}

// For a given sub-row, check the unique values and if it's 2 or 3, remove those values from the outer row
function checkSubRowForConstraints(y, x) {
    numberOfUnsolvedCellsInSubRow = getNumberOfUnsolvedCellsInSubRow(x, y);
    var uniquePossibilitiesInSubRow = getUniquePossibilitiesInSubRow(x, y);
    if (uniquePossibilitiesInSubRow.length == numberOfUnsolvedCellsInSubRow) {
        removePossibilitiesFromOtherSubRows(uniquePossibilitiesInSubRow, x, y);
    }
}

// For a given sub-column, check the unique values and if it's 2 or 3, remove those values from the outer column
function checkSubColumnForConstraints(y, x) {
    numberOfUnsolvedCellsInSubColumn = getNumberOfUnsolvedCellsInSubColumn(x, y);
    var uniquePossibilitiesInSubColumn = getUniquePossibilitiesInSubColumn(x, y);
    if (uniquePossibilitiesInSubColumn.length == numberOfUnsolvedCellsInSubColumn) {
        removePossibilitiesFromOtherSubColumns(uniquePossibilitiesInSubColumn, x, y);
    }
}

// Take a list of possible answers and remove those values from other lists
function removePossibilitiesFromOtherSubRows(possibilities, x, y) {
    // For each cell in the row
    for (var i = 0; i < 9; i++) {
        if (i != x && i != (x+1) && i != (x+2)) { // we're in an outer row
            board[y][i].list = Array.from(removePossibilitiesFromList(possibilities, board[y][i].list));
        }
    }
}

// Take a list of possible answers and remove those values from other lists
function removePossibilitiesFromOtherSubColumns(possibilities, x, y) {
    // For each cell in the column
    for (var i = 0; i < 9; i++) {
        if (i != y && i != (y+1) && i != (y+2)) { // we're in an outer column
            board[i][x].list = Array.from(removePossibilitiesFromList(possibilities, board[i][x].list));
        }
    }
}

// Return an array that is the difference b/w two arrays
function removePossibilitiesFromList(removeThese, removeFrom) {
    var tempList = Array.from(removeFrom);
    for (var i = 0; i < removeThese.length; i++) {
        for (var j = 0; j < tempList.length; j++) {
            if (tempList[j] == removeThese[i]) {
                tempList.splice(j,1);
            }
        }
    }
    return tempList;
}

function getUniquePossibilitiesInSubRow(x, y) {
    var listOfUniquePossibilities = [];
    for (var subRowX = x; subRowX < (x + 3); subRowX++) {
        if (board[y][subRowX].answer == 0) {
            listOfUniquePossibilities = listOfUniquePossibilities.concat(board[y][subRowX].list);
        }
    }
    let unique = [...new Set(listOfUniquePossibilities)];
    return unique;
}

function getUniquePossibilitiesInSubColumn(x, y) {
    var listOfUniquePossibilities = [];
    for (var subColumnY = y; subColumnY < (y + 3); subColumnY++) {
        if (board[subColumnY][x].answer == 0) {
            listOfUniquePossibilities = listOfUniquePossibilities.concat(board[subColumnY][x].list);
        }
    }
    let unique = [...new Set(listOfUniquePossibilities)];
    return unique;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getNumberOfUnsolvedCellsInSubRow(x, y) {
    var count = 0;
    for (var subRowX = x; subRowX < (x + 3); subRowX++) {
        if (board[y][subRowX].answer == 0) {
            count++;
        }
    }
    return count;
}

function getNumberOfUnsolvedCellsInSubColumn(x, y) {
    var count = 0;
    for (var subColumnY = y; subColumnY < (y + 3); subColumnY++) {
        if (board[subColumnY][x].answer == 0) {
            count++;
        }
    }
    return count;
}

// For a given cell, return a list of candidates, having pruned any that are already found in the same sub-grid
function pruneBySubGrid(y, x) {
    var tempList = Array.from(board[y][x].list);
    var upperLeftX = Math.floor(x / 3) * 3;
    var upperLeftY = Math.floor(y / 3) * 3;

    // for each candidate left on the list
    for (var i = 0; i < board[y][x].list.length; i++) {
        var listItemValue = board[y][x].list[i];
        // check all sub-grid cells for answers
        for (var sgy = upperLeftY; sgy < upperLeftY + 3; sgy++) {
            for (var sgx = upperLeftX; sgx < upperLeftX + 3; sgx++) {
                var answerToCheck = board[sgy][sgx].answer;
                if (listItemValue == answerToCheck && answerToCheck != 0) {
                    var index = tempList.indexOf(listItemValue);
                    tempList.splice(index, 1);
                }
            }
        }
    }
    return tempList;
}

// For each cell, check its candidates for uniqueness within the sub-grid
function checkSubGridOrphanCandidates() {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            if (board[y][x].answer == 0) {
                board[y][x].list = Array.from(pruneOrphanCandidatesBySubGrid(y, x));
            }
        }
    }
}

// For a given cell, check whether any candidates is unique within the sub-grid and if so, return a list of 1
function pruneOrphanCandidatesBySubGrid(y, x) {
    var tempList = Array.from(board[y][x].list);
    var upperLeftX = Math.floor(x / 3) * 3;
    var upperLeftY = Math.floor(y / 3) * 3;
    var candidateIsUnique = true;

    // for each candidate left on the list
    for (var i = 0; i < board[y][x].list.length; i++) {
        var candidate = board[y][x].list[i];
        // check all sub-grid cells for the same candidate value
        for (var sgy = upperLeftY; sgy < upperLeftY + 3; sgy++) {
            for (var sgx = upperLeftX; sgx < upperLeftX + 3; sgx++) {
                if (!(sgy == y && sgx == x)) { // not looking at itself
                    // for each candidate in the checked cell
                    for (var j = 0; j < board[sgy][sgx].list.length; j++) {
                        if (board[sgy][sgx].list[j] == candidate) {
                            candidateIsUnique = false;
                        }
                    }
                }
            }
        }
        if (candidateIsUnique) {
            tempList = [candidate];
            return tempList;
        }
        candidateIsUnique = true;
    }
    return tempList;
}

// For a given cell, return a list of candidates, having pruned any that are already found in the same row
function pruneByRow(y, x) {
    var tempList = Array.from(board[y][x].list);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < board[y][x].list.length; j++) {
            var listItemToCheck = board[y][x].list[j];
            var answerToCheck = board[y][i].answer;
            if (listItemToCheck == answerToCheck && answerToCheck != 0) {
                var index = tempList.indexOf(listItemToCheck)
                tempList.splice(index, 1);
            }
        }
    }
    return tempList;
}

// For a given cell, return a list of candidates, having pruned any that are already found in the same column
function pruneByColumn(y, x) {
    var tempList = Array.from(board[y][x].list);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < board[y][x].list.length; j++) {
            var listItemToCheck = board[y][x].list[j];
            var answerToCheck = board[i][x].answer;
            if (listItemToCheck == answerToCheck && answerToCheck != 0) {
                var index = tempList.indexOf(listItemToCheck)
                tempList.splice(index, 1);
            }
        }
    }
    return tempList;
}

function initSudoku() {
    generateBoardHtml();
    initBoardData();
    drawBoard();
}

function initBoardData() {
    for (var y = 0; y < 9; y++) {
        var cellList = [];
        for (var x = 0; x < 9; x++) {
            var cell = { list: [1, 2, 3, 4, 5, 6, 7, 8, 9], answer: 0 };
            cellList.push(cell);
        }
        board.push(cellList);
    }

    //loadSimpleBoard();
    //loadMediumBoard();
    loadExpertBoard();

    deleteListsIfAlreadySolved();
}

function loadSimpleBoard() {
    board[0][1].answer = 7;
    board[0][3].answer = 4;
    board[0][4].answer = 9;
    board[0][7].answer = 3;
    board[1][0].answer = 9;
    board[1][2].answer = 6;
    board[1][3].answer = 3;
    board[1][4].answer = 7;
    board[1][5].answer = 1;
    board[2][1].answer = 2;
    board[2][4].answer = 8;
    board[3][0].answer = 3;
    board[3][1].answer = 4;
    board[3][2].answer = 9;
    board[3][8].answer = 5;
    board[4][2].answer = 8;
    board[4][3].answer = 1;
    board[4][4].answer = 5;
    board[4][5].answer = 4;
    board[4][6].answer = 9;
    board[5][0].answer = 1;
    board[5][6].answer = 6;
    board[5][7].answer = 4;
    board[5][8].answer = 8;
    board[6][4].answer = 1;
    board[6][7].answer = 8;
    board[7][3].answer = 6;
    board[7][4].answer = 2;
    board[7][5].answer = 3;
    board[7][6].answer = 5;
    board[7][8].answer = 7;
    board[8][1].answer = 1;
    board[8][4].answer = 4;
    board[8][5].answer = 8;
    board[8][7].answer = 6;
}

function loadMediumBoard() {
    board[0][3].answer = 4;
    board[0][7].answer = 5;

    board[1][3].answer = 7;
    board[1][5].answer = 5;
    board[1][8].answer = 4;

    board[2][1].answer = 5;
    board[2][4].answer = 1;
    board[2][7].answer = 9;

    board[3][0].answer = 1;
    board[3][1].answer = 4;
    board[3][2].answer = 5;
    board[3][4].answer = 2;
    board[3][7].answer = 3;

    board[4][4].answer = 9;

    board[5][0].answer = 2;
    board[5][2].answer = 6;
    board[5][6].answer = 4;

    board[6][0].answer = 4;
    board[6][2].answer = 2;
    board[6][6].answer = 3;

    board[7][0].answer = 8;
    board[7][1].answer = 7;
    board[7][3].answer = 1;

    board[8][4].answer = 3;
    board[8][8].answer = 1;
}

function loadHardBoard() {
    board[0][0].answer = 7;
    board[0][1].answer = 5;
    board[0][3].answer = 2;
    board[0][5].answer = 1;

    board[1][0].answer = 8;
    board[1][3].answer = 4;
    board[1][7].answer = 5;

    board[2][0].answer = 1;
    board[2][2].answer = 2;
    board[2][3].answer = 8;
    board[2][4].answer = 3;
    board[2][8].answer = 4;

    board[3][0].answer = 5;
    board[3][5].answer = 7;
    board[3][7].answer = 2;

    board[4][1].answer = 4;
    board[4][3].answer = 3;
    board[4][7].answer = 9;
    board[4][8].answer = 1;

    board[5][2].answer = 1;
    board[5][6].answer = 3;

    board[6][1].answer = 7;

    board[7][6].answer = 8;
    board[7][8].answer = 3;

    board[8][2].answer = 8;
    board[8][4].answer = 4;
    board[8][6].answer = 2;
}

function loadExpertBoard() {
    board[0][3].answer = 7;
    board[0][4].answer = 2;
    board[0][5].answer = 4;

    board[1][0].answer = 1;
    board[1][4].answer = 9;

    board[2][0].answer = 9;
    board[2][2].answer = 6;
    board[2][4].answer = 3;

    board[3][0].answer = 5;
    board[3][1].answer = 8;
    board[3][7].answer = 6;

    board[4][5].answer = 7;
    board[4][7].answer = 3;

    board[5][3].answer = 8;
    board[5][6].answer = 9;

    board[6][2].answer = 2;
    board[6][3].answer = 3;
    board[6][8].answer = 7;

    board[7][1].answer = 9;
    board[7][6].answer = 4;
    board[7][8].answer = 2;

    board[8][2].answer = 4;
}

function drawBoard() {
    for (var tr = 0; tr < 9; tr++) {
        for (var td = 0; td < 9; td++) {
            var id = tr.toString() + td.toString();
            //document.getElementById(id).innerHTML = board[tr][td].list + "<br/><strong>" + board[tr][td].answer + "</strong>";
            if (board[tr][td].answer != 0) {
                document.getElementById(id).innerHTML = "<strong>" + board[tr][td].answer + "</strong>";
                document.getElementById(id).className = "table-success";
            }
        }
    }
}

function generateBoardHtml() {
    gridHtml += "<table class=\"table table-bordered table-sm\">";

    for (var tr = 0; tr < 9; tr++) {
        gridHtml += "<tr>";
        for (var td = 0; td < 9; td++) {
            var id = tr.toString() + td.toString();
            gridHtml += "<td id=" + id + " align=\"center\"></td>";
        }
        gridHtml += "</tr>";
    }

    gridHtml += "</table>";

    document.getElementById("grid").innerHTML = gridHtml;

    drawSubGridBorders();
}

function drawSubGridBorders() {
    for (var tr = 0; tr < 9; tr++) {
        for (var td = 0; td < 9; td++) {
            if (tr == 2 || tr == 5) {
                var id = tr.toString() + td.toString();
                document.getElementById(id).style.borderBottom = "5px solid black";
            }
            if (td == 2 || td == 5) {
                var id = tr.toString() + td.toString();
                document.getElementById(id).style.borderRight = "5px solid black";
            }
        }
    }
}