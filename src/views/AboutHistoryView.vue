<script setup>
import { RouterLink } from 'vue-router'

const terms = [
  {
    year: '2017～2018',
    chair: '周锐',
    staff: [
      { name: '赵东阳', handle: 'Zealot' },
      { name: '周胜阳', handle: 'zsy433' },
      { name: '肖垚', handle: '拂石' },
      { name: '水怪', handle: 'function42' },
      { name: '王晨浩', handle: '白头' },
    ],
  },
  {
    year: '2018～2019',
    chair: '包明哲',
    staff: [
      { name: '吴一帆' },
      { name: '周嘉诚', handle: 'null' },
      { name: '黄晋' },
    ],
  },
  {
    year: '2019～2020',
    chair: '唐雨轩',
    staff: [
      { name: '谷沣达', handle: '比企谷八幡' },
      { name: '甘茗瑀' },
    ],
  },
  {
    year: '2020～2021',
    chair: '杨翼铭',
    staff: [
      { name: '李嘉豪', handle: 'Fish' },
    ],
  },
  {
    year: '2021～2022',
    chair: '李嘉豪',
    staff: [],
  },
]

</script>

<template>
  <div class="about-history page">
    <RouterLink to="/about" class="back-card">
      <FontAwesomeIcon icon="arrow-left" class="back-card-icon" />
      <span class="back-card-text">关于我们</span>
    </RouterLink>

    <h1 class="page-title">历届社长与干事</h1>
    <p class="page-desc">电子科技大学科幻协会历年社长及干事名单。</p>

    <div class="terms-list">
      <section v-for="t in terms" :key="t.year" class="term-card">
        <h2 class="term-year">{{ t.year }}</h2>
        <div class="term-chair">
          <span class="label">社长</span>
          <span class="name">{{ t.chair }}</span>
        </div>
        <div v-if="t.staff.length" class="term-staff">
          <span class="label">干事</span>
          <span class="staff-text">
            <template v-for="(s, i) in t.staff" :key="i">
              <span v-if="i" class="staff-sep">|</span>{{ s.handle ? `${s.name}（${s.handle}）` : s.name }}
            </template>
          </span>
        </div>
        <p v-else class="term-staff empty">干事：—</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-history.page {
  max-width: 640px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.page-desc {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  margin-bottom: 1.5rem;
}

.back-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.9rem 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.back-card:hover {
  border-color: var(--color-highlight);
  background: rgba(25, 5, 250, 0.1);
  box-shadow: 0 4px 12px rgba(25, 5, 250, 0.2);
  color: var(--color-heading);
}

.back-card-icon {
  font-size: 1.1rem;
  color: #fff;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  /* 箭头中心线对齐文字：箭头偏下，上移约 1/6 行高使与文字中线对齐 */
  transform: translateY(-0.16em);
}

.back-card-text {
  flex: 1;
}

.terms-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.term-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  transition: border-color 0.2s;
}

.term-card:hover {
  border-color: var(--color-highlight);
}

.term-year {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.term-chair,
.term-staff {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: baseline;
}

.term-chair .label,
.term-staff .label {
  font-size: 0.85rem;
  color: var(--color-text-mute);
  flex-shrink: 0;
}

.term-chair .name {
  font-weight: 600;
  color: var(--color-text);
}

.staff-text {
  color: var(--color-text);
  font-size: 0.95rem;
}

.staff-sep {
  user-select: none;
  margin: 0 0.25em;
}

.term-staff.empty {
  color: var(--color-text-mute);
  font-size: 0.9rem;
}
</style>
