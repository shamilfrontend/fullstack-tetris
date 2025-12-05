<script setup>
import {ref, onMounted} from 'vue';

import {scoreService} from '../services/scoreService';
import {useAuthStore} from '../store/authStore';

const authStore = useAuthStore();
const scores = ref([]);
const loading = ref(true);

const isCurrentUser = (userId) => {
	return authStore.user && userId && userId.toString() === authStore.user.id;
};

const loadScores = async () => {
	try {
		loading.value = true;
		scores.value = await scoreService.getTopScores();
	} catch (error) {
		console.error('Ошибка загрузки рейтинга:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadScores();
});
</script>

<template>
	<div class="leaderboard">
		<h2>Топ-10 игроков</h2>

		<div v-if="loading" class="loading">Загрузка...</div>

		<div v-else-if="scores.length === 0" class="empty">
			Пока нет результатов
		</div>

		<div v-else class="scores-list">
			<div
				v-for="(score, index) in scores"
				:key="score._id"
				class="score-item"
				:class="{ 'current-user': isCurrentUser(score.userId?._id) }"
			>
				<div class="rank">{{ index + 1 }}</div>
				<div class="player-info">
					<div class="player-name">{{ score.userId?.name || 'Неизвестно' }}</div>
					<div class="player-email">{{ score.userId?.email || '' }}</div>
				</div>
				<div class="score-info">
					<div class="score-points">{{ score.points.toLocaleString() }}</div>
					<div class="score-details">Уровень {{ score.level }} • {{ score.lines }} линий</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.leaderboard {
	max-width: 800px;
	margin: 0 auto;
	padding: 40px;
	background: #0f0f1e;
	border-radius: 12px;
}

h2 {
	color: #fff;
	margin-bottom: 30px;
	text-align: center;
}

.loading, .empty {
	text-align: center;
	color: #888;
	padding: 40px;
}

.scores-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.score-item {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px;
	background: #16213e;
	border-radius: 8px;
	border: 2px solid transparent;
	transition: all 0.3s;

	&.current-user {
		border-color: #0ea5e9;
		background: rgba(14, 165, 233, 0.1);
	}

	&:hover {
		transform: translateX(5px);
	}
}

.rank {
	font-size: 24px;
	font-weight: bold;
	color: #0ea5e9;
	min-width: 40px;
	text-align: center;
}

.player-info {
	flex: 1;

	.player-name {
		color: #fff;
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 4px;
	}

	.player-email {
		color: #888;
		font-size: 14px;
	}
}

.score-info {
	text-align: right;

	.score-points {
		color: #fff;
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 4px;
	}

	.score-details {
		color: #888;
		font-size: 14px;
	}
}

@media (max-width: 768px) {
	.leaderboard {
		padding: 20px;
	}

	.score-item {
		flex-direction: column;
		text-align: center;
		gap: 10px;
	}

	.player-info, .score-info {
		text-align: center;
	}
}
</style>
