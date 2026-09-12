/**
 * Generates a VCALENDAR (.ics) file content string.
 * @param {Object} eventDetails - Details of the event
 * @param {string} eventDetails.title - Title of the event
 * @param {string} eventDetails.description - Description of the event
 * @param {string} eventDetails.location - Location of the event
 * @param {Date} eventDetails.startDate - Start date
 * @param {Date} eventDetails.endDate - End date
 * @returns {string} - The VCALENDAR formatted string
 */
export function generateICS({ title, description, location, startDate, endDate }) {
  // Format date to ICS format (YYYYMMDDTHHMMSSZ)
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsTemplate = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ICON KJSIM//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@icon-kjsim.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsTemplate;
}

/**
 * Triggers a download of the .ics file in the browser.
 * @param {string} icsContent - The VCALENDAR string
 * @param {string} filename - The name of the file to download
 */
export function downloadICS(icsContent, filename = 'event.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
