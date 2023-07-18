import React from 'react';
import { NavLink } from '@mantine/core';
import { Link, useMatch } from 'react-router-dom';

export interface NavbarItemProps {
  label: string;
  icon: React.ReactElement;
  to: string;
}

export function NavbarItem({ icon, label, to }: NavbarItemProps) {
  const active = !!useMatch(to);
  return (
    <NavLink
      active={active}
      label={label}
      icon={icon}
      component={Link}
      to={to}
      sx={{ textTransform: 'uppercase' }}
    />
  );
}
