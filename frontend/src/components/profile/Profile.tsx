import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Stack, Divider } from '@mui/material';
import verified_icon from '../../shared/styles/icons/verified_icon.png';
import info_message from '../../shared/styles/icons/info_message.png';
import car_icon from '../../shared/styles/icons/car_icon.png';
import star from '../../shared/styles/icons/star.png';
import lightning_icon from '../../shared/styles/icons/lightning_icon.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';


const Profile: React.FC = () => {
  // const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { login, user, logout, loading } = useAuth() as { login: Function, user: any, logout: Function, loading: boolean };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (!loading && user) {
          
      }else{
          navigate('/login');
      }
  }, [user, loading, navigate]);

  if (error) return <Typography color="error">{error}</Typography>;

  if (!user) return <Typography>Loading...</Typography>;
  const profilePictureUrl = user.profile_picture || 'path_to_default_profile_picture';
  return (
    <Card sx={{ maxWidth: 700, maxHeight: 700, margin: 'auto', padding: 2, backgroundColor: "#F1F1F1" }}>
      <Stack direction="row" spacing={2} alignItems="center" ml={6}>
        <Avatar
          src={profilePictureUrl}
          alt="Profile"
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h6">{user.name || 'User Name'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.age ? `${user.age} years` : 'Age not available'}
          </Typography>
        </Box>
      </Stack>
      <CardContent>
        <Box mb={2} ml={4}>
          <Typography variant="h6" mb={3}>Информации:</Typography>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <img src={verified_icon} alt="Verified" width={20} />
            <Typography variant="body2">{user.is_verified ? 'Верифициран профил' : 'Неверифициран профил'}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={info_message} alt="Info Message" width={20} />
            <Typography variant="body2">{user.info_message || 'Default info message'}</Typography>
          </Stack>
        </Box>
        <Divider sx={{ borderBottomWidth: 4 }} />
        <Box mb={2} ml={4} mt={5}>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={1}>
            <img src={car_icon} width={20} alt="Car Icon" />
            <span style={{ marginLeft: '4px' }}>{user.rides_published || '0'} возења објавено</span>
          </Typography>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={3}>
            <img src={star} width={20} alt="Star" />
            <span style={{ marginLeft: '4px' }}>{user.rating || '0.0'}</span>
          </Typography>
          <Divider sx={{ borderBottomWidth: 2 }} />
          <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={2}>
            <img src={lightning_icon} alt="Member Since" width={10} />
            <Typography variant="body2">Член од {user.member_since || 'Year'}</Typography>
          </Stack>
          <Divider sx={{ borderBottomWidth: 2 }} />
          <Typography variant="body2" mt={2}>{user.car_brand || 'Car Brand'}</Typography>
          <Typography variant="body2" mb={3}>{user.car_color || 'Car Color'}</Typography>
          <Button variant="contained" color="error">Пријави го користникот</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;
