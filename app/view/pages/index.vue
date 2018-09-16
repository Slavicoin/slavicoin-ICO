<style scoped>

</style>
<script>
  import axios from 'axios';

  export default {
    name: "index",
    data: function () {
      const result = axios.get('/api/health');

      return {
        test: 'hello world',
      };
    }
  }
</script>

<template>
    <div>
        {{ test }}
    </div>
</template>

