import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

interface EventActionsProps {
  eventId: string;
  isOwner: boolean;
  isParticipant: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLeave: () => void;
}

export const EventActions = ({
  eventId,
  isOwner,
  isParticipant,
  onEdit,
  onDelete,
  onLeave,
}: EventActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {isOwner && (
          <>
            <MenuItem
              onClick={() => {
                onEdit();
                handleClose();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete();
                handleClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </>
        )}
        {isParticipant && !isOwner && (
          <MenuItem
            onClick={() => {
              onLeave();
              handleClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Leave Event
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
