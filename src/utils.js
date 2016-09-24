export const timeSince = (date) => {
  if (typeof date === 'string') {
    date = Date.parse(date);
  }
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval}d`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval}h`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval}m`;
  }
  return 'now';
};
