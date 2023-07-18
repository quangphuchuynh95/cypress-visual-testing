import { Navbar } from '@mantine/core';
import {
  IconHome2,
  IconPhotoExclamation,
  IconTestPipe,
} from '@tabler/icons-react';
import { NavbarItem } from './components/navbar-item';

export interface AppNavbarProps {}

export function AppNavbar({}: AppNavbarProps) {
  return (
    <Navbar width={{ base: 300 }} p={0}>
      <Navbar.Section grow>
        <NavbarItem to="/" label="Dashboard" icon={<IconHome2 />} />
        <NavbarItem
          to="/branch-screenshot"
          label="Screenshot approval"
          icon={<IconPhotoExclamation />}
        />
        <NavbarItem
          to="/screenshot"
          label="Test reports"
          icon={<IconTestPipe />}
        />
      </Navbar.Section>
    </Navbar>
  );
}
