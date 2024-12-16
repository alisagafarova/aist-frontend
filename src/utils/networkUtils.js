export function convertMaskToCIDR(mask) {
  return (
    mask
      .split('.')
      .map((octet) => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('')
      .split('1').length - 1
  );
}

export function ipToBinary(ip) {
  return ip
    .split('.')
    .map((octet) => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('');
}

export function sortRoutes(routes) {
  return routes.sort((a, b) => {
    const [destA] = a.split('/');
    const [destB] = b.split('/');
    return ipToBinary(destA).localeCompare(ipToBinary(destB));
  });
}

export const normalizeInterfaceName = (name) => {
  return name
    .replace(/^Gi(\d)/, 'GigabitEthernet $1') // Заменяем 'Gi' на 'GigabitEthernet', если за ним следуют цифры
    .replace(/^Fa(\d)/, 'FastEthernet $1') // Заменяем 'Fa' на 'FastEthernet', если за ним следуют цифры
    .replace(/(GigabitEthernet|FastEthernet)(\d)/, '$1 $2'); // Добавляем пробел перед цифрами для полного названия
};
