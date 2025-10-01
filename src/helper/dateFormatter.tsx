export const formatDate = (date: string | number | Date, showTime: boolean) => {
    if (!date) return;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const time = d.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();

    return `${year}-${month}-${day} ${showTime ? time : ""}`;
};
