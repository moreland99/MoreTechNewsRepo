import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type RootStackParamList = {
  Home: undefined;
};

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const techInterestsOptions = ['Mobile Development', 'JavaScript', 'AI', 'Cloud Services', 'Web Development'];

const ProfileSetupScreen = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const auth = getAuth();
  const [username, setUsername] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user.');

      // Save profile details to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        techInterests: selectedInterests,
      }, { merge: true });

      navigation.navigate('Home'); // Navigate to the main screen after setup
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Select Your Tech Interests:</Text>
      <FlatList
        data={techInterestsOptions}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleInterest(item)}>
            <Text style={[styles.interest, selectedInterests.includes(item) && styles.selectedInterest]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  interest: {
    fontSize: 16,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedInterest: {
    backgroundColor: '#007AFF',
    color: '#FFF',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ProfileSetupScreen;
