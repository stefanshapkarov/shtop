import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './step-2.scss';

const TransportCardStepTwo: React.FC = () => {
    const { t } = useTranslation();
    const [customOptions, setCustomOptions] = useState<{ value: string; checked: boolean }[]>([{ value: '', checked: false }]);

    const handleCustomOptionChange = (index: number, value: string) => {
        const newCustomOptions = [...customOptions];
        newCustomOptions[index].value = value;
        setCustomOptions(newCustomOptions);

        if (value.trim() !== '' && index === customOptions.length - 1) {
            setCustomOptions([...customOptions, { value: '', checked: false }]);
        }
    };

    const handleCheckboxChange = (index: number, checked: boolean) => {
        const newCustomOptions = [...customOptions];
        newCustomOptions[index].checked = checked;
        setCustomOptions(newCustomOptions);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start" width="1200px" className="transport-card-step-two">
            <Typography variant="h6" gutterBottom>
                {t('Изберете ги сите опции кои ги дозволувате')}:
            </Typography>

            <Box display="flex" flexDirection="column" >
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Јадење во автомобилот')}
                    className="custom-form-control-label"
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Пушење во автомобилот')}
                    className="custom-form-control-label"
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Ладење')}
                    className="custom-form-control-label"
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Греење')}
                    className="custom-form-control-label"
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Домашни миленици')}
                    className="custom-form-control-label"
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={t('Кафе пауза')}
                    className="custom-form-control-label"
                />

                {customOptions.map((option, index) => (
                    <div key={index} className="custom-option-input-wrapper">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={option.checked}
                                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                />
                            }
                            label={
                                <TextField
                                    placeholder={t('Додај друга опција...')}
                                    value={option.value}
                                    onChange={(e) => handleCustomOptionChange(index, e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    className="custom-option-input"
                                />
                            }
                            className="custom-form-control-label"
                        />
                    </div>
                ))}

            </Box>

            <Box mt={6} display="flex" justifyContent="space-between" width="100%">
                <FormControlLabel
                    control={<Checkbox />}
                    labelPlacement="start"
                    label={t('Се согласувам овие избрани опции да бидат додадени на мојот профил.')}
                    className="custom-form-control-label"
                />

            </Box>
        </Box>
    );
};

export default TransportCardStepTwo;
