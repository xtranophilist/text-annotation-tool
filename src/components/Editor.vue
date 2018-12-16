<template>
  <div>
    <h2>Editor</h2>
    {{selected}}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Editor',
  computed: {
    ...mapState(['selected']),
  }
}
</script>


<style scoped>

</style>
