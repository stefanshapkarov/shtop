import {Box, Typography} from "@mui/material";
import './InfoCard.scss'
import {InfoCardProps} from "./InfoCardProps";

export const InfoCard = (props: InfoCardProps) => {
  return <>
  <Box id='info-card-container'>
      <img src={props.imageSrc} className='image'/>
      <Typography fontWeight='bold' variant='h5' className='text'>{props.title}</Typography>
      <Typography variant='h6' className='text'>{props.text}</Typography>
  </Box>
  </>
}