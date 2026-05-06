<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

type ReadingGoalType = 'readBooks' | 'favoriteBooks' | 'genres'

interface ReadingGoal {
  id: string
  type: ReadingGoalType
  target: number
  createdAt: number
}

const goalTypeOptions: Array<{ type: ReadingGoalType; label: string; subtitle: string }> = [
  {
    type: 'readBooks',
    label: 'Read books',
    subtitle: 'Track how many books you complete.'
  },
  {
    type: 'favoriteBooks',
    label: 'Save favorite books',
    subtitle: 'Build your personal favorite collection.'
  },
  {
    type: 'genres',
    label: 'Explore new genres',
    subtitle: 'Try books from different genres.'
  }
]

const goalTargetOptions = [3, 5, 10, 15, 20, 25, 30]

interface Props {
  user: any
  favoriteBooks: any[]
}

const props = defineProps<Props>()

const readBooksCount = ref(0)
const readingGoals = ref<ReadingGoal[]>([])

const isGoalModalOpen = ref(false)
const newGoalType = ref<ReadingGoalType>('readBooks')
const newGoalTarget = ref(5)

const favoriteGenresCount = computed(() => {
  const genres = new Set(
    props.favoriteBooks.map((book) => String(book.genre ?? '').trim()).filter(Boolean)
  )

  return genres.size
})

const goalStoragePrefix = computed(() => {
  return props.user?.id ?? props.user?.email ?? 'guest'
})

const readProgressStorageKey = computed(() => {
  return `read-progress-${goalStoragePrefix.value}`
})

const goalsStorageKey = computed(() => {
  return `reading-goals-${goalStoragePrefix.value}`
})

const loadReadProgress = () => {
  const storedValue = localStorage.getItem(readProgressStorageKey.value)
  const parsed = Number(storedValue)

  readBooksCount.value = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

const loadGoals = () => {
  const raw = localStorage.getItem(goalsStorageKey.value)

  if (!raw) {
    readingGoals.value = []
    return
  }

  try {
    const parsed = JSON.parse(raw) as ReadingGoal[]
    readingGoals.value = Array.isArray(parsed)
      ? parsed.filter((goal) => goal?.type && goal?.target > 0)
      : []
  } catch {
    readingGoals.value = []
  }
}

const updateReadCount = (value: number) => {
  readBooksCount.value = Math.max(0, value)
}

const openGoalModal = () => {
  newGoalType.value = 'readBooks'
  newGoalTarget.value = 5
  isGoalModalOpen.value = true
}

const closeGoalModal = () => {
  isGoalModalOpen.value = false
}

const addGoal = () => {
  if (!newGoalTarget.value || newGoalTarget.value < 1) {
    return
  }

  readingGoals.value = [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      type: newGoalType.value,
      target: newGoalTarget.value,
      createdAt: Date.now()
    },
    ...readingGoals.value
  ]

  closeGoalModal()
}

const removeGoal = (goalId: string) => {
  readingGoals.value = readingGoals.value.filter((goal) => goal.id !== goalId)
}

const getGoalTypeLabel = (type: ReadingGoalType) => {
  const option = goalTypeOptions.find((goalType) => goalType.type === type)
  return option?.label ?? 'Goal'
}

const getProgressForType = (type: ReadingGoalType) => {
  if (type === 'readBooks') {
    return readBooksCount.value
  }

  if (type === 'favoriteBooks') {
    return props.favoriteBooks.length
  }

  return favoriteGenresCount.value
}

const getGoalProgress = (goal: ReadingGoal) => {
  const progress = getProgressForType(goal.type)
  const normalized = Math.min(progress, goal.target)
  const percent = Math.round((normalized / goal.target) * 100)
  const remaining = Math.max(goal.target - progress, 0)

  return {
    progress,
    normalized,
    percent,
    remaining
  }
}

watch(
  readBooksCount,
  () => {
    localStorage.setItem(readProgressStorageKey.value, String(readBooksCount.value))
  },
  { immediate: false }
)

