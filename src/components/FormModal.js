import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import apiService from '../app/apiService';
import Joi from 'joi';
import moment from 'moment';

const initial_form = { make: '', model: '', release_date: '', transmission_type: '', price: 0, size: '', style: '' };

export default function FormModal({ open, handleClose, mode, selectedCar, modalKey, refreshData }) {
	const [form, setForm] = useState(initial_form);
	const [errors, setErrors] = useState({});
	const schema = Joi.object({
		make: Joi.string().required(),
		model: Joi.string().required(),
		release_date: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
		transmission_type: Joi.string().valid('MANUAL', 'AUTOMATIC', 'AUTOMATED_MANUAL', 'DIRECT_DRIVE', 'UNKNOWN').required(),
		price: Joi.number().integer().min(1000).required(),
		size: Joi.string().valid('Compact', 'Midsize', 'Large').required(),
		style: Joi.string().required(),
	}).options({ stripUnknown: true, abortEarly: false });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const handleEdit = async (newForm) => {
		try {
			const res = await apiService.put(`/car/${selectedCar?._id}`, { ...newForm });
			refreshData();
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	};
	const handleCreate = async (newForm) => {
		try {
			const res = await apiService.post('/car', { ...newForm });
			refreshData();
			console.log(res);
		} catch (err) {
			console.log(err.message);
		}
	};
	const handleSubmit = () => {
		const validate = schema.validate(form);
		if (validate.error) {
			const newErrors = {};
			validate.error.details.forEach((item) => (newErrors[item.path[0]] = item.message));
			setErrors(newErrors);
		} else {
			if (mode === 'create') handleCreate(validate.value);
			else handleEdit(validate.value);
			// handleClose();
		}
	};
	useEffect(() => {
		if (selectedCar?._id) {
			setErrors({});
			setForm(selectedCar);
		} else setForm(initial_form);
	}, [selectedCar?._id]);
	console.log('render');
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} key={modalKey}>
			<Dialog
				open={open}
				onClose={() => {
					handleClose();
					setErrors({});
				}}
			>
				<DialogTitle>{mode === 'create' ? 'CREATE A NEW CAR' : 'EDIT CAR'}</DialogTitle>
				<DialogContent>
					<Stack spacing={2}>
						<TextField
							error={errors.make}
							helperText={errors.make ? errors.make : null}
							value={form.make}
							autoFocus
							margin="dense"
							name="make"
							label="Make"
							type="text"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<TextField
							error={errors.model}
							helperText={errors.model ? errors.model : null}
							value={form.model}
							onChange={handleChange}
							autoFocus
							margin="dense"
							name="model"
							label="Model"
							type="text"
							fullWidth
							variant="standard"
						/>
						<FormControl error={errors.transmission_type} variant="standard" sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="transmission_type_label">Transmission Type</InputLabel>
							<Select labelId="transmission_type_label" name="transmission_type" value={form.transmission_type} onChange={handleChange} label="Transmission Type">
								{['MANUAL', 'AUTOMATIC', 'AUTOMATED_MANUAL', 'DIRECT_DRIVE', 'UNKNOWN'].map((item) => (
									<MenuItem value={item} key={item}>
										{item}
									</MenuItem>
								))}
							</Select>
							{errors.transmission_type ? <FormHelperText>{errors.transmission_type}</FormHelperText> : null}
						</FormControl>
						<FormControl error={errors.size} variant="standard" sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="size-label">Size</InputLabel>
							<Select labelId="size-label" name="size" value={form.size} onChange={handleChange} label="Size">
								{['Compact', 'Midsize', 'Large'].map((item) => (
									<MenuItem value={item} key={item}>
										{item}
									</MenuItem>
								))}
							</Select>
							{errors.size ? <FormHelperText>{errors.size}</FormHelperText> : null}
						</FormControl>
						<TextField
							error={errors.style}
							helperText={errors.style ? errors.style : null}
							value={form.style}
							margin="dense"
							name="style"
							label="Style"
							type="text"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<Stack direction="row" spacing={2}>
							<DatePicker
								views={['year']}
								label="Year"
								value={moment(form.release_date.toString()).format('YYYY')}
								error={errors.release_date}
								onChange={(newValue) => {
									setForm({ ...form, release_date: moment(newValue).year() });
								}}
								renderInput={(params) => <TextField {...params} helperText={errors.release_date ? errors.release_date : null} />}
							/>

							<TextField
								value={form.price}
								onChange={handleChange}
								error={errors.price}
								helperText={errors.price ? errors.price : null}
								margin="dense"
								name="price"
								label="Price"
								type="number"
								variant="standard"
							/>
						</Stack>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit}>{mode === 'create' ? 'Create' : 'Save'}</Button>
				</DialogActions>
			</Dialog>
		</LocalizationProvider>
	);
}
