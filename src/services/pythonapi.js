import axios from 'axios';
import { getToken } from '../utils/tokenManager';  // 토큰 가져오기 함수 사용

export const uploadFile1 = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post('http://localhost:8000/upload_excel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};

export const uploadFile2 = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post('http://localhost:8000/upload_category/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};

export const uploadFile3 = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post('http://localhost:8000/upload_margin/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};
