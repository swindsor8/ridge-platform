import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MAP</Text>
      <Text style={styles.subtitle}>Hunting map coming in Phase 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.headline,
    fontSize: 48,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
