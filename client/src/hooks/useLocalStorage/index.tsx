type localStorageProps = {
  key: string;
  value: string;
};

export const useLocalStorage = () => {
  const setItem = ({ key, value }: localStorageProps): void => {
    localStorage.setItem(key, value);
  };

  const getItem = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
