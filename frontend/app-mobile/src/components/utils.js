


export function formatDateTime(dateTime) {
    /**
     * @param {object} item - The item containing the datetime.
     * @type {string|string}
     */

    let dateString = dateTime ? new Date(dateTime).toISOString() : '';
    return dateString ? dateString.replace('T', ' ').split('.')[0] : 'N/A';
}

export function formatToDate(dateTime) {
    /**
     * @param {object} item - The item containing the datetime.
     * @type {string|string}
     */

    let dateString = dateTime ? new Date(dateTime).toISOString() : '';
    return dateString ? dateString.split('T')[0].split('.')[0] : 'N/A';
}

export function formatToTime(dateTime) {
    /**
     * @param {object} item - The item containing the datetime.
     * @type {string|string}
     */

    let dateString = dateTime ? new Date(dateTime).toISOString() : '';
    return dateString ? dateString.split('T')[1].split('.')[0] : 'N/A';
}