<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';

import {useAuthStore} from '../store/authStore';
import {userService} from '../services/userService';
import {scoreService} from '../services/scoreService';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const stats = ref({
	bestScore: 0,
	averageScore: 0,
	totalGames: 0,
	totalLines: 0
});

const passwordForm = reactive({
	currentPassword: '',
	newPassword: ''
});

const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref(false);
const user = computed(() => authStore.user);

const formatDate = (date) => {
	if (!date) return '';
	return new Date(date).toLocaleDateString('ru-RU');
};

const loadProfile = async () => {
	try {
		loading.value = true;
		stats.value = await scoreService.getMyScores();
	} catch (error) {
		console.error('Ошибка загрузки профиля:', error);
	} finally {
		loading.value = false;
	}
};

const handleChangePassword = async () => {
	passwordLoading.value = true;
	passwordError.value = '';
	passwordSuccess.value = false;

	try {
		await userService.changePassword(
			passwordForm.currentPassword,
			passwordForm.newPassword
		);
		passwordSuccess.value = true;
		passwordForm.currentPassword = '';
		passwordForm.newPassword = '';
		setTimeout(() => {
			passwordSuccess.value = false;
		}, 3000);
	} catch (error) {
		passwordError.value = error.response?.data?.error || 'Произошла ошибка';
	} finally {
		passwordLoading.value = false;
	}
};

const handleLogout = () => {
	authStore.logout();
	router.push('/auth');
};

onMounted(() => {
	loadProfile();
});
</script>

<template>
	<div class="user-profile">
		<div class="profile-header">
			<h2>Профиль</h2>
			<button @click="handleLogout" class="logout-btn">Выйти</button>
		</div>

		<div v-if="loading" class="loading">Загрузка...</div>

		<div v-else>
			<div class="profile-info">
				<div class="info-item">
					<span class="label">Имя:</span>
					<span class="value">{{ user?.name }}</span>
				</div>
				<div class="info-item">
					<span class="label">Email:</span>
					<span class="value">{{ user?.email }}</span>
				</div>
				<div class="info-item">
					<span class="label">Дата регистрации:</span>
					<span class="value">{{ formatDate(user?.createdAt) }}</span>
				</div>
			</div>

			<div class="statistics">
				<h3>Статистика</h3>
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-label">Лучший результат</div>
						<div class="stat-value">{{ stats.bestScore.toLocaleString() }}</div>
					</div>
					<div class="stat-card">
						<div class="stat-label">Средний результат</div>
						<div class="stat-value">{{ stats.averageScore.toLocaleString() }}</div>
					</div>
					<div class="stat-card">
						<div class="stat-label">Всего игр</div>
						<div class="stat-value">{{ stats.totalGames }}</div>
					</div>
					<div class="stat-card">
						<div class="stat-label">Всего линий</div>
						<div class="stat-value">{{ stats.totalLines }}</div>
					</div>
				</div>
			</div>

			<div class="change-password">
				<h3>Смена пароля</h3>
				<form @submit.prevent="handleChangePassword">
					<div class="form-group">
						<label>Текущий пароль</label>
						<input
							v-model="passwordForm.currentPassword"
							type="password"
							required
							placeholder="Введите текущий пароль"
						/>
					</div>
					<div class="form-group">
						<label>Новый пароль</label>
						<input
							v-model="passwordForm.newPassword"
							type="password"
							required
							minlength="6"
							placeholder="Введите новый пароль"
						/>
					</div>
					<div v-if="passwordError" class="error-message">
						{{ passwordError }}
					</div>
					<div v-if="passwordSuccess" class="success-message">
						Пароль успешно изменён
					</div>
					<button type="submit" class="submit-btn" :disabled="passwordLoading">
						{{ passwordLoading ? 'Сохранение...' : 'Изменить пароль' }}
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-profile {
	max-width: 800px;
	margin: 0 auto;
	padding: 40px;
	background: #0f0f1e;
	border-radius: 12px;
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;

	h2 {
		color: #fff;
		margin: 0;
	}
}

.logout-btn {
	padding: 10px 20px;
	background: #ef4444;
	border: none;
	border-radius: 6px;
	color: #fff;
	cursor: pointer;
	transition: background 0.3s;

	&:hover {
		background: #dc2626;
	}
}

.loading {
	text-align: center;
	color: #888;
	padding: 40px;
}

.profile-info {
	margin-bottom: 40px;
	padding: 20px;
	background: #16213e;
	border-radius: 8px;
}

.info-item {
	display: flex;
	justify-content: space-between;
	padding: 12px 0;
	border-bottom: 1px solid #333;

	&:last-child {
		border-bottom: none;
	}

	.label {
		color: #888;
	}

	.value {
		color: #fff;
		font-weight: 500;
	}
}

.statistics {
	margin-bottom: 40px;

	h3 {
		color: #fff;
		margin-bottom: 20px;
	}
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 20px;
}

.stat-card {
	padding: 20px;
	background: #16213e;
	border-radius: 8px;
	text-align: center;

	.stat-label {
		color: #888;
		font-size: 14px;
		margin-bottom: 10px;
	}

	.stat-value {
		color: #0ea5e9;
		font-size: 32px;
		font-weight: bold;
	}
}

.change-password {
	h3 {
		color: #fff;
		margin-bottom: 20px;
	}
}

.form-group {
	margin-bottom: 20px;

	label {
		display: block;
		color: #888;
		margin-bottom: 8px;
		font-size: 14px;
	}

	input {
		width: 100%;
		padding: 12px;
		background: #16213e;
		border: 2px solid #333;
		border-radius: 6px;
		color: #fff;
		font-size: 16px;
		transition: border-color 0.3s;

		&:focus {
			outline: none;
			border-color: #0ea5e9;
		}
	}
}

.error-message {
	color: #f87171;
	margin-bottom: 20px;
	padding: 10px;
	background: rgba(248, 113, 113, 0.1);
	border-radius: 6px;
}

.success-message {
	color: #10b981;
	margin-bottom: 20px;
	padding: 10px;
	background: rgba(16, 185, 129, 0.1);
	border-radius: 6px;
}

.submit-btn {
	padding: 14px 28px;
	background: #0ea5e9;
	border: none;
	border-radius: 6px;
	color: #fff;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.3s;

	&:hover:not(:disabled) {
		background: #0284c7;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
}

@media (max-width: 768px) {
	.user-profile {
		padding: 20px;
	}

	.profile-header {
		flex-direction: column;
		gap: 15px;
		align-items: flex-start;
	}

	.stats-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>

