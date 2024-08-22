import {Hourglass} from "react-loader-spinner";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import './loader.scss'
import {LoaderProps} from "./LoaderProps";



export const Loader = ({color} : LoaderProps) => {

    const {t} = useTranslation();

    return <Box id='loader'>
        <Hourglass colors={color ? [color, color] : ['#5ea79d', '#5ea79d']}/>
        <Typography variant='h6' className='text'>
            {t('FETCHING_DATA')}
        </Typography>
    </Box>
}