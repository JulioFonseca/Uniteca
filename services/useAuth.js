import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = getAuth();

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuth;
