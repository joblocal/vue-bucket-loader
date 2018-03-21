<template>
  <div>
    <h1>VueBucketLoader</h1>
    <p>A simple vue component to upload files to s3</p>

    <h2>Basic Implementation</h2>
    <p>When your presigning endpoint is the same for any upload:</p>
    <pre>
      <code>
        {{ staticEndpointExample }}
      </code>
    </pre>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    />

    <h2>Url generation using callback function</h2>
    <p>When your presinging endpoint must be generated dynamically:</p>
    <pre>
      <code>
        {{ dynamicEndpointExample }}
      </code>
    </pre>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    />

    <h2>Checking MIME-Types</h2>
    <p>When you want your Files to checked for MIME-Types</p>
    <pre>
      <code>
        {{ mimeTypeCheckExample }}
      </code>
    </pre>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
      :beforeUpload="checkMimeType"
    />

    <h2>Customizing file items</h2>
    <p>You can use the scoped slot "item" to provide a custom list item for uploaded files.</p>
    <pre>
      <code>
        {{ customFileItemExample }}
      </code>
    </pre>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
      ref="customFileItemBucketLoader"
    >
      <li
        slot="item"
        slot-scope="props"
      >
        {{ props.item.file.name }}
        <button @click.prevent="$refs.customFileItemBucketLoader.handleFileDeleted(props.item)">
          delete from s3
        </button>
      </li>
    </VueBucketLoader>

  </div>
</template>

<script>
import VueBucketLoader from '../../../src/components/VueBucketLoader';

export default {
  components: {
    VueBucketLoader,
  },

  data: () => ({
    staticEndpointExample: `
      <VueBucketLoader
        :signingUrl="'https://httpbin.org/post'"
      />`,

    dynamicEndpointExample: `
      <VueBucketLoader
        :signungUrl="() => 'generatedEndpoint'"
      />
    `,

    mimeTypeCheckExample: `
      <VueBucketLoader
        :signungUrl="'https://httpbin.org/post'"
        :beforeUpload="(file) => checkYourMimeType(file)"
      />
    `,

    customFileItemExample: `
      <VueBucketLoader
        :signingUrl="'https://httpbin.org/post'"
        ref="customFileItemBucketLoader"
      >
        <li
          slot="item"
          slot-scope="props"
        >
          {{ props.item.file.name }}
          <button @click.prevent="$refs.customFileItemBucketLoader.handleFileDeleted(props.item)">
            delete from s3
          </button>
        </li>
      </VueBucketLoader>
    `,
  }),

  methods: {
    checkMimeType: file => ['image/png', 'image/jpg'].includes(file.type),
  },
};
</script>

