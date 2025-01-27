import { useMenu } from '@gateway/ui';

import NotificationsIcon from '@mui/icons-material/Notifications';
import { Card, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';

import { useCyberConnect } from '../../../../providers/cyberconnect';
import { NotificationList } from './list';

export function NavBarNotifications() {
  const { unreadNotifications } = useCyberConnect();
  const userMenu = useMenu();

  const icon = (
    <Avatar>
      <NotificationsIcon />
    </Avatar>
  );

  return (
    <>
      <Tooltip title="Open Notifications">
        <IconButton onClick={userMenu.onOpen}>
          {unreadNotifications > 0 ? (
            <Badge
              color="primary"
              variant="dot"
              overlap="circular"
              badgeContent={unreadNotifications}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
      </Tooltip>
      <Popover
        id="menu-appbar"
        anchorEl={userMenu.element}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={userMenu.isOpen}
        onClose={userMenu.onClose}
      >
        <Card sx={{ width: { sm: 408 } }}>
          <CardHeader
            title="Notifications"
            titleTypographyProps={{ variant: 'body1', color: 'text.secondary' }}
          />
          <NotificationList />
        </Card>
      </Popover>
    </>
  );
}
