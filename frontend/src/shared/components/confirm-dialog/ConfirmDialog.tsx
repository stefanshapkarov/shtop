import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {ConfirmDialogProps} from "./ConfirmDialogProps";
import {useTranslation} from "react-i18next";

export const ConfirmDialog = (props: ConfirmDialogProps) => {

    const { t } = useTranslation()

    return <Dialog open={props.isOpen} onClose={props.onClose}>
        <DialogContent>
            <Typography>{props.text}</Typography>
            <DialogActions>
                <Button onClick={() => props.onConfirm()}>{t('YES')}</Button>
                <Button onClick={() => props.onClose()}>{t('NO')}</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}