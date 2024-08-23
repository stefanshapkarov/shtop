import React from 'react';
import { Button } from '@mui/material';

interface CustomButtonProps {
  text: string;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#6D8B8B', // Match the background color
        color: '#FFFFFF', // White text color
        borderRadius: '50px', // Rounded edges
        padding: '8px 24px', // Padding to control button size
        textTransform: 'none', // Prevent text from being uppercase
        fontSize: '16px', // Font size to match the design
        '&:hover': {
          backgroundColor: '#5B7B7B', // Darker shade on hover
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
