import { mount } from '@vue/test-utils';
import axios from 'axios';

import VueBucketLoader from 'src/components/VueBucketLoader';

const postEndpoint = 's3://localhost/postEndpoint';
const location = 's3://localhost/file.jpg';
const signature = { key: 'value' };
const file = { name: 'file.jpg' };
const signingUrl = 'http://localhost';
const files = [
  { name: 'file 1' },
  { name: 'file 2' },
];
const fileList = {
  0: files[0],
  1: files[1],
};
const result = [
  {
    file,
    location: null,
    state: 'loading',
  },
];

let wrapper;

jest.mock('axios');

beforeEach(() => {
  wrapper = mount(VueBucketLoader, {
    propsData: {
      signingUrl,
    },
  });
  const getPresignedUrl = jest.fn()
    .mockReturnValue({
      data: {
        postEndpoint,
        signature,
      },
    });
  axios.post = jest.fn()
    .mockReturnValue({
      headers: {
        location,
      },
    });
  wrapper.setMethods({
    getPresignedUrl,
  });
});

describe('adding files', () => {
  test('to call handleFilesAdded on change', () => {
    const handleFilesAdded = jest.fn();
    wrapper.setMethods({
      handleFilesAdded,
    });
    wrapper.find('input[type=file]').trigger('change');
    expect(handleFilesAdded).toBeCalled();
  });

  test('to pass file list on drop', () => {
    const handleFilesAdded = jest.fn();
    wrapper.setMethods({
      handleFilesAdded,
    });
    wrapper.find('label').trigger('drop', {
      dataTransfer: {
        files: [],
      },
    });
    expect(handleFilesAdded).toBeCalled();
  });

  test('to emit "files-added-before" event', () => {
    wrapper.vm.handleFilesAdded(fileList);
    expect(wrapper.emitted('add-files-before')[0][0])
      .toEqual({ files });
  });

  test('to call beforeUpload for each file', async () => {
    const beforeUpload = jest.fn();
    wrapper.setProps({
      beforeUpload,
    });

    await wrapper.vm.handleFilesAdded(fileList);
    await wrapper.vm.$nextTick();
    expect(beforeUpload).toHaveBeenCalledTimes(2);
  });

  test('to call uploadFile for each file', async () => {
    const uploadFile = jest.fn();
    wrapper.setMethods({
      uploadFile,
    });

    await wrapper.vm.handleFilesAdded(fileList);
    await wrapper.vm.$nextTick();
    expect(uploadFile).toHaveBeenCalledTimes(2);
  });

  test('to take adjusted file from beforeUpload', async () => {
    const newFile = new File([], 'new.png');
    const beforeUpload = () => newFile;
    wrapper.setProps({
      beforeUpload,
    });
    const uploadFile = jest.fn();
    wrapper.setMethods({
      uploadFile,
    });

    await wrapper.vm.handleFilesAdded([new File([], 'original.png')]);

    expect(wrapper.vm.files[0].file).toBe(newFile);
  });
});

describe('upload file', () => {
  test('to upload file via post', async () => {
    const formData = new FormData();
    formData.append('key', 'value');
    formData.append('file', file);

    await wrapper.vm.uploadFile(file);

    expect(axios.post).toBeCalledWith(
      postEndpoint,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  });

  test('to add file to files array', async () => {
    result[0].location = location;
    result[0].state = 'success';
    await wrapper.vm.handleFilesAdded([file]);
    expect(wrapper.vm.files).toEqual(result);
  });

  test('to add file with success state', async () => {
    result[0].location = location;
    result[0].state = 'success';

    await wrapper.vm.handleFilesAdded([file]);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('add-file-success')[0])
      .toEqual(result);
    expect(wrapper.vm.files).toEqual(result);
  });

  test('to not add file and have error state', async () => {
    const error = 'Server error';

    result[0].location = null;
    result[0].state = 'error';

    axios.post.mockReturnValue(Promise.reject(error));

    await wrapper.vm.handleFilesAdded([file]);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('add-file-error')[0][0])
      .toEqual({ error, fileItem: result[0] });
    expect(wrapper.vm.files).toEqual(result);
  });
});
