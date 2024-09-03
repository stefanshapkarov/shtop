export interface ConfirmDialogProps {
    isOpen: boolean,
    text: string,
    title?: string
    onConfirm: () => void,
    onClose: () => void
}