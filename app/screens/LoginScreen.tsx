import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, useColorScheme } from 'react-native';
import { auth, firestore } from '../firebaseConfig'; // Adjust the path if needed
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// Define the navigation types
type RootStackParamList = {
  '(tabs)': undefined; // Define the main tabs route
  ProfileSetupScreen: undefined;
  Home: undefined; // If you have a Home route, add it here
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('(tabs)'); // Navigate to main tabs
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save basic user info to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
      });
  
      // Redirect to Profile Setup screen
      navigation.navigate('ProfileSetupScreen');
    } catch (error: any) {
      setError(error.message);
    }
  };
  

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <Text style={[styles.title, colorScheme === 'dark' && styles.titleDark]}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </Text>

      {isSignUp && (
        <>
          <TextInput
            style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
            placeholder="First Name"
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
            placeholder="Last Name"
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}

      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
        placeholder="Email"
        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
        placeholder="Password"
        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        {isSignUp ? (
          <>
            <Button title="Sign Up" onPress={handleSignUp} color={colorScheme === 'dark' ? '#f0a' : '#007AFF'} />
            <Button title="Already have an account? Login" onPress={() => setIsSignUp(false)} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={handleLogin} color={colorScheme === 'dark' ? '#f0a' : '#007AFF'} />
            <Button title="Don't have an account? Sign Up" onPress={() => setIsSignUp(true)} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
  },
  titleDark: {
    color: '#FFF',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#000',
  },
  inputDark: {
    borderColor: '#555',
    color: '#FFF',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
