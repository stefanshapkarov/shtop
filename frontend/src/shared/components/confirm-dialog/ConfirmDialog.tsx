import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {ConfirmDialogProps} from "./ConfirmDialogProps";
import {useTranslation} from "react-i18next";
import './confirm-dialog.scss';

export const ConfirmDialog = (props: ConfirmDialogProps) => {

    const { t } = useTranslation()

    return <Dialog id='confirm-dialog' open={props.isOpen} onClose={props.onClose}>
        <DialogTitle className='title'>{props.title}</DialogTitle>
        <DialogContent>
            <Typography className='text'>{props.text}</Typography>
        </DialogContent>
        <DialogActions className='dialog-actions'>
            <Button variant='contained' size='small' className='button back' onClick={() => props.onClose()}>{t('NO')}</Button>
            <Button variant='contained' size='small' className='button' color='error' onClick={() => props.onConfirm()}>{t('YES')}</Button>
        </DialogActions>
    </Dialog>
}