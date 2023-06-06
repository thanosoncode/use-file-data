import { useEffect, useReducer, useRef } from 'react';
import { readFileAsDataUrl, validTypeFiles } from './helpers';

type Item = { file: File; id: number; data: string };

type State = {
  result: Item[] | null;
  isLoadingPreviews: boolean;
  //@ts-ignore
  error: any;
  isError: boolean;
  localFiles: FileList | null;
};

const initialState = {
  result: null,
  localFiles: null,
  isLoadingPreviews: false,
  error: null,
  isError: false,
};

type Action =
  | { type: 'PREVIEW_START' }
  | { type: 'PREVIEW_SUCCESS'; result: Item[] }
  | { type: 'PREVIEW_FAIL'; error: any; isError: boolean }
  | { type: 'VALIDATION_FAIL' }
  | { type: 'SET_LOCAL_FILES'; files: FileList | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PREVIEW_START':
      return { ...state, isLoadingPreviews: true };
    case 'PREVIEW_SUCCESS':
      return { ...state, isLoadingPreviews: false, result: action.result };
    case 'PREVIEW_FAIL':
      return {
        ...state,
        isLoadingPreviews: false,
        error: action.error,
        isError: action.isError,
      };
    case 'VALIDATION_FAIL':
      return { ...state, error: 'Invalid image types', isError: true };
    case 'SET_LOCAL_FILES':
      return { ...state, localFiles: action.files };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};

export const useFileData = ({
  imageTypes = [],
  onSucess,
  onError,
}: {
  imageTypes?: string[];
  onSucess?: (result: Item[]) => void;
  //@ts-ignore
  onError?: (error: any) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      dispatch({ type: 'SET_LOCAL_FILES', files });

      const valid = validTypeFiles(imageTypes, files);
      if (!valid) {
        dispatch({ type: 'VALIDATION_FAIL' });
        onError && onError(state.error);
      }
      getPreviews(files);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.files = state.localFiles;
    }
  }, [inputRef, state.result]);

  const register = {
    onChange,
    accept: imageTypes.join(', '),
    ref: inputRef,
  };

  const getPreviews = async (files: FileList | null) => {
    try {
      if (!files) return;
      dispatch({ type: 'PREVIEW_START' });
      const promises = Array.from(files).map((file) => readFileAsDataUrl(file));
      const previews = await Promise.all(promises);

      const items = Array.from(files).map((file, i) => ({
        file,
        id: i,
        data: previews[i],
      }));

      dispatch({ type: 'PREVIEW_SUCCESS', result: items });
      onSucess && onSucess(items);
      //@ts-ignore
    } catch (error: any) {
      dispatch({ type: 'PREVIEW_FAIL', error, isError });
      onError && onError(error);
    }
  };

  const { isLoadingPreviews, error, result, isError } = state;

  return { isLoadingPreviews, error, result, isError, register };
};
