export interface ConfirmDialogProps {
    isOpen: boolean,
    text: string,
    onConfirm: () => void,
    onClose: () => void
}