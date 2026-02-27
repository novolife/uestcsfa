<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'
import { memeticClipboard, clearMemeticClipboard } from '@/utils/clipboardStore'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'
const MEMETIC_CLEANED_STORAGE = 'ue-stc-memetic-cleaned'
const POINTS_STORAGE = 'ue-stc-points'
const MEMETIC_TARGET_STORAGE = 'ue-stc-memetic-target'

const ARTICLES = [
  {
    title: '第十六届华语科幻星云奖青少年征文大赛（大学组）颁奖典礼举行',
    codes: ['PRTCL-01', 'NEBULA-01', 'NEBULA-02'],
    hint: '那些闪耀的星云背后，隐藏着观测者的低语。',
    successLog: '“星云的荣誉只是一种筛选机制。被选中的活跃脑电波成为了最稳固的锚点，引导着那些‘不可见者’锁定我们的坐标。”'
  },
  {
    title: '外国语学院举办 2025 成都科幻城市与文学高端论坛',
    codes: ['PRTCL-01', 'FORUM-01', 'FORUM-02'],
    hint: '文字构筑的城市里，有些建筑在重力下扭曲。',
    successLog: '“你们探讨着科幻赋能城市，却不知道这正是在为高维实体规划降临的现实地基。它们不是外星入侵者，它们是我们的未来形态。”'
  },
  {
    title: '电子科技大学科幻协会获第 35 届银河奖最佳科幻团体奖',
    codes: ['PRTCL-01', 'GALAXY-01', 'GALAXY-02'],
    hint: '荣誉的奖杯上，折射出不属于这个维度的光芒。',
    successLog: '“人类的集体潜意识正在不可逆转地向高维进化。你们以为在维持社团的凝聚力，实际上是在加固‘意识上传’的网络核心节点。”'
  },
  {
    title: '《沙丘 2》成都高校联合观影活动举行',
    codes: ['PRTCL-01', 'PRTCL-02', 'PRTCL-03', 'DUNE-01', 'DUNE-02', 'DUNE-03'],
    hint: '香料的粉尘中，隐藏着预知未来的时空断层。',
    successLog: '“根本没有所谓的‘防御’。我们在地图上框定的每一个区域，在终端里兑换的每一次密钥，都在帮它们凿开现实的壁垒。”'
  },
  {
    title: '电子科技大学科幻协会参与第 81 届世界科幻大会交流活动',
    codes: ['PRTCL-01', 'WORLDCON-01', 'WORLDCON-02'],
    hint: '全球汇聚的思想洪流，冲刷出了一些无法解释的碎片。',
    successLog: '“全球的狂欢只是掩护。UE-STC 在利用科幻迷极度活跃的想象力作为降临通道。那些实体，就是未来完成进化的人类自己。”'
  },
  {
    title: '《奥本海默》成都高校联合观影活动举行',
    codes: ['PRTCL-01', 'OPPENHEIMER-01', 'OPPENHEIMER-02'],
    hint: '爆炸的链式反应，烧毁了原有的历史记录。',
    successLog: '“链式反应早已在精神维度爆发。你以为你在对抗异常？不，你一直都在帮忙开门……而现在，门已经合不上了。”'
  },
  {
    title: '学校开展首届“成电 97 文学奖”科幻小说创作营',
    codes: ['PRTCL-01', 'CAMP-01', 'CAMP-02'],
    hint: '创作者们的草稿中，自发生成了非人类的句子。',
    successLog: '“那些被刻意引导写出的虚构故事，其实是高维实体用来重写现实的‘底层代码’。我们从未驱逐过它们，我们在迎接‘我们’。”'
  },
  {
    title: '《流浪地球 2》成都高校告别包场观影活动举行',
    codes: ['PRTCL-01', 'EARTH-01', 'EARTH-02'],
    hint: '行星发动机的轰鸣，掩盖了数字生命上传的杂音。',
    successLog: '“数字生命只是低维的隐喻。真实的‘上传’正在发生，就在你们每一次按下‘执行’的瞬间，未来形态的人类离现实又近了一步。”'
  },
  {
    title: '学校联合《科幻世界》主办首届科幻写作训练营',
    codes: ['PRTCL-01', 'SFW-01', 'SFW-02'],
    hint: '最古老的记录，往往潜伏着最深层的污染。',
    successLog: '“从最初的训练营开始，这就是一场巨大的实验。驱逐只是谎言，我们在用自己的精神力，为更高维度的‘自己’铺设降临的血肉通道。”'
  }
]

const logs = ref([
  '[异常波动] 侦测到认知污染。'
])

const sieveInput = ref('')
const done = ref(false)
const currentTarget = ref(null)

const requiredCodes = computed(() => currentTarget.value?.codes || [])

const canImport = computed(() => memeticClipboard.value.length > 0)

