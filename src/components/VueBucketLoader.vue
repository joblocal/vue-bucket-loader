<template>
  <div class="vue-bucket-loader">
    <ul>
      <li
        v-for="(fileWrapper, key) in files"
        :key="key"
      >
        {{ fileWrapper.file.name }}
        <button @click="handleFileDeleted(fileWrapper)">
          <slot></slot>
        </button>
      </li>
    </ul>

    <label class="vue-bucket-loader__label">
      <input
        class="vue-bucket-loader__input"
        type="file"
        multiple
        @change="handleFilesAdded($event.target.files)"
      />
    </label>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    files: [],
  }),

  props: {
    signingUrl: {
      type: [String, Function],
      required: true,
    },
    beforeUpload: {
      type: Function,
      required: false,
      default: () => true,
    },
  },

  methods: {
    handleFilesAdded(fileList) {
      const files = Object.keys(fileList).map(key => fileList[key]);
      this.$emit('add-files-before', { files });

      files.forEach((file) => {
        if (this.beforeUpload(file)) {
          this.uploadFile(file);
        }
      });
    },

    async uploadFile(file) {
      const {
        data: {
          postEndpoint,
          signature,
        },
      } = await this.getPresignedUrl();

      const formData = new FormData();
      Object.keys(signature).forEach((key) => {
        formData.append(key, signature[key]);
      });

      formData.append('file', file);

      const {
        headers: {
          location,
        },
      } = await axios.post(
        postEndpoint,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      this.files.push({
        file,
        location,
      });
    },

    /**
     * When a file should be deleted we remove it from s3
     * and the files array
    */
    async handleFileDeleted(file) {
      this.$emit('delete-file-before', { file });
      try {
        // delete the file from s3
        await axios.delete(file.location);
        // remove the item from the files array
        this.files.splice(
          this.files.findIndex(item => item === file),
          1,
        );
        this.$emit('delete-file-success', { file });
      } catch (error) {
        this.$emit('delete-file-error', { file, error });
        throw error;
      }
    },

    /**
     * In order to upload to s3 without publishing your AWS credentials,
     * we need a backend service which provides a presigned url:
     * https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html
    */
    async getPresignedUrl() {
      let url = this.signingUrl;

      if (typeof this.signingUrl === 'function') {
        url = await this.signingUrl();
      }
      return axios.post(url);
    },
  },
};
</script>
