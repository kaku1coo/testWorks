var FIELD_W = 300, FIELD_H = 600; // fieldの幅、高さ
var COLS = 10, ROWS = 20; // fieldの列の数、行の数
var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
var canvas = document.getElementById("field"); // html内のfieldのidを代入
var ctx = canvas.getContext("2d");
var current_x = 3, current_y = 0; // 真ん中にテトリミノを表示されるよう定義
var current_mino; // 移動中のテトリミノ
var field = []; // 固定したブロックを保持しておく関数

// 初期値としてROWSとCOLSの値を全てOにする
for (var y = 0; y < ROWS; y++) {
  field[y] = [];
  for (var x = 0; x < COLS; x++) {
    field[y][x] = 0;
  }
}

current_mino = newMino();
render(); // 初めの描写
setInterval(tick, 500); // 0.5秒毎に繰り返し

// テトリミノの動きに関する関数
function render() {
  ctx.clearRect(0, 0, FIELD_W, FIELD_H); // 一度描写したブロックを消す
  ctx.strokeStyle = "black";
  // field[]に保存されたミノを描写する
  for (var y = 0; y < ROWS; y++){
    for (var x = 0; x < COLS; x++){
      drawBlock(x, y, field[y][x]);
    }
  }
  // テトリミノを描写する
  for (var y = 0; y < 4; y++) { // ミノの縦幅は最大4行のため y = 0,1,2,3のみ
    for (var x = 0; x < 4; x++) { // ミノの横幅は最大4行のため x = 0,1,2,3のみ
      drawBlock(current_x + x, current_y + y, current_mino[y][x]);
    }
  }
}

// テトリミノの塗りつぶし、表示に関する関数
function drawBlock(x, y, block) {
  if (block) {
    // 塗りつぶす色を指定
    ctx.fillStyle = COLORS[block - 1];
    // 指定した色で塗りつぶす
    ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H -1);
    ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
  }
}

// テトリミノの描写に関しての関数
function tick() {
  // trueの場合は下に移動、falseの場合は下に固定し次のミノの出現場所を指定する
  if (canMove(0, 1)) {
    current_y++; // 下に移動
  } else {
    fix(); // canMove()がfalseならfix()を実行しミノを下に固定する
    clearRows();
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
  }
  render();　// 再描写
}

// テトリミノの下固定に関する関数
function fix() {
  for (var y = 0; y < 4; ++y) {
    for (var x =0; x < 4; ++x) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x + x] = current_mino[y][x]; // 現在のミノの座標をfieldに代入
      }
    }
  }
}

// テトリミノが動ける場合はtrue、動けない場合はfalseを送る関数
function canMove(move_x, move_y, move_mino) { // 現在の位置からの動きを引数とする
  var next_x = current_x + move_x; // 次に動こうとするx座標
  var next_y = current_y + move_y; // 次に動こうとするy座標
  var next_mino = move_mino || current_mino // ミノの現在座標
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (next_mino[y][x]) {
        // ミノが下の枠を超えている、または下にすでに固定化されたミノがある場合falseを返す
        if (next_y + y >= ROWS
              || next_x + x < 0 // 左端を超えていたら
              || next_x + x >= COLS // 右端を超えていたら
              || field[next_y + y][next_x + x]) {
          return false;
        }
      }
    }
  }
  return true;
}

// 下の行から順に全ての行が揃った時、揃った行を消す関数
function clearRows() {
  // yが大きい方（下）から判定する
  for (var y = ROWS - 1; y >= 0; y--) {
    var fill = true; // 全て埋まっているか
    for (var x = 0; x < COLS; x++) {
      // 0のブロックがあれば
      if (field[y][x] == 0) {
        fill = false
        break;
      }
    }
    if (fill) {
      // 埋まっている行の上の行を一つ下にずらす
      for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < COLS; x++) {
          field[v + 1][x] = field[v][x];
        }
      }
      y++;
    }
  }
}

// キーボードの方向キーの動き
document.body.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // ←キー
      // move left 左に動けるかどうか
      if (canMove(-1, 0)){
        current_x--;
      }
      break;
    case 39: // →キー
      // move right 右に動けるかどうか
      if (canMove(1, 0)){
        current_x++;
      }
      break;
    case 40: // ↓キー
      // move down 下に動けるかどうか
      if (canMove(0, 1)){
        current_y++;
      }
      break;
    case 38: // ↑キー
      // rotate 回転するかどうか
      rotated = rotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
      }
      break;
  }
  render();
}