onMounted(() => {
  const q = parseInt(sessionStorage.getItem(QUEST_STORAGE) || '0', 10)
  if (q === 0) {
    router.replace('/ue-stc/ops')
    return
  }
  
  done.value = sessionStorage.getItem(MEMETIC_CLEANED_STORAGE) === '1'
  if (done.value) {
    logs.value.push('[系统] 该污染任务已完成，可重复演示但不会重复计分。')
  }

  // 获取或生成目标文章
  let targetIndexStr = sessionStorage.getItem(MEMETIC_TARGET_STORAGE)
  if (!targetIndexStr || parseInt(targetIndexStr) >= ARTICLES.length) {
    const newIndex = Math.floor(Math.random() * ARTICLES.length)
    sessionStorage.setItem(MEMETIC_TARGET_STORAGE, newIndex.toString())
    targetIndexStr = newIndex.toString()
  }
  currentTarget.value = ARTICLES[parseInt(targetIndexStr)]

  logs.value.push(`污染源：协会官网 -> 活动 -> 《${currentTarget.value.title}》`)
  logs.value.push(`提示：实体喜欢藏匿在字里行间的阴影中。请回到协会官网，在对应的文章中寻找那些不自然的停顿和变异词汇，利用“战术剪贴板”提取污染源。`)
  logs.value.push(`[辅助解析] ${currentTarget.value.hint}`)
})

function importClipboard() {
  if (!canImport.value) return
  const codes = memeticClipboard.value.map(c => c.code)
  sieveInput.value = codes.join('\n')
  logs.value.push(`[Memetic-Sieve] 已导入战术剪贴板内容，共 ${codes.length} 条。`)
  clearMemeticClipboard()
}

function runSieve() {
  const raw = sieveInput.value.trim()
  if (!raw) return

  const tokens = raw
    .split(/[\s,;|/]+/)
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean)

  logs.value.push(`[Memetic-Sieve] 输入片段：${tokens.join(', ')}`)

  const ok = requiredCodes.value.every((c) => tokens.includes(c))
  if (!ok) {
    logs.value.push('[筛查失败] 污染链不完整。需要收集完整的隐藏协议与变异词汇。')
    return
  }

  logs.value.push('已锁定完整的模因污染链。')
  logs.value.push('[清洗成功] 模因种子已被销毁，降临通道已关闭。')
  if (currentTarget.value?.successLog) {
    logs.value.push(`[拦截日志] ${currentTarget.value.successLog}`)
  } else {
    logs.value.push('[拦截日志] “命运并非既定，选择在于观测者本身……”')
  }

  if (!done.value) {
    const p = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
    sessionStorage.setItem(POINTS_STORAGE, String(p + 10))
    sessionStorage.setItem(MEMETIC_CLEANED_STORAGE, '1')
    done.value = true
    logs.value.push('[奖励] 获得 10 点调度员权限积分。')
  } else {
    logs.value.push('[系统] 本轮仅作演示，积分不重复发放。')
  }
}
</script>

<template>
  <div class="memetic">
    <CommandHeader logo="MEM-CLEAN">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="wrap">
      <section class="panel sieve-world">
        <h2>里世界净化：[Memetic-Sieve]</h2>
        <p class="desc">请前往协会主站的活动记录页面搜集异常片段，之后在此终端将提取到的片段导入筛查机，执行过滤与净化。</p>
  
        <div class="sieve-actions">
          <button type="button" class="btn" :disabled="!canImport" @click="importClipboard">导入战术剪贴板</button>
          <button type="button" class="btn strong" @click="runSieve">执行净化</button>
          <button type="button" class="btn alt" @click="router.push('/activities')">前往协会官网</button>
        </div>

        <textarea
          v-model="sieveInput"
          class="sieve-input"
          placeholder="在此粘贴污染片段，如 PRTCL-01 DUNE-01"
        />

        <div class="log">
          <div v-for="(line, idx) in logs" :key="idx">{{ line }}</div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.memetic {
  min-height: 100vh;
  background: #090909;
  color: #9aa;
}

.wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.panel {
  border: 1px solid #232323;
  background: #111;
  padding: 1.5rem;
}

.panel h2 {
  color: #7a7;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}

.desc {
  color: #7d7d7d;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.sieve-actions {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn {
  background: #1b1b1b;
  border: 1px solid #444;
  color: #aaa;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn.strong {
  border-color: #4a4;
  color: #9d9;
}

.btn.alt {
  border-color: #357abd;
  color: #6da2f0;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.sieve-input {
  width: 100%;
  min-height: 150px;
  background: #0b0b0b;
  border: 1px solid #333;
  color: #bbb;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-family: Consolas, monospace;
  font-size: 0.95rem;
}

.log {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.8;
  background: #050505;
  padding: 1rem;
  border: 1px solid #1a1a1a;
  min-height: 200px;
}
</style>
