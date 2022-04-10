/* eslint-disable no-param-reassign */
import axios from 'axios';
import store from '@/_core/store';
import Settings from '@/plugins/appSettings';

const Api = () => {
  const axoisApi = axios.create({
    baseURL: Settings.serverSettings.baseUrl,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  axoisApi.interceptors.request.use((config) => {
    store.dispatch('appSettings/setAppConfig', {
      inProgress: true,
    });

    return config;
  });

  axoisApi.interceptors.response.use((response) => {
    store.dispatch('appSettings/setAppConfig', {
      inProgress: false,
    });
    return response;
  });

  return axoisApi;
};

export {
  Api,
  Settings,
};
