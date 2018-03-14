<template>
  <div class="vue-bucket-loader">
    <input
      class="vue-bucket-loader__input"
      type="file"
      multiple
      @change="handleFileAdded($event.target.files)"
    >
    <ul>
      <li
        v-for="(fileWrapper, key) in files"
        :key="key"
      >
        {{ fileWrapper.file.name }}
        <button @click="handleFileDeleted(files[key])">remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    files: [],
  }),

  props: {
    presignedUrlEndpoint: {
      type: String,
      required: false,
      default: null,
    },
    presignedUrlEndpointCallback: {
      type: Function,
      required: false,
    },
    mimeTypes: {
      type: Array,
      required: false,
    },
  },

  mounted() {
    if (this.presignedUrlEndpoint === null && typeof this.presignedUrlEndpointCallback !== 'function') {
      throw Error('vue-bucket-loader: Please provide an endpoint or a endpointCallback function');
    }
  },

  methods: {
    async handleFileDeleted(file) {
      try {
        await axios.delete(file.location);
        const index = this.files.findIndex(element => element === file);
        this.files.splice(index, 1);
      } catch (e) {
        throw e;
      }
    },

    async handleFileAdded(fileList) {
      this.$emit('fileAdded');

      const url = await this.getPresignedUrlEndpoint();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      Object.keys(fileList).forEach(async (key) => {
        const fileWrapper = {
          file: fileList[key],
          location: null,
        };

        try {
          const presignedUrl = await this.getPresignedUrl(url);
          const formData = this.prepareForm(presignedUrl, fileWrapper.file);

          if (this.mimeTypes && this.checkMimeType(fileWrapper.file.type)) {
            const response = await this.uploadFile(presignedUrl, formData, config);
            fileWrapper.location = response.headers.location;
            this.files.push(fileWrapper);
          } else {
            console.log('vue-bucket-loader: Please make sure, that your file has the correct mime type');
          }
        } catch (e) {
          throw e;
        }
      });
    },

    async getPresignedUrlEndpoint() {
      let url = this.presignedUrlEndpoint;

      if (!url) {
        url = await this.presignedUrlEndpointCallback();
        if (typeof url.then !== 'function') {
          console.log('vue-bucket-loader: Cannot create presignedUrl request. Make sure that your endpoint configuration is valid');
        }
      }

      return url;
    },

    checkMimeType(type) {
      return this.mimeTypes.includes(type);
    },

    async getPresignedUrl(url) {
      return axios.post(url);
    },

    prepareForm(presignedUrl, file) {
      const formData = new FormData();

      Object.keys(presignedUrl.data.signature).forEach((key) => {
        formData.append(key, presignedUrl.data.signature[key]);
      });

      formData.append('file', file);
      return formData;
    },

    async uploadFile(presignedUrl, formData, config) {
      return axios.post(presignedUrl.data.postEndpoint, formData, config);
    },
  },
};
</script>
