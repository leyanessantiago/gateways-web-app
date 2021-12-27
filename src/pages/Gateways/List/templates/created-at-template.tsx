export default function createdAtTemplate(createdAt: Date){
    const dateFormatter = new Intl.DateTimeFormat('default', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return createdAt ? dateFormatter.format(new Date(createdAt)) : '';
}
