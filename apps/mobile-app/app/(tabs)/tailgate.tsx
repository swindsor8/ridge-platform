import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

export default function TailgateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TAILGATE</Text>
      <Text style={styles.subtitle}>Community feed coming in Phase 3</Text>
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
