import {Autocomplete, Box, Button, TextField} from "@mui/material";
import {getInitialLanguage} from "../../../i18";
import {cities_mk} from "../../../models/cities/cities_mk";
import {cities_en} from "../../../models/cities/cities_en";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import React, {useState} from "react";
import './routes-search-bar.scss';
import {useTranslation} from "react-i18next";
import {RoutesSearchBarProps} from "./RoutesSearchBarProps";
import {format} from "date-fns";

export const RoutesSearchBar = (props: RoutesSearchBarProps) => {

    const { t } = useTranslation();
    const queryParams = new URLSearchParams(window.location.search);
    const [locationFrom, setLocationFrom] = useState<string | undefined | null>(props.locationFrom);
    const [locationTo, setLocationTo] = useState<string | undefined | null>(props.locationTo);
    const [date, setDate] = useState<Dayjs | undefined | null>(props.date ? dayjs(props.date, 'DD-MM-YYYY') : dayjs(new Date(Date.now())));
    const [numPassengers, setNumPassengers] = useState<number | undefined | null>(props.numPassengers);

    const getLocationFrom = () => {
        return getInitialLanguage() === 'mk' && locationFrom ? cities_en[cities_mk.indexOf(locationFrom)] : null
    }

    const getLocationTo = () => {
        return getInitialLanguage() === 'mk' && locationTo ? cities_en[cities_mk.indexOf(locationTo)] : null
    }

    const getDate = () => {
        return date ? format(date.toDate(), "dd-MM-yyyy") : null
    }

    const getNumPassengers = () => {
        return numPassengers ? numPassengers : null
    }

    const handleSearch = () => {
        props.handleSearch(getLocationFrom(), getLocationTo(), getDate(), getNumPassengers())
    }

  return <Box id='search-route-container'>
      <Autocomplete
          value={locationFrom}
          onChange={(event, value) => setLocationFrom(value)}
          renderInput={(params) => <TextField {...params} label={t('DEPARTURE_FROM')}/>}
          options={getInitialLanguage() === 'mk' ? cities_mk : cities_en}
          className='search-field'
      />
      <Autocomplete
          value={locationTo}
          onChange={(event, value) => setLocationTo(value)}
          renderInput={(params) => <TextField {...params} label={t('ARRIVAL_TO')}/>}
          options={getInitialLanguage() === 'mk' ? cities_mk : cities_en}
          className='search-field'
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}
                         sx={{marginTop: '-0.5rem'}}>
              <DatePicker disablePast={true} format='DD/MM/YYYY' label={t('DATE')} value={dayjs(date)} onChange={value => {
                  if (value)
                      setDate(value)
                  else
                      setDate(null)
              }}
                          className='search-field'/>
          </DemoContainer>
      </LocalizationProvider>
      <TextField label={t('NUM_PEOPLE')} className='search-field' value={numPassengers} type='number'
                 onChange={(event) => setNumPassengers(parseInt(event.target.value))}/>
      <Button variant='contained' className='search-button'
              onClick={() => handleSearch()}>{t('SEARCH')}</Button>
  </Box>
}