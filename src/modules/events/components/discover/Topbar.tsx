import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';

export const Topbar = ({ isLandingPage = false, scrollProgress = 1 }: TopbarProps) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [menuState, setMenuState] = useState({ language: null });

  const handleMenuClose = () => {
    setMenuState({ language: null });
  };

  return (
    <div>
      {/* Language Menu */}
      <Menu
        anchorEl={menuState.language}
        open={Boolean(menuState.language)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              handleMenuClose();
            }}
            sx={{
              py: 1,
              px: 2,
              // Highlight current language
              bgcolor: i18n.language === lang.code ? 'action.selected' : 'transparent',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2">{lang.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}; 