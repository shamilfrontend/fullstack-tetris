<script setup>
import {useGameStore} from '../store/gameStore';

const gameStore = useGameStore();

const handleMoveLeft = () => {
	gameStore.moveLeft();
};

const handleMoveRight = () => {
	gameStore.moveRight();
};

const handleRotate = () => {
	gameStore.rotate();
};

const handleHardDrop = () => {
	gameStore.hardDrop();
};
</script>

<template>
	<div class="controls">
		<button
			class="control-btn"
			@touchstart.prevent="handleMoveLeft"
			@click="handleMoveLeft"
		>
			←
		</button>
		<button
			class="control-btn rotate-btn"
			@touchstart.prevent="handleRotate"
			@click="handleRotate"
		>
			↻
		</button>
		<button
			class="control-btn"
			@touchstart.prevent="handleMoveRight"
			@click="handleMoveRight"
		>
			→
		</button>
		<button
			class="control-btn drop-btn"
			@touchstart.prevent="handleHardDrop"
			@click="handleHardDrop"
		>
			↓
		</button>
	</div>
</template>

<style lang="scss" scoped>
.controls {
	display: none;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	padding: 20px;
	max-width: 300px;
	margin: 0 auto;
}

.control-btn {
	padding: 20px;
	font-size: 24px;
	background: #16213e;
	border: 2px solid #0ea5e9;
	border-radius: 8px;
	color: #fff;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: all 0.2s ease;

	&:active {
		background: #0ea5e9;
		transform: scale(0.95);
	}
}

.rotate-btn {
	grid-column: 2;
	grid-row: 1;
}

.drop-btn {
	grid-column: 1 / 4;
	grid-row: 2;
}

@media (max-width: 768px) {
	.controls {
		display: grid;
	}
}
</style>
