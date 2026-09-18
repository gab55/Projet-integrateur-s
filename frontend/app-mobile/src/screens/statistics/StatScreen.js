

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lucide from '@react-native-vector-icons/lucide';
import { globalStyles } from '../../styles';

const COLORS = {
  primary: '#1a3a52', // Bleu marine
  accent: '#D4AF37', // Or
  success: '#4CAF50', // Vert succès
  warning: '#FF9500', // Orange alerte
  danger: '#FF3B30',
  light: '#f8f8f8',
  border: '#e0e0e0',
};

const { width } = Dimensions.get('window');

export default function StatScreen() {
  const [statsData] = useState({
    mlConfidence: 94,
    sensorsOnline: 5,
    uptime: 99.9,
    weekDetections: [8, 12, 6, 9, 14, 7, 5], // Lun-Dim
    totalDetections: 47,
    falseAlerts: 2,
    mlAccuracy: 96.8,
    mlAccuracyChange: 2.1,
    patternsRecognized: 12,
    patternsTotal: 15,
    mlAverageConfidence: 91,
    zoneActivity: [
      { zone: 'Salon', percentage: 45, color: '#FF6B6B' },
      { zone: 'Entrée', percentage: 28, color: '#4ECDC4' },
      { zone: 'Couloir', percentage: 18, color: '#95E1D3' },
      { zone: 'Chambre', percentage: 9, color: '#C7CEEA' },
    ],
    recentEvents: [
      {
        id: 1,
        time: '14:32',
        type: 'Mouvement',
        zone: 'Salon',
        confidence: 98,
        status: 'success',
      },
      {
        id: 2,
        time: '13:15',
        type: 'Anomalie',
        zone: 'Entrée',
        confidence: 67,
        status: 'warning',
      },
      {
        id: 3,
        time: '11:47',
        type: 'Mouvement',
        zone: 'Couloir',
        confidence: 85,
        status: 'success',
      },
      {
        id: 4,
        time: '09:22',
        type: 'Mouvement',
        zone: 'Salon',
        confidence: 92,
        status: 'success',
      },
    ],
    recommendations: [
      {
        id: 1,
        icon: 'battery-low',
        message: 'Batterie capteur salon: 12%',
        severity: 'warning',
      },
      {
        id: 2,
        icon: 'alert-circle',
        message: 'Mettre à jour pattern entrée',
        severity: 'info',
      },
      {
        id: 3,
        icon: 'zap',
        message: 'Performance ML stable ✓',
        severity: 'success',
      },
    ],
  });

  // Animation pour la confiance ML
  const mlConfidenceAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(mlConfidenceAnim, {
      toValue: statsData.mlConfidence,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [mlConfidenceAnim, statsData.mlConfidence]);

  const ProgressBar = ({ percentage, color = COLORS.primary, height = 8 }) => (
    <View style={[styles.progressBarContainer, { height }]}>
      <View
        style={[
          styles.progressBarFill,
          {
            width: `${percentage}%`,
            backgroundColor: color,
            height: '100%',
          },
        ]}
      />
    </View>
  );

  const BarChart = () => {
    const maxValue = Math.max(...statsData.weekDetections);
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
      <View style={styles.chartContainer}>
        <View style={styles.barChartWrapper}>
          {statsData.weekDetections.map((value, index) => (
            <View key={index} style={styles.barColumn}>
              <View
                style={{
                  height: (value / maxValue) * 120,
                  backgroundColor: COLORS.accent,
                  borderRadius: 4,
                  marginBottom: 8,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.barValue}>{value}</Text>
              </View>
              <Text style={styles.barLabel}>{days[index]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const StatusCard = ({ icon, label, value, unit = '', color = COLORS.success }) => (
    <View style={styles.statusBox}>
      <View style={[styles.statusIcon, { backgroundColor: color + '20' }]}>
        <Lucide name={icon} size={24} color={color} />
      </View>
      <View style={styles.statusContent}>
        <Text style={styles.statusLabel}>{label}</Text>
        <Text style={styles.statusValue}>
          {value}
          {unit}
        </Text>
      </View>
    </View>
  );

  const ZoneActivityBar = ({ zone, percentage, color }) => (
    <View style={styles.zoneRow}>
      <Text style={styles.zoneName}>{zone}</Text>
      <View style={styles.zoneBarContainer}>
        <View
          style={[
            styles.zoneBar,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.zonePercentage}>{percentage}%</Text>
    </View>
  );

  const EventCard = ({ event }) => (
    <View style={[styles.eventCard, event.status === 'warning' && styles.eventCardWarning]}>
      <View style={styles.eventTime}>
        <Text style={styles.eventTimeText}>{event.time}</Text>
      </View>

      <View style={styles.eventContent}>
        <View style={styles.eventTypeZone}>
          <Text
            style={[
              styles.eventType,
              event.status === 'warning' && styles.eventTypeWarning,
            ]}
          >
            {event.type}
          </Text>
          <Text style={styles.eventZone}>{event.zone}</Text>
        </View>

        <View style={styles.eventConfidence}>
          <View
            style={[
              styles.confidenceBar,
              {
                backgroundColor:
                  event.confidence >= 85
                    ? COLORS.success
                    : event.confidence >= 70
                    ? COLORS.warning
                    : COLORS.danger,
              },
            ]}
          />
          <Text style={styles.confidenceText}>{event.confidence}%</Text>
          {event.confidence < 75 && <Lucide name="alert-triangle" size={16} color={COLORS.warning} />}
        </View>
      </View>
    </View>
  );

  const RecommendationCard = ({ recommendation }) => {
    const getColor = () => {
      if (recommendation.severity === 'warning') return COLORS.warning;
      if (recommendation.severity === 'danger') return COLORS.danger;
      return COLORS.success;
    };

    return (
      <View
        style={[
          styles.recommendationCard,
          {
            borderLeftColor: getColor(),
            backgroundColor: getColor() + '08',
          },
        ]}
      >
        <Lucide name={recommendation.icon} size={20} color={getColor()} />
        <Text style={[styles.recommendationText, { color: getColor() }]}>
          {recommendation.message}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Statistiques Système</Text>
          <Lucide name="trending-up" size={24} color={COLORS.primary} />
        </View>

        {/* Status 24h */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status 24h</Text>
          <View style={styles.statusGrid}>
            <StatusCard
              icon="check-circle"
              label="Confiance ML"
              value={statsData.mlConfidence}
              unit="%"
              color={COLORS.success}
            />
            <StatusCard
              icon="radio"
              label="Capteurs"
              value={`${statsData.sensorsOnline}/5`}
              color={COLORS.accent}
            />
            <StatusCard
              icon="wifi"
              label="Uptime"
              value={statsData.uptime}
              unit="%"
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* Détections cette semaine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détections cette semaine</Text>
          <View style={styles.card}>
            <BarChart />
            <View style={styles.statsFooter}>
              <View style={styles.statLine}>
                <Text style={styles.statLabel}>Total:</Text>
                <Text style={styles.statValue}>{statsData.totalDetections} mouvements</Text>
              </View>
              <View style={styles.statLine}>
                <Text style={styles.statLabel}>Fausses alertes:</Text>
                <Text style={[styles.statValue, { color: COLORS.warning }]}>
                  {statsData.falseAlerts} ({((statsData.falseAlerts / statsData.totalDetections) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance ML */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance ML</Text>
          <View style={styles.card}>
            <View style={styles.performanceRow}>
              <View style={styles.performanceLabel}>
                <Text style={styles.performanceTitle}>Accuracy</Text>
                <View style={styles.performanceTrend}>
                  <Lucide name="trending-up" size={16} color={COLORS.success} />
                  <Text style={styles.trendText}>+{statsData.mlAccuracyChange.toFixed(1)}%</Text>
                </View>
              </View>
              <View style={styles.performanceValue}>
                <Text style={styles.largeValue}>{statsData.mlAccuracy}%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <View style={styles.performanceLabel}>
                <Text style={styles.performanceTitle}>Patterns reconnus</Text>
              </View>
              <View style={styles.performanceValue}>
                <Text style={styles.largeValue}>
                  {statsData.patternsRecognized}/{statsData.patternsTotal}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <View style={styles.performanceLabel}>
                <Text style={styles.performanceTitle}>Confiance moyenne</Text>
              </View>
              <View style={styles.performanceValue}>
                <Text style={styles.largeValue}>{statsData.mlAverageConfidence}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activité par zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité par zone</Text>
          <View style={styles.card}>
            {statsData.zoneActivity.map((zone, index) => (
              <View key={index}>
                <ZoneActivityBar
                  zone={zone.zone}
                  percentage={zone.percentage}
                  color={zone.color}
                />
                {index < statsData.zoneActivity.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Événements récents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Événements récents</Text>
          {statsData.recentEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Recommandations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommandations</Text>
          {statsData.recommendations.map(rec => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
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
    backgroundColor: COLORS.light,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },

  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 15,
  },

  // Status Grid
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  statusBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Bar Chart
  chartContainer: {
    marginBottom: 16,
  },
  barChartWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Stats Footer
  statsFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Performance
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  performanceLabel: {
    flex: 1,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  performanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  performanceValue: {
    alignItems: 'flex-end',
  },
  largeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Zone Activity
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  zoneName: {
    width: 70,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  zoneBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    overflow: 'hidden',
  },
  zoneBar: {
    height: '100%',
    borderRadius: 10,
  },
  zonePercentage: {
    width: 45,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Events
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    flexDirection: 'row',
    gap: 12,
  },
  eventCardWarning: {
    borderLeftColor: COLORS.warning,
    backgroundColor: COLORS.warning + '08',
  },
  eventTime: {
    width: 50,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTypeZone: {
    flex: 1,
  },
  eventType: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  eventTypeWarning: {
    color: COLORS.warning,
  },
  eventZone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventConfidence: {
    alignItems: 'center',
    gap: 4,
  },
  confidenceBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Progress Bar
  progressBarContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: COLORS.accent,
  },

  // Recommendations
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: COLORS.border,
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});