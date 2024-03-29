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
      @dragover.prevent.stop="$emit('onDragOver')"
    >
      <slot
        name="label"
        :files="files"
      ></slot>
      <input
        ref="fileInput"
        :accept="acceptedTypes"
        class="vue-bucket-loader__input"
        type="file"
        :multiple="allowMultipleFiles"
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
    allowMultipleFiles: {
      type: Boolean,
      default: true,
    },

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
    allowedFileExtensions: {
      type: Array,
      default: () => [],
    },

    allowedMimeTypes: {
      type: Array,
      default: () => [],
    },

    existingFiles: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    acceptedTypes() {
      return [...this.allowedFileExtensions, ...this.allowedMimeTypes].join(',');
    },
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
      this.$emit('onDrop');
      this.handleFilesAdded(event.dataTransfer.files);
    },

    async handleFilesAdded(fileList) {
      const files = Object.keys(fileList).map(key => fileList[key]);
      this.$refs.fileInput.value = '';
      this.$emit('add-files-before', { files });

      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const uploadState = await this.beforeUpload(file);
        const uploadFile = uploadState instanceof File ? uploadState : file;

        if (uploadState
            && !this.files.some(currentFile => currentFile.file.name === uploadFile.name)
        ) {
          const fileItem = {
            file: uploadFile,
            state: 'loading',
            location: null,
          };

          this.files.push(fileItem);

          try {
            /* eslint-disable-next-line no-await-in-loop */
            fileItem.location = await this.uploadFile(uploadFile);
            fileItem.state = 'success';
            this.$emit('add-file-success', fileItem);
          } catch (error) {
            fileItem.state = 'error';
            this.$emit('add-file-error', { fileItem, error });
          }
        }
      }
    },

    async uploadFile(file) {
      const {
        data: {
          postEndpoint,
          signature,
        },
      } = await this.getPresignedUrl(file);

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
      }
    },

    /**
     * In order to upload to s3 without publishing your AWS credentials,
     * we need a backend service which provides a presigned url:
     * https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html
    */
    async getPresignedUrl(file = {}) {
      let url = this.signingUrl;

      if (typeof this.signingUrl === 'function') {
        url = await this.signingUrl(file);
      }
      return axios.post(url);
    },
  },

  mounted() {
    this.files = [
      ...this.existingFiles,
      ...this.files,
    ];
  },
};
</script>
