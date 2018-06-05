<template>
  <div class="vue-bucket-loader" :class="className">
    <ul v-if="files.length > 0" class="vue-bucket-loader__list">
      <slot
        name="list-item"
        v-for="(fileItem, key) in files"
        :item="fileItem"
        :className="listItemClassNames(fileItem)"
      >
        <li :key="key" :class="className">
          {{ fileItem.file.name }}
          <button
            @click.prevent="handleFileDeleted(fileItem)"
            v-if="fileItem.location"
          >
            delete
          </button>
        </li>
      </slot>
    </ul>

    <label
      class="vue-bucket-loader__label"
      @drop.prevent.stop="handleFilesDropped($event)"
      @dragover.prevent.stop
    >
      <slot name="label"></slot>
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
    className: [String, Object, Array],
  },

  methods: {
    listItemClassNames({ state, location }) {
      const classNames = ['vue-bucket-loader__list-item'];

      if (state === 'loading') {
        classNames.push('vue-bucket-loader__list-item--loading');
      }
      if (state === 'success' && location !== null) {
        classNames.push('vue-bucket-loader__list-item--success');
      }
      if (state === 'error' && location === null) {
        classNames.push('vue-bucket-loader__list-item--error');
      }

      return classNames;
    },

    handleFilesDropped(event) {
      this.handleFilesAdded(event.dataTransfer.files);
    },

    handleFilesAdded(fileList) {
      const files = Object.keys(fileList).map(key => fileList[key]);
      this.$emit('add-files-before', { files });

      files.forEach(async (file) => {
        if (this.beforeUpload(file)) {
          const fileItem = {
            file,
            state: 'loading',
            location: null,
          };

          this.files.push(fileItem);

          try {
            fileItem.location = await this.uploadFile(file);
            fileItem.state = 'success';
          } catch (error) {
            fileItem.state = 'error';
            throw error;
          }
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

      return location;
    },

    /**
     * When a file should be deleted we remove it from s3
     * and the files array
    */
    async handleFileDeleted(file) {
      this.$emit('delete-file-before', { file });

      try {
        // delete the file from s3
        if (file.location !== null) {
          await axios.delete(file.location);
        }

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
