<script setup>
import {computed} from 'vue';

import {useGameStore} from '../store/gameStore';

const gameStore = useGameStore();
const displayBoard = computed(() => gameStore.displayBoard);
</script>

<template>
	<div class="game-board">
		<div class="board-grid">
			<div
				v-for="(row, y) in displayBoard"
				:key="y"
				class="board-row"
			>
				<div
					v-for="(cell, x) in row"
					:key="x"
					class="board-cell"
					:style="{ backgroundColor: cell || '#1a1a2e' }"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.game-board {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px;
	background: #0f0f1e;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.board-grid {
	display: grid;
	grid-template-rows: repeat(20, 1fr);
	gap: 1px;
	background: #16213e;
	padding: 2px;
	border-radius: 4px;
}

.board-row {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	gap: 1px;
}

.board-cell {
	width: 25px;
	height: 25px;
	border-radius: 2px;
	transition: background-color 0.1s ease;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
	.board-cell {
		width: 20px;
		height: 20px;
	}
}

@media (max-width: 480px) {
	.board-cell {
		width: 15px;
		height: 15px;
	}

	.game-board {
		padding: 10px;
	}
}
</style>
