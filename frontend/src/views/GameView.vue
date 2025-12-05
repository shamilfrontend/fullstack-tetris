<script setup>
import {onMounted, onUnmounted} from 'vue';

import {useGameStore} from '../store/gameStore';
import GameBoard from '../components/GameBoard.vue';
import ScoreDisplay from '../components/ScoreDisplay.vue';
import Controls from '../components/Controls.vue';

const gameStore = useGameStore();

// Обработка клавиатуры
const handleKeyPress = (e) => {
	if (gameStore.isGameOver) return;

	switch (e.key) {
		case 'ArrowLeft':
			e.preventDefault();
			gameStore.moveLeft();
			break;
		case 'ArrowRight':
			e.preventDefault();
			gameStore.moveRight();
			break;
		case 'ArrowDown':
			e.preventDefault();
			gameStore.moveDown();
			break;
		case 'ArrowUp':
		case ' ':
			e.preventDefault();
			gameStore.rotate();
			break;
		case 'p':
		case 'P':
			e.preventDefault();
			gameStore.togglePause();
			break;
	}
};

// Обработка свайпов для мобильных
let touchStartX = 0;
let touchStartY = 0;

const handleTouchStart = (e) => {
	touchStartX = e.touches[0].clientX;
	touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
	if (!touchStartX || !touchStartY) return;

	const touchEndX = e.changedTouches[0].clientX;
	const touchEndY = e.changedTouches[0].clientY;

	const diffX = touchStartX - touchEndX;
	const diffY = touchStartY - touchEndY;

	const minSwipeDistance = 50;

	if (Math.abs(diffX) > Math.abs(diffY)) {
		// Горизонтальный свайп
		if (Math.abs(diffX) > minSwipeDistance) {
			if (diffX > 0) {
				gameStore.moveLeft();
			} else {
				gameStore.moveRight();
			}
		}
	} else {
		// Вертикальный свайп
		if (Math.abs(diffY) > minSwipeDistance) {
			if (diffY > 0) {
				gameStore.hardDrop();
			} else {
				gameStore.moveDown();
			}
		}
	}

	touchStartX = 0;
	touchStartY = 0;
};

const handlePause = () => {
	gameStore.togglePause();
};

const handleNewGame = () => {
	gameStore.newGame();
};

onMounted(() => {
	window.addEventListener('keydown', handleKeyPress);
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchend', handleTouchEnd);

	if (!gameStore.currentPiece) {
		gameStore.newGame();
	} else {
		gameStore.startGameLoop();
	}
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyPress);
	window.removeEventListener('touchstart', handleTouchStart);
	window.removeEventListener('touchend', handleTouchEnd);
});
</script>

<template>
	<div class="game-view">
		<div class="game-header">
			<nav class="game-nav">
				<router-link to="/leaderboard" class="nav-link">Рейтинг</router-link>
				<router-link to="/profile" class="nav-link">Профиль</router-link>
			</nav>
		</div>

		<div class="game-container">
			<div class="game-main">
				<GameBoard/>
				<ScoreDisplay/>
			</div>

			<Controls/>

			<div class="game-controls">
				<button @click="handlePause" class="control-button">
					{{ gameStore.isPaused ? 'Продолжить' : 'Пауза' }}
				</button>
				<button @click="handleNewGame" class="control-button">
					Новая игра
				</button>
			</div>

			<div v-if="gameStore.isGameOver" class="game-over">
				<h2>Игра окончена!</h2>
				<p>Ваш результат: {{ gameStore.score.toLocaleString() }} очков</p>
				<button @click="handleNewGame" class="control-button">
					Новая игра
				</button>
			</div>

			<div
				v-if="gameStore.isPaused && !gameStore.isGameOver"
				class="pause-overlay"
				@click="gameStore.togglePause"
			>
				<h2>Пауза</h2>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.game-view {
	min-height: 100vh;
	background: linear-gradient(135deg, #0f0f1e 0%, #16213e 100%);
	padding: 20px;
}

.game-header {
	margin-bottom: 20px;
}

.game-nav {
	display: flex;
	justify-content: center;
	gap: 20px;

	.nav-link {
		padding: 10px 20px;
		color: #fff;
		text-decoration: none;
		background: #16213e;
		border-radius: 6px;
		transition: background 0.3s;

		&:hover {
			background: #0ea5e9;
		}
	}
}

.game-container {
	position: relative;
	max-width: 1200px;
	margin: 0 auto;
}

.game-main {
	display: flex;
	justify-content: center;
	gap: 30px;
	flex-wrap: wrap;
	margin-bottom: 20px;
}

.game-controls {
	display: flex;
	justify-content: center;
	gap: 15px;
	margin-top: 20px;
}

.control-button {
	padding: 12px 24px;
	background: #0ea5e9;
	border: none;
	border-radius: 6px;
	color: #fff;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.3s;

	&:hover {
		background: #0284c7;
	}
}

.game-over {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #0f0f1e;
	padding: 40px;
	border-radius: 12px;
	text-align: center;
	z-index: 1000;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);

	h2 {
		color: #fff;
		margin-bottom: 20px;
	}

	p {
		color: #888;
		margin-bottom: 30px;
		font-size: 18px;
	}
}

.pause-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;

	h2 {
		color: #fff;
		font-size: 48px;
	}
}

@media (max-width: 768px) {
	.game-main {
		flex-direction: column;
		align-items: center;
	}

	.game-controls {
		flex-direction: column;
		align-items: center;

		.control-button {
			width: 100%;
			max-width: 300px;
		}
	}
}
</style>
