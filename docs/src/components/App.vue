<template>
  <div class="container-fluid">
    <div class="jumbotron mt-3">
      <h1>VueBucketLoader</h1>
      <p>A simple vue component to upload files to s3</p>
    </div>

    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Basic implementation</h2>
        <p>When your presigning endpoint is the same for any upload:</p>
        <pre class="bg-light rounded p-3 prettyprint border-0"><code>{{ staticEndpointExample }}</code></pre>
        <VueBucketLoader
          :signingUrl="'https://httpbin.org/post'"
        />
      </div>
    </div>

    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Url generation using callback function</h2>
        <p>When your presinging endpoint must be generated dynamically:</p>
        <pre class="bg-light rounded p-3 prettyprint border-0"><code>{{ dynamicEndpointExample }}</code></pre>
        <VueBucketLoader
          :signingUrl="() => 'https://httpbin.org/post'"
        />
      </div>
    </div>

    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Custom label</h2>
        <p>Provide a customized label using the "label" slot.</p>
        <pre class="bg-light rounded p-3 prettyprint border-0"><code>{{ customLabelExample }}</code></pre>
        <VueBucketLoader
          :signingUrl="'https://httpbin.org/post'"
        >
          <template slot="label">
            Upload your files:
          </template>
        </VueBucketLoader>
      </div>
    </div>

    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Checking MIME-Types</h2>
        <p>When you want your Files to checked for MIME-Types</p>
        <pre class="bg-light rounded p-3 prettyprint border-0"><code>{{ mimeTypeCheckExample }}</code></pre>
        <VueBucketLoader
          :signingUrl="'https://httpbin.org/post'"
          :beforeUpload="checkMimeType"
        />
      </div>
    </div>

    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Customizing file items</h2>
        <p>You can use the scoped slot "item" to provide a custom list item for uploaded files.</p>
        <pre class="bg-light rounded p-3 prettyprint border-0"><code>{{ customFileItemExample }}</code></pre>
        <VueBucketLoader
          :signingUrl="'https://httpbin.org/post'"
          ref="customFileItemBucketLoader"
        >
          <li
            slot="list-item"
            slot-scope="props"
            :class="props.className"
          >
            {{ props.item.file.name }}
            <button @click.prevent="$refs.customFileItemBucketLoader.handleFileDeleted(props.item)">
              delete from s3
            </button>
          </li>
        </VueBucketLoader>
      </div>
    </div>
  </div>
</template>

<script>
import VueBucketLoader from '../../../src/components/VueBucketLoader';

export default {
  components: {
    VueBucketLoader,
  },

  data: () => ({
    staticEndpointExample: `<VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    />`,

    dynamicEndpointExample: `<VueBucketLoader
      :signingUrl="() => 'generatedEndpoint'"
    />`,

    customLabelExample: `<VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    >
      <template slot="label">
        Upload your files:
      </template>
    </VueBucketLoader>`,

    mimeTypeCheckExample: `<VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
      :beforeUpload="(file) => checkYourMimeType(file)"
    />`,

    customFileItemExample: `<VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
      ref="customFileItemBucketLoader"
    >
    <li
      slot="list-item"
      slot-scope="props"
    >
      {{ props.item.file.name }}
      <button @click.prevent="$refs.customFileItemBucketLoader.handleFileDeleted(props.item)">
        delete from s3
      </button>
    </li>
    </VueBucketLoader>`,
  }),

  methods: {
    checkMimeType: file => ['image/png', 'image/jpg'].includes(file.type),
  },
};
</script>

