export const checkPingConditions = (sourceRouter, targetIp, routersState) => {
  // Проверка пинга с R1 до R2
  if (sourceRouter === 'R1' && targetIp === '10.2.2.2') {
    const r1Interface = routersState.R1.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/0',
    );
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/1',
    );

    return (
      r1Interface?.ip.split(' ')[0] === '10.2.2.1' &&
      r1Interface?.status === 'no shutdown' &&
      r2Interface?.ip.split(' ')[0] === '10.2.2.2' &&
      r2Interface?.status === 'no shutdown'
    );
  }

  // Проверка пинга с R2 до R1
  if (sourceRouter === 'R2' && targetIp === '10.2.2.1') {
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/1',
    );
    const r1Interface = routersState.R1.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/0',
    );

    return (
      r2Interface?.ip.split(' ')[0] === '10.2.2.2' &&
      r2Interface?.status === 'no shutdown' &&
      r1Interface?.ip.split(' ')[0] === '10.2.2.1' &&
      r1Interface?.status === 'no shutdown'
    );
  }

  // Проверка пинга с R2 до 192.168.1.1
  if (sourceRouter === 'R2' && targetIp === '192.168.1.1') {
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 1/0',
    );

    return r2Interface?.ip.split(' ')[0] === '192.168.1.2' && r2Interface?.status === 'no shutdown';
  }

  // Проверка пинга с R1 до 192.168.1.1
  if (sourceRouter === 'R1' && targetIp === '192.168.1.1') {
    const r1Interface = routersState.R1.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/0',
    );
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/1',
    );
    const r2AdditionalInterface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 1/0',
    );

    return (
      r1Interface?.ip.split(' ')[0] === '10.2.2.1' &&
      r1Interface?.status === 'no shutdown' &&
      r2Interface?.ip.split(' ')[0] === '10.2.2.2' &&
      r2Interface?.status === 'no shutdown' &&
      r2AdditionalInterface?.ip.split(' ')[0] === '192.168.1.1' &&
      r2AdditionalInterface?.status === 'no shutdown'
    );
  }

  // Проверка пинга локального интерфейса R1
  if (sourceRouter === 'R1' && targetIp === '10.2.2.1') {
    const r1Interface = routersState.R1.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/0',
    );
    return r1Interface?.ip.split(' ')[0] === '10.2.2.1' && r1Interface?.status === 'no shutdown';
  }

  // Проверка пинга локального интерфейса R2
  if (sourceRouter === 'R2' && targetIp === '10.2.2.2') {
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 0/1',
    );

    return r2Interface?.ip.split(' ')[0] === '10.2.2.2' && r2Interface?.status === 'no shutdown';
  }

  // Проверка пинга локального интерфейса R2 для 192.168.1.2
  if (sourceRouter === 'R2' && targetIp === '192.168.1.2') {
    const r2Interface = routersState.R2.interfaces.find(
      (iface) => iface.name === 'GigabitEthernet 1/0',
    );

    return r2Interface?.ip.split(' ')[0] === '192.168.1.2' && r2Interface?.status === 'no shutdown';
  }

  return false; // Если ни одно из условий не выполнено
};
