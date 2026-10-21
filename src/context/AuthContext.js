import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.payload,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload.token,
            userData: action.payload.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userData: null,
          };
        case 'UPDATE_USER':
          return {
            ...prevState,
            userData: action.payload,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userData: null,
    }
  );

  // Bootstrap async
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        let userToken;
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');

        if (token && userData) {
          userToken = token;
          api.setAuthToken(token);
        }

        dispatch({ type: 'RESTORE_TOKEN', payload: userToken });
      } catch (e) {
        // Restoring token failed
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (username, password) => {
      try {
        const userData = await api.login(username, password);
        dispatch({
          type: 'SIGN_IN',
          payload: { token: userData.id, user: userData },
        });
        api.setAuthToken(userData.id);
        return { success: true, data: userData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    signOut: async () => {
      try {
        await api.clearStorage();
        dispatch({ type: 'SIGN_OUT' });
      } catch (error) {
        console.error('Sign out error:', error);
      }
    },
    signUp: async (data) => {
      // Implement sign up logic if needed
      return { success: false, error: 'Not implemented' };
    },
  };

  return (
    <AuthContext.Provider value={{ state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};
