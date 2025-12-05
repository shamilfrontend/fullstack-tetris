<script setup>
import UserProfile from '../components/UserProfile.vue';
</script>

<template>
	<div class="profile-view">
		<div class="view-header">
			<nav class="view-nav">
				<router-link to="/game" class="nav-link">Игра</router-link>
				<router-link to="/leaderboard" class="nav-link">Рейтинг</router-link>
			</nav>
		</div>
		<UserProfile/>
	</div>
</template>

<style lang="scss" scoped>
.profile-view {
	min-height: 100vh;
	background: linear-gradient(135deg, #0f0f1e 0%, #16213e 100%);
	padding: 20px;
}

.view-header {
	margin-bottom: 30px;
}

.view-nav {
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
</style>
