import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lucide from '@react-native-vector-icons/lucide';
import { globalStyles, COLORS } from '../../styles';

export default function SettingScreen() {
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Capteur 1', type: 'A', threshold: 50, active: true },
    { id: 2, name: 'Capteur 2', type: 'A', threshold: 50, active: true },
    { id: 3, name: 'Capteur 3', type: 'A', threshold: 50, active: true },
    { id: 4, name: 'Capteur 4', type: 'A', threshold: 50, active: false },
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('3:00');
  const [selectedDays, setSelectedDays] = useState('Lun - Wed');

  const toggleSensor = (id) => {
    setSensors(sensors.map(sensor =>
      sensor.id === id ? { ...sensor, active: !sensor.active } : sensor
    ));
  };

  const handleChangePassword = () => {
    Alert.alert('Changer le mot de passe', 'Fonctionnalité à implémenter');
  };

  const handleChangeNip = () => {
    Alert.alert('Changer le NIP', 'Fonctionnalité à implémenter');
  };

  const SensorRow = ({ sensor }) => (
    <View style={styles.sensorRow}>
      <Text style={styles.sensorName}>{sensor.name}</Text>
      <Text style={styles.sensorType}>{sensor.type}</Text>
      <Text style={styles.sensorThreshold}>{sensor.threshold}%</Text>
      <Switch
        value={sensor.active}
        onValueChange={() => toggleSensor(sensor.id)}
        trackColor={{ false: '#e0e0e0', true: COLORS.primary }}
        thumbColor={sensor.active ? COLORS.primary : '#f0f0f0'}
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Parametres</Text>
          <View style={styles.headerIcons}>
            <Lucide name="volume-2" size={20} color={COLORS.primary} />
            <Lucide name="edit" size={20} color={COLORS.primary} />
          </View>
        </View>

        {/* Section Capteurs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capteurs</Text>
          <View style={styles.table}>
            {/* Header du tableau */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell]}>Capteur</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Seuil</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Actif</Text>
            </View>
            {/* Rows */}
            {sensors.map(sensor => (
              <SensorRow key={sensor.id} sensor={sensor} />
            ))}
          </View>
        </View>

        {/* Section Codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Codes</Text>

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Mot de Passe</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.changeButton}>Changer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Nip</Text>
            <TouchableOpacity onPress={handleChangeNip}>
              <Text style={styles.changeButton}>Changer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.notificationRow}>
            <Text style={styles.notificationLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e0e0e0', true: COLORS.primary }}
              thumbColor={notificationsEnabled ? COLORS.primary : '#f0f0f0'}
            />
          </View>

          <View style={styles.notificationRow}>
            <Text style={styles.notificationLabel}>Sons</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#e0e0e0', true: COLORS.primary }}
              thumbColor={soundEnabled ? COLORS.primary : '#f0f0f0'}
            />
          </View>
        </View>

        {/* Section Horaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires</Text>

          <View style={styles.daysRow}>
            <Text style={styles.daysLabel}>Semaine</Text>
            <Text style={styles.daysValue}>{selectedDays}</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Heure debut</Text>
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
              />
            </View>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Heure fin</Text>
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },

  // Table Capteurs
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: '600',
    color: '#666',
  },
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sensorName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
  },
  sensorType: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },
  sensorThreshold: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },

  // Codes
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 6,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  changeButton: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary || '#007AFF',
  },

  // Notifications
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 6,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },

  // Horaires
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderRadius: 6,
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  daysValue: {
    fontSize: 14,
    color: '#666',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 15,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
});