import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Stack, Divider, TextField } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { redirect, useNavigate } from 'react-router-dom';
import './profile-edit.scss';
import verified_icon from '../../shared/styles/icons/verified_icon.png';
import { ButtonBase } from '@mui/material';
import { updateUser } from '../../services/api';
import SettingsIcon from '@mui/icons-material/Settings'; // Importing the settings icon
import CustomButton from '../custom-button/CustomButton';

const ProfileEdit: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth() as { user: any, logout: Function, loading: boolean };
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    birthdate: user.birthdate || '',
    bio: user.bio || '',
    location: user.location || '',
    is_verified: user.is_verified || false,
    profile_picture: user.profile_picture || '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      console.log(selectedImage);
      setProfileData({
        ...profileData,
        profile_picture: URL.createObjectURL(file), // Preview the selected image
      });
      console.log('Selected image:', file);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     const updatedProfile = await updateUser(profileData); // Use the updateUser function from api.tsx
  //     console.log('Updated profile data:', updatedProfile); // Optionally log the updated profile
  //   } catch (error: any) {
  //     setError(error.message);
  //     console.error('Failed to update profile:', error); // Log the error for debugging
  //   }
  // };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (selectedImage) {
        formData.append('profile_picture', selectedImage);
      }

      Object.keys(profileData).forEach((key) => {
        if (key !== 'profile_picture') {
          formData.append(key, profileData[key as keyof typeof profileData]);
        }
      });

      const updatedProfile = await updateUser(formData);
      console.log('Updated profile data:', updatedProfile);
      navigate('/profile');
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to update profile:', error);
    }
  };


  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (error) return <Typography color="error">{error}</Typography>;

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Card sx={{ maxWidth: 700, maxHeight: 700, margin: 'auto', padding: 2, backgroundColor: "#F1F1F1" }}>
      <Stack direction="row" spacing={2} alignItems="center" ml={6}>
        <label htmlFor="profile-picture-upload">
          <Avatar
            src={profileData.profile_picture
              ? `${profileData.profile_picture}`
              : 'path_to_default_profile_picture'}
            alt="Profile"
            sx={{ width: 100, height: 100, cursor: 'pointer' }}
          />
        </label>
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <Box>
          <TextField
            variant="outlined"
            label="Име и Презиме"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="input-field"
          />
        </Box>
        <Box>
          <Button
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%', // Makes the button circular
              backgroundColor: '#F1F1F1', // Background color to match the icon in your image
              color: '#6D8B8B', // Text and icon color
              padding: 2,
            }}
            onClick={() => navigate('/settings')}
          >
            <SettingsIcon sx={{ fontSize: 40 }} /> {/* Icon size to match the image */}
            <Typography variant="caption" sx={{ marginTop: 1 }}> {/* Text below the icon */}
              Settings
            </Typography>
          </Button>

        </Box>
      </Stack>
      <CardContent>
        <Box mb={2} ml={4} >
          <Typography variant="h6" mb={3}>Информации:</Typography>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <TextField
              variant="outlined"
              label="e-адреса"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="input-field"
              disabled
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <TextField
              variant="outlined"
              label="телефонски број"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="input-field"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <TextField
              variant="outlined"
              label="дата на раѓање"
              name="birthdate"
              value={profileData.birthdate}
              onChange={handleInputChange}

              className="input-field"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <TextField
              variant="outlined"
              label="Место на живеење"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}

              className="input-field"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <TextField
              variant="outlined"
              label="Додај мини био"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}

              className="input-field"
            />
          </Stack>
          <ButtonBase sx={{ justifyContent: 'start' }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <img src={verified_icon} alt="Verified" width={30} />
              <Typography variant="body2">
                {user.is_verified ? 'Верифициран профил' : 'Верифицирај го профилот'}
              </Typography>
            </Stack>
          </ButtonBase>
        </Box>

        <Divider sx={{ borderBottomWidth: 4 }} />
        <Box mb={2} mt={5} display="flex" justifyContent="center" alignItems="center">
          <CustomButton text="Зачувај" onClick={handleSave} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileEdit;
