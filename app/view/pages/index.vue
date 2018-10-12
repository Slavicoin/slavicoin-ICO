<style scoped>

</style>
<script>
  export default {
    name: "index",
    data: function () {
      return {
        test: 'hello world',
      };
    }
  }
</script>

<template>
    <div>
        Hello world <br />

        this is test :)

        message: {{ test }}
    </div>
</template>

