import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RIDGE</Text>
      <Text style={styles.subtitle}>Register — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 64,
    color: Colors.burntOrange,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.boneTan,
    marginTop: 8,
  },
});
