import { mount } from '@vue/test-utils';
import axios from 'axios';

import VueBucketLoader from 'src/components/VueBucketLoader';

const postEndpoint = 's3://localhost/postEndpoint';
const location = 's3://localhost/file.jpg';
const signature = { key: 'value' };
const file = { name: 'file.jpg' };
const signingUrl = 'http://localhost';
const files = [
  'file 1',
  'file 2',
];
const fileList = {
  0: files[0],
  1: files[1],
};

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

  test('to call beforeUpload for each file', () => {
    const beforeUpload = jest.fn();
    wrapper.setProps({
      beforeUpload,
    });
    wrapper.vm.handleFilesAdded(fileList);
    expect(beforeUpload).toHaveBeenCalledTimes(2);
  });

  test('to call uploadFile for each file', () => {
    const uploadFile = jest.fn();
    wrapper.setMethods({
      uploadFile,
    });
    wrapper.vm.handleFilesAdded(fileList);
    expect(uploadFile).toHaveBeenCalledTimes(2);
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
    await wrapper.vm.uploadFile(file);
    expect(wrapper.vm.files).toEqual([
      {
        file,
        location,
      },
    ]);
  });
});
