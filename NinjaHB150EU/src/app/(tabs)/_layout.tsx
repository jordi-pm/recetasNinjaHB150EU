import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useApp } from '@/lib/store';

export default function TabsLayout() {
  const { pendientes } = useApp();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="buscar" role="search">
        <NativeTabs.Trigger.Label>Buscar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favoritos">
        <NativeTabs.Trigger.Label>Favoritos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'star', selected: 'star.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="compra">
        <NativeTabs.Trigger.Label>Compra</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'cart', selected: 'cart.fill' }} />
        {pendientes > 0 ? <NativeTabs.Trigger.Badge>{String(pendientes)}</NativeTabs.Trigger.Badge> : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="maquina">
        <NativeTabs.Trigger.Label>Mi HB150EU</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'dial.medium', selected: 'dial.medium.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
