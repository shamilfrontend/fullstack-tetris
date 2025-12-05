<script setup>
import {computed} from 'vue';

import {useGameStore} from '../store/gameStore';

const gameStore = useGameStore();
const score = computed(() => gameStore.score);
const level = computed(() => gameStore.level);
const lines = computed(() => gameStore.lines);
const nextPiece = computed(() => gameStore.nextPiece);
</script>

<template>
	<div class="score-display">
		<div class="stat-item">
			<span class="stat-label">Очки</span>
			<span class="stat-value">{{ score.toLocaleString() }}</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Уровень</span>
			<span class="stat-value">{{ level }}</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Линии</span>
			<span class="stat-value">{{ lines }}</span>
		</div>

		<div class="next-piece" v-if="nextPiece">
			<div class="next-label">Следующая</div>
			<div class="next-preview">
				<div
					v-for="(row, y) in nextPiece.shape"
					:key="y"
					class="next-row"
				>
					<div
						v-for="(cell, x) in row"
						:key="x"
						class="next-cell"
						:style="{ backgroundColor: cell ? nextPiece.color : 'transparent' }"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.score-display {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;
	background: #0f0f1e;
	border-radius: 8px;
	min-width: 200px;
}

.stat-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.stat-label {
	font-size: 14px;
	color: #888;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.stat-value {
	font-size: 32px;
	font-weight: bold;
	color: #fff;
}

.next-piece {
	margin-top: 20px;
	padding-top: 20px;
	border-top: 1px solid #333;
}

.next-label {
	font-size: 14px;
	color: #888;
	margin-bottom: 10px;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.next-preview {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: center;
}

.next-row {
	display: flex;
	gap: 2px;
}

.next-cell {
	width: 20px;
	height: 20px;
	border-radius: 2px;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
	.score-display {
		min-width: 150px;
		padding: 15px;
	}

	.stat-value {
		font-size: 24px;
	}

	.next-cell {
		width: 15px;
		height: 15px;
	}
}
</style>
