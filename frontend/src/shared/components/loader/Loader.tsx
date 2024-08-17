import {Hourglass} from "react-loader-spinner";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import './loader.scss'

export const Loader = () => {

    const {t} = useTranslation();

    return <Box id='loader'>
        <Hourglass colors={['#5ea79d', '#5ea79d']}/>
        <Typography variant='h6' className='text'>
            {t('FETCHING_DATA')}
        </Typography>
    </Box>
}