watch(
  readingGoals,
  () => {
    localStorage.setItem(goalsStorageKey.value, JSON.stringify(readingGoals.value))
  },
  { deep: true }
)

onMounted(() => {
  loadReadProgress()
  loadGoals()
})
</script>

<template>
  <section class="mb-12 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 shadow-xl">
    <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-white">
          Reading Goals
        </h2>
        <p class="text-gray-400">
          Choose a goal type, pick a target, and stay motivated.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg bg-purple-500 px-5 py-2.5 font-semibold text-white hover:bg-purple-600 transition"
        @click="openGoalModal"
      >
        + Set New Goal
      </button>
    </div>

    <div class="mb-6 rounded-xl border border-gray-700 bg-gray-900/60 p-4">
      <p class="mb-3 text-sm text-gray-300">Update books read progress</p>
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-gray-700 px-3 py-2 text-white hover:bg-gray-600 transition"
          @click="updateReadCount(readBooksCount - 1)"
        >
          -1
        </button>
        <button
          type="button"
          class="rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white hover:bg-purple-600 transition"
          @click="updateReadCount(readBooksCount + 1)"
        >
          Mark One Book Read
        </button>
        <button
          type="button"
          class="rounded-lg bg-gray-700 px-3 py-2 text-white hover:bg-gray-600 transition"
          @click="updateReadCount(0)"
        >
          Reset
        </button>
        <span class="text-sm text-gray-400">Current count: {{ readBooksCount }}</span>
      </div>
    </div>

    <div v-if="readingGoals.length === 0" class="rounded-xl border border-dashed border-gray-700 p-6 text-gray-400">
      No goals yet. Click "Set New Goal" to create your first goal.
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article
        v-for="goal in readingGoals"
        :key="goal.id"
        class="rounded-xl border border-gray-700 bg-gray-900/70 p-4"
      >
        <div class="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-white">{{ getGoalTypeLabel(goal.type) }}</h3>
            <p class="text-sm text-gray-400">Target: {{ goal.target }}</p>
          </div>
          <button
            type="button"
            class="text-xs text-red-300 hover:text-red-200"
            @click="removeGoal(goal.id)"
          >
            Remove
          </button>
        </div>

        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="text-gray-300">Progress</span>
          <span class="text-gray-400">{{ getGoalProgress(goal).normalized }} / {{ goal.target }}</span>
        </div>

        <div class="h-3 w-full overflow-hidden rounded-full bg-gray-700">
          <div
            class="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
            :style="{ width: `${getGoalProgress(goal).percent}%` }"
          ></div>
        </div>

        <p
          v-if="getGoalProgress(goal).remaining === 0"
          class="mt-3 rounded-lg border border-green-500/40 bg-green-500/10 p-2 text-sm text-green-300"
        >
          Goal completed. Great work!
        </p>
        <p
          v-else
          class="mt-3 text-sm text-gray-400"
        >
          {{ getGoalProgress(goal).remaining }} remaining
        </p>
      </article>
    </div>

    <div
      v-if="isGoalModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      @click.self="closeGoalModal"
    >
      <div class="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <h3 class="text-xl font-semibold text-white mb-4">Set New Reading Goal</h3>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-300">Goal type</label>
          <select
            v-model="newGoalType"
            class="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-purple-400"
          >
            <option
              v-for="goalType in goalTypeOptions"
              :key="goalType.type"
              :value="goalType.type"
            >
              {{ goalType.label }}
            </option>
          </select>
          <p class="mt-2 text-xs text-gray-400">
            {{ goalTypeOptions.find((goalType) => goalType.type === newGoalType)?.subtitle }}
          </p>
        </div>

        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-300">Target number</label>
          <select
            v-model.number="newGoalTarget"
            class="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-purple-400"
          >
            <option
              v-for="target in goalTargetOptions"
              :key="target"
              :value="target"
            >
              {{ target }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800 transition"
            @click="closeGoalModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white hover:bg-purple-600 transition"
            @click="addGoal"
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
