import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GuestsScreen = () => {
  const [guests, setGuests] = useState([]);
  const [carType, setCarType] = useState('');
  const [carColor, setCarColor] = useState('');
  const [firstLetter, setFirstLetter] = useState('');
  const [secondLetter, setSecondLetter] = useState('');
  const [thirdLetter, setThirdLetter] = useState('');
  const [firstNo, setFirstNo] = useState('');
  const [secondNo, setSecondNo] = useState('');
  const [thirdNo, setThirdNo] = useState('');
  const [fourthNo, setFourthNo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // جلب التوكن من AsyncStorage
  const [token, setToken] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('token').then(setToken);
  }, []);

  // جلب الزوار
  const fetchGuests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cars/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      if (data && Array.isArray(data.Cars)) {
        setGuests(data.Cars.filter((car) => car.is_guest));
      } else {
        setGuests([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching guests');
    }
  };

  useEffect(() => {
    if (token) fetchGuests();
  }, [token]);

  // إضافة زائر
  const handleAddGuest = async () => {
    const payload = {
      car: { carType, carColor },
      carNo: { firstLetter, secondLetter, thirdLetter, firstNo, secondNo, thirdNo, fourthNo },
    };

    try {
      const response = await axios.post('http://localhost:8000/api/guest/add/', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setCarType('');
        setCarColor('');
        setFirstLetter('');
        setSecondLetter('');
        setThirdLetter('');
        setFirstNo('');
        setSecondNo('');
        setThirdNo('');
        setFourthNo('');
        fetchGuests();
        setSuccessMessage('Guest added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        Alert.alert('Error', 'Failed to add guest');
      }
    } catch (error) {
      Alert.alert('Error', 'Error adding guest');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Guests List</Text>
        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.inputGrid}>
          <TextInput placeholder="Car Type" value={carType} onChangeText={setCarType} style={styles.input} />
          <TextInput placeholder="Car Color" value={carColor} onChangeText={setCarColor} style={styles.input} />
          <View style={styles.plateRow}>
            <TextInput placeholder="First Letter" value={firstLetter} onChangeText={setFirstLetter} style={styles.plateInput} maxLength={1} />
            <TextInput placeholder="Second Letter" value={secondLetter} onChangeText={setSecondLetter} style={styles.plateInput} maxLength={1} />
            <TextInput placeholder="Third Letter" value={thirdLetter} onChangeText={setThirdLetter} style={styles.plateInput} maxLength={1} />
            <TextInput placeholder="First No" value={firstNo} onChangeText={setFirstNo} style={styles.plateInput} maxLength={1} keyboardType="numeric" />
            <TextInput placeholder="Second No" value={secondNo} onChangeText={setSecondNo} style={styles.plateInput} maxLength={1} keyboardType="numeric" />
            <TextInput placeholder="Third No" value={thirdNo} onChangeText={setThirdNo} style={styles.plateInput} maxLength={1} keyboardType="numeric" />
            <TextInput placeholder="Fourth No" value={fourthNo} onChangeText={setFourthNo} style={styles.plateInput} maxLength={1} keyboardType="numeric" />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
            <Text style={styles.addButtonText}>Add Guest</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={guests}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.guestCard}>
              <Text style={styles.guestText}>
                {item.carType} - {item.carColor} - {item.carNo}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No guests found.</Text>}
          style={{ marginTop: 20, width: '100%' }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    alignSelf: 'center',
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
  },
  successBox: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputGrid: {
    marginBottom: 18,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  plateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  plateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    width: 48,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  guestCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  guestText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GuestsScreen;
