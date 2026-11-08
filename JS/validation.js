/* =========================================
   Coding Conf 2026 - Validation 
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
const conferenceRegisterForm = document.getElementById('conferenceRegisterForm');

// Drag-and-Drop Interactive Elements & State Management
	const dropZoneElement = document.getElementById('dragDropDropZone');
	const fileInputElement = document.getElementById('avatarFileInput');
	const uploadPromptState = document.getElementById('uploadPromptState');
	const fileSelectedState = document.getElementById('fileSelectedState');
	const filePreviewThumb = document.getElementById('filePreviewThumb');
	const selectedFileName = document.getElementById('selectedFileName');
	const removeFileBtn = document.getElementById('removeFileBtn');

if (dropZoneElement && fileInputElement) 
// Open file selector when clicking the drop box (if not clicking remove)
	dropZoneElement.addEventListener('click', (e) => {
		if (e.target !== removeFileBtn) {
			fileInputElement.click();
		}
	});

// Handle file selection via browser dialog
	fileInputElement.addEventListener('change', () => {
		if (fileInputElement.files.length > 0) {
			displaySelectedFile(fileInputElement.files[0]);
		}
	});

// Handle Remove Button click
	if (removeFileBtn) {
		removeFileBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		resetFileUpload();
		});
	}

	function displaySelectedFile(file) {
		selectedFileName.textContent = file.name;
			filePreviewThumb.src = URL.createObjectURL(file);

	uploadPromptState.style.display = 'none';
	fileSelectedState.style.display = 'flex';
	}

	function resetFileUpload() {
		fileInputElement.value = '';
		filePreviewThumb.src = '';
		selectedFileName.textContent = '';

		fileSelectedState.style.display = 'none';
			uploadPromptState.style.display = 'flex';
	}

// Prevent default drag behaviors
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
		dropZoneElement.addEventListener(eventName, preventDefaultBehaviors, false);
		document.body.addEventListener(eventName, preventDefaultBehaviors, false);
	});

	function preventDefaultBehaviors(e) {
	e.preventDefault();
	e.stopPropagation();
	}

	['dragenter', 'dragover'].forEach((eventName) => {
	dropZoneElement.addEventListener(eventName, () => {
	dropZoneElement.classList.add('dragover');
	}, false);
	});

	['dragleave', 'drop'].forEach((eventName) => {
		dropZoneElement.addEventListener(eventName, () => {
		dropZoneElement.classList.remove('dragover');
	}, false);
	});

// Handle dropped files
	dropZoneElement.addEventListener('drop', (e) => {
	const transferredFiles = e.dataTransfer.files;
		if (transferredFiles.length > 0) {
			fileInputElement.files = transferredFiles;
		displaySelectedFile(transferredFiles[0]);
	}
	}, false);
}	

if (!conferenceRegisterForm) return;

conferenceRegisterForm.addEventListener('submit', async (event) => {
event.preventDefault();

	const fullNameInput = document.getElementById('attendeeFullNameInput');
	const emailInput = document.getElementById('attendeeEmailInput');
	const githubInput = document.getElementById('githubHandleInput');
	const avatarInput = document.getElementById('avatarFileInput');

clearAllFormErrors();

let isFormValid = true;

// 1. Full Name Validation
	const trimmedFullName = fullNameInput.value.trim();
		if (trimmedFullName === '') {
		showFieldError('fullNameContainer');
			isFormValid = false;
}

// 2. Email Regular Expression Check
	const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!strictEmailRegex.test(emailInput.value.trim())) {
			showFieldError('emailContainer');
		isFormValid = false;
}

// 3. GitHub Handle Validation
	const trimmedGithubHandle = githubInput.value.trim();
		if (!trimmedGithubHandle.startsWith('@') || trimmedGithubHandle.length < 2) {
		showFieldError('githubContainer');
		isFormValid = false;
}

// 4. File Upload Validation (JPEG/PNG, <= 500KB)
	const uploadedFile = avatarInput.files[0];
		if (!uploadedFile) {
	showFieldError('avatarContainer');
		isFormValid = false;
		} else {
			const validImageTypes = ['image/jpeg', 'image/png'];
	const maximumFileSizeBytes = 500 * 1024; // 500 KB

		if (!validImageTypes.includes(uploadedFile.type) || uploadedFile.size > maximumFileSizeBytes) {
	showFieldError('avatarContainer');
		isFormValid = false;
		}
		}

		if (isFormValid) {
		try {
			const base64AvatarString = await convertFileToBase64(uploadedFile);
	const generatedSerialNumber = '#' + Math.floor(10000 + Math.random() * 90000);

			const attendeeRegistrationRecord = {
				fullName: trimmedFullName,
				emailAddress: emailInput.value.trim(),
				githubHandle: trimmedGithubHandle,
				avatarBase64Data: base64AvatarString,
				ticketSerial: generatedSerialNumber
			};

localStorage.setItem('codingConfAttendee', JSON.stringify(attendeeRegistrationRecord));
	window.location.href = 'ticket.html';
		} catch (error) {
			console.error('Error processing registration file stream:', error);
		}
	}
	});

function showFieldError(containerElementId) {
	const containerNode = document.getElementById(containerElementId);
	if (containerNode) {
containerNode.classList.add('has-error');
}
}

function clearAllFormErrors() {
	const activeErrors = document.querySelectorAll('.form-group.has-error');
activeErrors.forEach((element) => element.classList.remove('has-error'));
}

function convertFileToBase64(fileStream) {
return new Promise((resolve, reject) => {
	const fileReader = new FileReader();
	fileReader.onload = () => resolve(fileReader.result);
	fileReader.onerror = (readError) => reject(readError);
	fileReader.readAsDataURL(fileStream);
});
}
});