

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HelpCenterScreen({ navigation }) {
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // FAQ Data
  const faqItems = [
    {
      id: 1,
      question: 'Comment puis-je réinitialiser mon mot de passe?',
      answer: 'Accédez à l\'écran de connexion et cliquez sur "Mot de passe oublié". Entrez votre adresse email et suivez les instructions envoyées pour réinitialiser votre mot de passe en quelques minutes.',
    },
    {
      id: 2,
      question: 'Ma sirène ne sonne pas lors d\'une alerte',
      answer: 'Vérifiez d\'abord que le volume du système n\'est pas réduit. Si le problème persiste, redémarrez la sirène en la débranchant pendant 30 secondes. Si cela ne fonctionne pas, contactez notre support technique.',
    },
    {
      id: 3,
      question: 'Comment ajouter un numéro d\'urgence?',
      answer: 'Allez dans Paramètres → Contacts d\'urgence → Ajouter un contact. Entrez le numéro et les informations du contact. Cet utilisateur sera notifié en cas de déclenchement d\'alarme.',
    },
    {
      id: 4,
      question: 'Que faire en cas de fausse alerte?',
      answer: 'Déconnectez immédiatement le système en utilisant votre code d\'accès. Appelez ensuite le numéro d\'urgence pour confirmer qu\'il s\'agissait d\'une fausse alerte. Documentez la cause pour éviter que cela se reproduise.',
    },
    {
      id: 5,
      question: 'Le capteur est hors ligne, que faire?',
      answer: 'Vérifiez que le capteur a des piles neuves et qu\'il est à proximité du panneau de contrôle. Essayez de le redémarrer. Si cela ne résout pas le problème, notre équipe peut envoyer un technicien.',
    },
  ];

  // Contact Options
  const contactOptions = [
    {
      id: 1,
      icon: '💬',
      title: 'Chat en direct',
      time: 'Réponse en moins de 2 min',
      description: 'Discutez avec nos spécialistes en temps réel',
      button: 'Ouvrir le chat',
      onPress: () => Alert.alert('Chat', 'Ouverture du chat en direct...'),
    },
    {
      id: 2,
      icon: '☎️',
      title: 'Téléphone',
      time: 'Réponse immédiate',
      phone: '+1 (514) 123-4567',
      description: '',
      button: 'Appeler maintenant',
      onPress: () => Alert.alert('Téléphone', 'Appel au support: +1 (514) 389-5921'),
    },
    {
      id: 3,
      icon: '✉️',
      title: 'Email',
      time: 'Réponse en 1 heure',
      email: 'support@alarme.ca',
      description: '',
      button: 'Envoyer un email',
      onPress: () => Alert.alert('Email', 'Redirection vers votre client email...'),
    },
  ];

  const handleSubmitForm = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    Alert.alert('Succès', 'Votre message a été envoyé. Nous vous répondrons dans l\'heure.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Contact Card Component
  const ContactCard = ({ item }) => (
    <View style={styles.contactCard}>
      <Text style={styles.contactIcon}>{item.icon}</Text>
      <Text style={styles.contactTitle}>{item.title}</Text>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>{item.time}</Text>
      </View>

      {item.phone && (
        <Text style={styles.contactInfo}>{item.phone}</Text>
      )}
      {item.email && (
        <Text style={styles.contactInfo}>{item.email}</Text>
      )}

      {item.description && (
        <Text style={styles.contactDescription}>{item.description}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.contactButton,
          item.id === 3 && styles.contactButtonSecondary,
        ]}
        onPress={item.onPress}
      >
        <Text style={[
          styles.contactButtonText,
          item.id === 3 && styles.contactButtonTextSecondary,
        ]}>
          {item.button}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // FAQ Item Component
  const FAQItem = ({ item, isExpanded, onPress }) => (
    <View style={styles.faqContainer}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Text style={[
          styles.faqToggle,
          isExpanded && styles.faqToggleExpanded
        ]}>
          {isExpanded ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centre d'aide</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.statusBadge}>
            <View style={styles.pulse} />
            <Text style={styles.statusText}>24/7 Support actif</Text>
          </View>

          <Text style={styles.heroTitle}>Nous sommes toujours là pour vous!</Text>
          <Text style={styles.heroDescription}>
            Que ce soit une question ou une urgence, notre équipe est disponible à tout moment pour vous aider avec votre système d'alarme.
          </Text>
        </View>

        {/* Contact Grid */}
        <View style={styles.contactGrid}>
          {contactOptions.map((item) => (
            <ContactCard key={item.id} item={item} />
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          
          {faqItems.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isExpanded={expandedFAQ === item.id}
              onPress={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
            />
          ))}
        </View>

        {/* Contact Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Envoyer un message</Text>

          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nom</Text>
              <View style={styles.input}>
                <Text style={{ color: '#9ca3af' }}>Entrez votre nom</Text>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <View style={styles.input}>
                <Text style={{ color: '#9ca3af' }}>Entrez votre email</Text>
              </View>
            </View>

            {/* Subject Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Sujet</Text>
              <View style={[styles.input, styles.selectInput]}>
                <Text style={{ color: '#9ca3af' }}>Sélectionnez un sujet</Text>
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Message</Text>
              <View style={[styles.input, styles.textareaInput]}>
                <Text style={{ color: '#9ca3af' }}>Décrivez votre problème ou question...</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitForm}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Envoyer le message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Centre d'aide - Projet intégrateur Système d'alarme | Support disponible 24/7/365
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e3a5f',
    borderBottomWidth: 1,
    borderBottomColor: '#2d5a8a',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },

  backLink: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    opacity: 0.8,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // Hero Section
  hero: {
    backgroundColor: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },

  pulse: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 8,
  },

  statusText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },

  heroTitle: {
    fontSize: 50,
    fontWeight: '700',
    color: 'black',
    marginBottom: 12,
    textAlign: 'center',
  },

  heroDescription: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Contact Grid
  contactGrid: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  contactIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },

  timeContainer: {
    marginBottom: 8,
  },

  timeLabel: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },

  contactInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },

  contactDescription: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },

  contactButton: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },

  contactButtonSecondary: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#1e3a5f',
  },

  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  contactButtonTextSecondary: {
    color: '#1e3a5f',
  },

  // FAQ Section
  faqSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },

  faqContainer: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },

  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },

  faqToggle: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: '600',
  },

  faqToggleExpanded: {
    transform: [{ rotate: '180deg' }],
  },

  faqAnswer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  faqAnswerText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },

  // Form Section
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  formGroup: {
    marginBottom: 16,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  selectInput: {
    height: 44,
  },

  textareaInput: {
    height: 120,
    paddingTop: 12,
  },

  submitButton: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Footer
  footer: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  footerText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
});