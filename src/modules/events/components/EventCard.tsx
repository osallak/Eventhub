import useAuth from '@modules/auth/hooks/api/useAuth';

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user } = useAuth();
  // ... other code

  const renderActionButton = () => {
    if (!user) {
      return (
        <Button
          variant="contained"
          fullWidth
          href={Routes.Auth.Login}
          startIcon={<LoginIcon />}
        >
          {t('events.login_to_join')}
        </Button>
      );
    }

    // User is logged in
    return (
      <Button
        variant="contained"
        fullWidth
        onClick={handleJoinEvent}
        startIcon={<EventAvailableIcon />}
      >
        {t('events.join_event')}
      </Button>
    );
  };

  return (
    <Card>
      {/* ... other card content ... */}
      <CardActions sx={{ p: 2 }}>
        {renderActionButton()}
      </CardActions>
    </Card>
  );
};
