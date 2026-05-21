const useTheme = () => {
  const colorMode = useColorMode()
  const theme = computed(() => colorMode.value)
  const isDark = computed(() => colorMode.value === 'dark')
  const ready = ref(false)

  onMounted(() => {
    ready.value = true
  })

  const toggleDark = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  return {
    isDark,
    theme,
    toggleDark,
    ready
  }
}

export default useTheme
