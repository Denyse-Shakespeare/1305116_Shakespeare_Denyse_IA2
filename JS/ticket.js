/* ========================================================
   Coding Conf 2026 - Ticket Rendering & Protection 
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
const retrievedSessionRecord = localStorage.getItem('codingConfAttendee');

// Route Boundary Block: Redirect to index if accessed directly without data
if (!retrievedSessionRecord) {
console.warn('No registration record found in localStorage. Redirecting to index.html');
window.location.href = 'index.html';
return;
}

try {
const attendeeData = JSON.parse(retrievedSessionRecord);

// Target DOM Elements
const displayAttendeeNameNode = document.getElementById('displayAttendeeName');
const displayAttendeeEmailNode = document.getElementById('displayAttendeeEmail');
const displayTicketHolderNameNode = document.getElementById('displayTicketHolderName');
const displayGithubLinkNode = document.getElementById('displayGithubLink');
const displayAvatarImageNode = document.getElementById('displayAvatarImage');
const displayTicketSerialNumberNode = document.getElementById('displayTicketSerialNumber');

// Inject user data safely
if (displayAttendeeNameNode) displayAttendeeNameNode.textContent = attendeeData.fullName;
if (displayAttendeeEmailNode) displayAttendeeEmailNode.textContent = attendeeData.emailAddress;
if (displayTicketHolderNameNode) displayTicketHolderNameNode.textContent = attendeeData.fullName;

if (displayGithubLinkNode) {
displayGithubLinkNode.textContent = attendeeData.githubHandle;
const GithubUsername = attendeeData.githubHandle.replace(/^@/, '');
displayGithubLinkNode.href = `https://github.com/${GithubUsername}`;
}

if (displayAvatarImageNode && attendeeData.avatarBase64Data) {
displayAvatarImageNode.src = attendeeData.avatarBase64Data;
}

if (displayTicketSerialNumberNode) {
displayTicketSerialNumberNode.textContent = attendeeData.ticketSerial;
}

} catch (parsingError) {
console.error('Failed to parse attendee registration record:', parsingError);
}
});