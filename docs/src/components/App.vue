<template>
  <div>
    <h1>VueBucketLoader</h1>
    <p>A simple vue component to upload files to s3</p>

    <h2>Basic Implementation</h2>
    <p>When your presigning endpoint is the same for any upload:</p>
    <code>
      {{ staticEndpointExample }}
    </code>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    />

    <h2>Url generation using callback function</h2>
    <p>When your presinging endpoint must be generated dynamically:</p>
    <code>
      {{ dynamicEndpointExample }}
    </code>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
    />

    <h2>Checking MIME-Types</h2>
    <p>When you want your Files to checked for MIME-Types</p>
    <code>
      {{ mimeTypeCheckExample }}
    </code>
    <VueBucketLoader
      :signingUrl="'https://httpbin.org/post'"
      :beforeUpload="checkMimeType"
    />

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
        :signungUrl="() => 'generatedEndpoint'">
    `,

    mimeTypeCheckExample: `
      <VueBucketLoader
        :signungUrl="'https://httpbin.org/post'"
        :beforeUpload="(file) => checkYourMimeType(file)"
      />
    `,
  }),

  methods: {
    checkMimeType: file => ['image/png', 'image/jpg'].includes(file.type),
  },
};
</script>

