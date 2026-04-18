import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function AdminDashboardScreen({ navigation }) {
  const { events, deleteEvent } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader
          title="Manage Events"
          rightAction={() => navigation.getParent()?.replace('Auth')}
          rightLabel="Logout"
        />
        <BrandLogo width={180} height={180} style={styles.logoSpacing} />
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <View key={event.id} style={styles.card}>
              <View style={styles.textWrap}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.meta}>{event.date} • {event.location}</Text>
              </View>
              <View style={styles.actions}>
                <SecondaryButton
                  label="Edit"
                  onPress={() => navigation.navigate('AddEditEvent', { eventId: event.id, mode: 'edit' })}
                  style={styles.smallButton}
                />
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(event.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddEditEvent', { mode: 'add' })}
        >
          <Ionicons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  list: {
    gap: spacing.md,
    paddingBottom: 100,
  },
  logoSpacing: {
    marginTop: -spacing.sm,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  textWrap: {
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
  },
  meta: {
    ...typography.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    borderRadius: radii.lg,
    backgroundColor: '#FCEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
