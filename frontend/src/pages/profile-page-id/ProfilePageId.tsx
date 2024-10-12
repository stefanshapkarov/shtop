import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Stack, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import verifiedIcon from '../../shared/styles/icons/verified_icon.png';
import infoMessageIcon from '../../shared/styles/icons/info_message.png';
import phoneIcon from '../../shared/styles/icons/phone.png';
import carIcon from '../../shared/styles/icons/car_icon.png';
import locationIcon from '../../shared/styles/icons/location.png';
import starIcon from '../../shared/styles/icons/star.png';
import lightningIcon from '../../shared/styles/icons/lightning_icon.png';
import { getUserById } from '../../services/api';

const ProfilePageId: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id!);
        setUser(userData); 
        getRating(userData); 
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    } else {
      navigate('/login');
    }
  }, [id, navigate]);

  const getRating = (userData: any) => {
    try {
      const reviews = userData?.reviews_received;
      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        setUserRating(averageRating);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <Typography>{t('Loading...')}</Typography>;
  if (!user) return <Typography>{t('User not found')}</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const profilePictureUrl = user.profile_picture || 'path_to_default_profile_picture';

  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const birthYear = new Date(birthDate).getFullYear();
    return new Date().getFullYear() - birthYear;
  };

  const age = calculateAge(user.birth_date);
  const formattedYear = user.created_at ? new Date(user.created_at).getFullYear() : t("YEAR");

  return (
    <Card sx={{ maxWidth: 700, maxHeight: 700, padding: 10, backgroundColor: "#F1F1F1", marginTop: 10, marginBottom:10, marginLeft: 'auto', marginRight:'auto' }}>
      <Stack direction="row" spacing={2} alignItems="center" ml={6}>
        <Avatar
          src={profilePictureUrl}
          alt="Profile"
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h6">{user.name || 'User Name'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {age ? `${age} years` : t('AGE-NOT-AVAILABLE')}
          </Typography>
        </Box>
      </Stack>
      <CardContent>
        <Box mb={2} ml={4}>
          <Typography variant="h6" mb={3}>{t('INFO')}:</Typography>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <img src={verifiedIcon} alt="Verified" width={20} />
            <Typography variant="body2">{user.is_verified ? t('VERIFIED_PROFILE') : t('UNVERIFIED_PROFILE')}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <img src={infoMessageIcon} alt="Info Message" width={20} />
            <Typography variant="body2">{user.bio || t('DEFAULT_MSG')}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <img src={phoneIcon} alt="Phone" width={20} />
            <Typography variant="body2">{user.phone_number || t('HIDDEN')}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={locationIcon} alt="Location" width={20} />
            <Typography variant="body2">{user.location || t('HIDDEN')}</Typography>
          </Stack>
        </Box>
        <Divider sx={{ borderBottomWidth: 4 }} />
        <Box mb={2} ml={4} mt={5}>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={1}>
            <img src={carIcon} width={20} alt="Car Icon" />
            <span style={{ marginLeft: '4px' }}>{user.completed_rides || '0'} {t('RIDES')}</span>
          </Typography>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={1}>
            <img src={carIcon} width={20} alt="Car Icon" />
            <span style={{ marginLeft: '4px' }}>{user.rides_as_passenger.length || '0'} {t('RIDES-AS-PASSENGER')}</span>
          </Typography>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={3}>
            <img src={starIcon} width={20} alt="Star" />
            <span style={{ marginLeft: '4px' }}>{userRating.toFixed(1) || '0.0'}</span>
          </Typography>
          
          <Divider sx={{ borderBottomWidth: 2 }} /> 
          <Typography variant="h6" mt={4}>{t('REVIEWS')}:</Typography>
          {user.reviews_received && user.reviews_received.length > 0 ? (
            user.reviews_received.map((review: any, index: number) => (
              <Card key={index} sx={{ marginTop: 2 }}>
                <CardContent>
                  <Typography variant="body2">
                    <strong>{t('Rating')}:</strong> {review.rating} {t('stars')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t('Comment')}:</strong> {review.comment || t('No comment provided')}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>{t('No reviews yet')}</Typography>
          )} 
          <Divider sx={{ borderBottomWidth: 2 }} />
          <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={2}>
            <img src={lightningIcon} alt="Member Since" width={10} />
            <Typography variant="body2">{t('MEMBER-SINCE')} {formattedYear || 'YEAR'}</Typography>
          </Stack>  

        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePageId;
