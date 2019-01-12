var gridHtml = "";
var possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var board = [];

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
    checkForAnswers();
    drawBoard();
    checkIfDone();
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
            console.log("Found unique candidate = " + candidate + " at x = " + x + " | y = " + y);
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
    loadMediumBoard();

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

function drawBoard() {
    for (var tr = 0; tr < 9; tr++) {
        for (var td = 0; td < 9; td++) {
            var id = tr.toString() + td.toString();
            document.getElementById(id).innerHTML = board[tr][td].list + "<br/><strong>" + board[tr][td].answer + "</strong>";
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