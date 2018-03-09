<template>
  <div class="vue-bucket-loader">
    <input
       class="vue-bucket-loader__input"
       type="file"
       multiple
       @change="handleFileAdded($event.target.files)"
    >
  </div>
</template>

<script>
import { post } from 'axios';

export default {
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },

  methods: {
    async handleFileAdded(fileList) {
      if (this.endpoint) {
        Object.keys(fileList).forEach(async (key) => {
          const file = fileList[key];
          const formData = new FormData();
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };

          try {
            const presignedUrl = await post(this.endpoint);

            Object.keys(presignedUrl.data.signature).forEach((key) => {
              formData.append(key, presignedUrl.data.signature[key]);
            });

            formData.append('file', file);

            try {

              await post(presignedUrl.data.postEndpoint, formData, config);

            } catch (e) {
              console.log(e);
            }

          } catch (e) {
            console.log(e);
          }

        });
      }
    },
  },
};
</script>

<style lang="css">
  .vue-bucket-loader {
    width: 100%;
    height: 400px;
  }

  .vue-bucket-loader__input {
    width: 100%;
    height: 100%;
    background: pink;
  }
</style>
