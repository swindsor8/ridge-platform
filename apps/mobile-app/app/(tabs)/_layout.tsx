import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'map',       title: 'Map',       icon: 'map-outline',          iconFocused: 'map' },
  { name: 'dashboard', title: 'Dashboard', icon: 'grid-outline',          iconFocused: 'grid' },
  { name: 'wind',      title: 'Wind',      icon: 'partly-sunny-outline',  iconFocused: 'partly-sunny' },
  { name: 'scout',     title: 'Scout',     icon: 'eye-outline',           iconFocused: 'eye' },
  { name: 'tailgate',  title: 'Tailgate',  icon: 'people-outline',        iconFocused: 'people' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.charcoal,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.burntOrange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 11,
        },
      }}
    >
      {TABS.map(({ name, title, icon, iconFocused }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? iconFocused : icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
