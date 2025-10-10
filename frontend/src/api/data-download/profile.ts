import {
  apiBaseUrl,
  CustomFetchBaseQueryError,
  defaultApiError,
  profileApi as baseProfileApi,
} from '../../store/api/base.ts';
import { PROFILES_API } from '../../store/api/profile.ts';
import { ApiErrorType } from '../../types/api/BaseTypes.ts';

export interface FetchSuccess {
  data: string;
  error?: CustomFetchBaseQueryError;
}

export interface FetchError {
  data?: string;
  error: CustomFetchBaseQueryError;
}

export const fetchMyProfileImage = async (): Promise<
  FetchSuccess | FetchError
> => {
  const url = apiBaseUrl + '/api' + baseProfileApi + PROFILES_API + '/me/image';
  const token = localStorage.getItem('token');

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorMessage = defaultApiError;
      try {
        const errorData = (await response.json()) as ApiErrorType;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (error) {
        console.error('Error parsing error response:', error);
      }

      return {
        error: {
          status: response.status,
          message: errorMessage,
        },
      };
    }

    try {
      const imageData = await response.blob();
      return {
        data: URL.createObjectURL(imageData),
      };
    } catch (error) {
      console.error('Error creating object URL:', error);
      return {
        error: {
          status: 'PARSING_ERROR',
          message: 'Error parsing image data.',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        message: 'Error fetching profile image.',
      },
    };
  }
};
