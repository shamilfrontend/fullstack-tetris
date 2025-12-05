import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { scoreService } from '../services/scoreService';

// Фигуры Тетриса (тетромино)
const TETROMINOES = {
  I: [
    [[1, 1, 1, 1]]
  ],
  O: [
    [[1, 1],
     [1, 1]]
  ],
  T: [
    [[0, 1, 0],
     [1, 1, 1]]
  ],
  S: [
    [[0, 1, 1],
     [1, 1, 0]]
  ],
  Z: [
    [[1, 1, 0],
     [0, 1, 1]]
  ],
  J: [
    [[1, 0, 0],
     [1, 1, 1]]
  ],
  L: [
    [[0, 0, 1],
     [1, 1, 1]]
  ]
};

// Генерация всех поворотов для каждой фигуры
const generateRotations = (shape, type) => {
  // Фигура O не поворачивается
  if (type === 'O') {
    return [shape, shape, shape, shape];
  }
  
  // Фигура I имеет специальные повороты
  if (type === 'I') {
    return [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]]
    ];
  }
  
  const rotations = [shape];
  let current = shape;
  for (let i = 0; i < 3; i++) {
    const rotated = current[0].map((_, i) => current.map(row => row[i]).reverse());
    rotations.push(rotated);
    current = rotated;
  }
  return rotations;
};

const ALL_TETROMINOES = {};
Object.keys(TETROMINOES).forEach(key => {
  ALL_TETROMINOES[key] = generateRotations(TETROMINOES[key][0], key);
});

const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

export const useGameStore = defineStore('game', () => {
  const board = ref(Array(20).fill(null).map(() => Array(10).fill(0)));
  const currentPiece = ref(null);
  const nextPiece = ref(null);
  const score = ref(0);
  const level = ref(1);
  const lines = ref(0);
  const isPaused = ref(false);
  const isGameOver = ref(false);
  const gameLoop = ref(null);
  const dropInterval = ref(1000);

  // Генерация случайной фигуры
  const getRandomPiece = () => {
    const types = Object.keys(ALL_TETROMINOES);
    const type = types[Math.floor(Math.random() * types.length)];
    const rotations = ALL_TETROMINOES[type];
    return {
      type,
      shape: rotations[0],
      rotation: 0,
      rotations,
      x: 3,
      y: 0,
      color: COLORS[type]
    };
  };

  // Проверка коллизий
  const checkCollision = (piece, dx = 0, dy = 0, newShape = null) => {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= 10 || newY >= 20) {
            return true;
          }
          
          if (newY >= 0 && board.value[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Размещение фигуры на доске
  const placePiece = () => {
    const piece = currentPiece.value;
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            board.value[boardY][boardX] = piece.color;
          }
        }
      }
    }
  };

  // Очистка заполненных линий
  const clearLines = () => {
    let linesCleared = 0;
    for (let y = board.value.length - 1; y >= 0; y--) {
      if (board.value[y].every(cell => cell !== 0)) {
        board.value.splice(y, 1);
        board.value.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // Проверяем ту же строку снова
      }
    }
    
    if (linesCleared > 0) {
      lines.value += linesCleared;
      // Подсчёт очков по классическим правилам
      const pointsPerLine = [0, 100, 300, 500, 800];
      score.value += pointsPerLine[linesCleared] * (level.value + 1);
      
      // Увеличение уровня каждые 10 линий
      const newLevel = Math.floor(lines.value / 10) + 1;
      if (newLevel > level.value) {
        level.value = newLevel;
        dropInterval.value = Math.max(100, 1000 - (level.value - 1) * 100);
        // Перезапуск игрового цикла с новым интервалом
        if (gameLoop.value) {
          clearInterval(gameLoop.value);
          gameLoop.value = setInterval(() => {
            if (!isPaused.value && !isGameOver.value) {
              moveDown();
            }
          }, dropInterval.value);
        }
      }
    }
  };

  // Движение вниз
  const moveDown = () => {
    if (!currentPiece.value || isPaused.value || isGameOver.value) return;
    
    if (!checkCollision(currentPiece.value, 0, 1)) {
      currentPiece.value.y++;
    } else {
      placePiece();
      clearLines();
      currentPiece.value = nextPiece.value;
      nextPiece.value = getRandomPiece();
      
      if (checkCollision(currentPiece.value)) {
        gameOver();
      }
    }
  };

  // Движение влево
  const moveLeft = () => {
    if (!currentPiece.value || isPaused.value || isGameOver.value) return;
    if (!checkCollision(currentPiece.value, -1, 0)) {
      currentPiece.value.x--;
    }
  };

  // Движение вправо
  const moveRight = () => {
    if (!currentPiece.value || isPaused.value || isGameOver.value) return;
    if (!checkCollision(currentPiece.value, 1, 0)) {
      currentPiece.value.x++;
    }
  };

  // Поворот
  const rotate = () => {
    if (!currentPiece.value || isPaused.value || isGameOver.value) return;
    
    const nextRotation = (currentPiece.value.rotation + 1) % 4;
    const newShape = currentPiece.value.rotations[nextRotation];
    
    if (!checkCollision(currentPiece.value, 0, 0, newShape)) {
      currentPiece.value.shape = newShape;
      currentPiece.value.rotation = nextRotation;
    }
  };

  // Жёсткое падение
  const hardDrop = () => {
    if (!currentPiece.value || isPaused.value || isGameOver.value) return;
    
    while (!checkCollision(currentPiece.value, 0, 1)) {
      currentPiece.value.y++;
      score.value += 2; // Бонус за жёсткое падение
    }
    placePiece();
    clearLines();
    currentPiece.value = nextPiece.value;
    nextPiece.value = getRandomPiece();
    
    if (checkCollision(currentPiece.value)) {
      gameOver();
    }
  };

  // Пауза
  const togglePause = () => {
    if (isGameOver.value) return;
    isPaused.value = !isPaused.value;
  };

  // Новая игра
  const newGame = () => {
    board.value = Array(20).fill(null).map(() => Array(10).fill(0));
    score.value = 0;
    level.value = 1;
    lines.value = 0;
    isPaused.value = false;
    isGameOver.value = false;
    dropInterval.value = 1000;
    
    currentPiece.value = getRandomPiece();
    nextPiece.value = getRandomPiece();
    
    startGameLoop();
  };

  // Игровой цикл
  const startGameLoop = () => {
    if (gameLoop.value) {
      clearInterval(gameLoop.value);
    }
    gameLoop.value = setInterval(() => {
      if (!isPaused.value && !isGameOver.value) {
        moveDown();
      }
    }, dropInterval.value);
  };

  // Конец игры
  const gameOver = async () => {
    isGameOver.value = true;
    if (gameLoop.value) {
      clearInterval(gameLoop.value);
    }
    
    // Сохранение результата
    try {
      await scoreService.submitScore(score.value, level.value, lines.value);
    } catch (error) {
      console.error('Ошибка сохранения результата:', error);
    }
  };

  // Получение доски с текущей фигурой
  const displayBoard = computed(() => {
    const display = board.value.map(row => [...row]);
    
    if (currentPiece.value) {
      const piece = currentPiece.value;
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.y + y;
            const boardX = piece.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              display[boardY][boardX] = piece.color;
            }
          }
        }
      }
    }
    
    return display;
  });

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    lines,
    isPaused,
    isGameOver,
    displayBoard,
    getRandomPiece,
    moveDown,
    moveLeft,
    moveRight,
    rotate,
    hardDrop,
    togglePause,
    newGame,
    startGameLoop
  };
});

