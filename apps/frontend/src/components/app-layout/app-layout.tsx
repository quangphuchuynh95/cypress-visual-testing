import { AppShell } from '@mantine/core';
import { AppNavbar } from './components/app-navbar';
import { AppHeader } from './components/app-header';
import { Outlet } from 'react-router-dom';
export interface AppLayoutProps {}

export function AppLayout({}: AppLayoutProps) {
  return (
    <AppShell
      padding="md"
      navbar={<AppNavbar />}
      header={<AppHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}
