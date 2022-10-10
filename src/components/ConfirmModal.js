
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmModal({ open, handleClose, name, action }) {
	const handleConfirm = () => {
		action();
		handleClose();
	};
	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">{`Delete ${name}?`}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">Are you sure you want to delete the {name}? This action is irreversible.</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleConfirm} autoFocus>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
}
