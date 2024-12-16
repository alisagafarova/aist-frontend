import styles from './TermialConsole.module.scss';
import React, { useState, useRef, useEffect } from 'react';
import TerminalOutput from '../TerminalOutput';
import TerminalInput from '../TerminalInput';

import { convertMaskToCIDR, normalizeInterfaceName } from '../../utils/networkUtils';
import { saveProgress } from '../../utils/saveProgress';
import { useDispatch, useSelector } from 'react-redux';
import { checkPingConditions } from '../../utils/checkPingConditions';
import {
  setRouterOutput,
  setRouterCommandHistory,
  setRouterHistoryIndex,
  setRouterInterfaces,
  setRouterConnectedRoutes,
  setRouterGlobalConfigMode,
  setRouterInterfaceConfigMode,
  setRouterCurrentInterface,
  switchRouter,
  clearRouterOutput,
  addRoute,
  removeRoute,
} from '../../redux/slices/slices';

const TerminalConsole = () => {
  const dispatch = useDispatch();
  const { currentUser, currentLab, currentRouter } = useSelector(
    (state) => state.terminal.currentContext,
  );

  const routers = Object.keys(
    useSelector((state) => state.terminal.users[currentUser]?.labs[currentLab]?.routers) || {},
  );

  const terminalState = useSelector(
    (state) => state.terminal.users[currentUser]?.labs[currentLab]?.routers[currentRouter],
  );

  const routerState = useSelector(
    (state) => state.terminal.users[currentUser]?.labs[currentLab]?.routers,
  );

  const isTaskCompleted = false;
  const [input, setInput] = useState('');
  const routes = terminalState?.routes || [];

  const currentInterface = terminalState?.currentInterface || null;

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const handleSwitchRouter = (routerId) => {
    dispatch(switchRouter(routerId));
  };

  const commands = {
    help: () => {
      const response =
        'Available commands: help, show ip, show ip route, clear, ip route, show run config, no ip route';
      dispatch(
        setRouterOutput({
          currentUser: currentUser,
          currentLab: currentLab,
          currentRouter: currentRouter,
          output: `${getPromptPrefix()} ${response}`,
        }),
      );
      return response;
    },
    'show ip': () => {
      const response = interfaces
        .map((iface) => `${iface.name} ${iface.ip || 'unassigned'}`)
        .join('\n');

      dispatch(
        setRouterOutput({
          currentUser: currentUser,
          currentLab: currentLab,
          currentRouter: currentRouter,
          output: `Interface IP Address\n${response}`,
        }),
      );
      return response;
    },
    'show version': () => {
      const response = `
-------------------------------------------------------
Meet Sergey and his legendary router companion!
        
Forget Cisco IOS-XE, this is **SeriousOS-SuperAwesome**.  
Where uptime isn't just a number, it's a lifestyle choice.  
        
Hardware specs:
  - Processor: Fast enough to keep up with Sergey’s coffee-fueled coding sprees.  
  - Memory: Bigger than Sergey’s list of unfinished projects.  
        
Interfaces:
  - GigabitEthernet0/0 — As fast as Sergey running to catch the last bus.  
  - FastEthernet0/1 — Reliable like grandma's cookie jar.
        
Serial Number: 1234-5678-FRIENDSHIP  
Bootloader Version: Dancing Penguin 7.42  
Flash Memory: Enough space for your configs... and Sergey’s mixtapes.  
        
Need help? Nah, Sergey’s router has got this.  
-------------------------------------------------------
`;

      dispatch(
        setRouterOutput({
          currentUser: currentUser,
          currentLab: currentLab,
          currentRouter: currentRouter,
          output: response,
        }),
      );
      return response;
    },
    clear: () => {
      dispatch(clearRouterOutput()); // Сбрасываем вывод терминала в Redux
      setInput(''); // Очищаем текущий ввод
      return '';
    },

    'show run config': () => {
      const baseConfig = `Building configuration...\n\nCurrent configuration : 122 bytes\n\n!\n`;
      const interfacesConfig = interfaces
        .map(
          (iface) =>
            `interface ${iface.name}\n ip address ${iface.ip || 'unassigned'}\n ${iface.status}`,
        )
        .join('\n');
      const routesConfig = routes.map((route) => `ip route ${route}`).join('\n');
      const response = `${baseConfig}${interfacesConfig}\n${routesConfig}\nend`;
      dispatch(
        setRouterOutput({
          currentUser: currentUser,
          currentLab: currentLab,
          currentRouter: currentRouter,
          output: response,
        }),
      );
      return response;
    },

    'save running config': async () => {
      const progressData = {
        labId: currentLab,
        progressData: {
          routers: routerState, // Состояние маршрутизаторов
          tasks: terminalState.tasks || {}, // Состояние задач
        },
      };

      const result = await saveProgress(progressData);

      const outputMessage = result.success
        ? result.message
        : `Failed to save configuration: ${result.message}`;

      dispatch(
        setRouterOutput({
          currentUser,
          currentLab,
          currentRouter,
          output: `${getPromptPrefix()} ${outputMessage}`,
        }),
      );

      return outputMessage;
    },
    'save run': async () => {
      return commands['save running config']();
    },
  };

  const interfaces = useSelector(
    (state) =>
      state.terminal.users[currentUser]?.labs[currentLab]?.routers[currentRouter].interfaces,
  );

  const isGlobalConfigMode = useSelector(
    (state) =>
      state.terminal.users[currentUser]?.labs[currentLab]?.routers[currentRouter]
        .isGlobalConfigMode,
  );

  const isInterfaceConfigMode = useSelector(
    (state) =>
      state.terminal.users[currentUser]?.labs[currentLab]?.routers[currentRouter]
        ?.isInterfaceConfigMode,
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    const history = terminalState.commandHistory || [];
    const currentIndex = terminalState.historyIndex;

    if (e.key === 'ArrowUp') {
      if (currentIndex + 1 < history.length) {
        const newIndex = currentIndex + 1;
        dispatch(setRouterHistoryIndex(newIndex)); // Обновляем индекс
        setInput(history[newIndex]); // Устанавливаем команду в поле ввода

        // Перемещаем курсор в конец текста после рендера
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(history[newIndex].length, history[newIndex].length);
          }
        }, 0);
      }
    } else if (e.key === 'ArrowDown') {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        dispatch(setRouterHistoryIndex(newIndex)); // Обновляем индекс
        setInput(history[newIndex]); // Устанавливаем команду в поле ввода

        // Перемещаем курсор в конец текста после рендера
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(history[newIndex].length, history[newIndex].length);
          }
        }, 0);
      } else if (currentIndex === 0) {
        dispatch(setRouterHistoryIndex(-1)); // Сбрасываем индекс
        setInput(''); // Очищаем поле ввода
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cmd = input.trim(); // Убираем лишние пробелы

    if (!cmd) {
      // Если команда пустая, добавляем только префикс
      dispatch(
        setRouterOutput({
          currentUser: currentUser,
          currentLab: currentLab,
          currentRouter: currentRouter,
          output: `${getPromptPrefix()}`,
        }),
      );

      setInput(''); // Очищаем поле ввода
      return; // Завершаем выполнение
    }
    dispatch(
      setRouterOutput({
        currentUser: currentUser,
        currentLab: currentLab,
        currentRouter: currentRouter,
        output: `${getPromptPrefix()} ${cmd}`,
      }),
    );

    let response = '';

    if (commands[cmd]) {
      response = commands[cmd](); // Выполняем команду и получаем результат
    } else {
      dispatch(setRouterCommandHistory(cmd)); // Добавляем команду в историю через Redux
      dispatch(setRouterHistoryIndex(-1)); // Сбрасываем индекс истории

      // Обработка базовых команд

      if (cmd === 'configure terminal' || cmd === 'conf t') {
        dispatch(setRouterGlobalConfigMode(true)); // Активируем глобальный режим
        response = 'Entering configuration mode';
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );

        setInput('');
        return; // Завершаем обработку команды
      } else if (isGlobalConfigMode && (cmd.startsWith('interface') || cmd.startsWith('int'))) {
        // Преобразуем 'int' в 'interface' для унификации
        const fullCommand = cmd.startsWith('int ') ? cmd.replace('int ', 'interface ') : cmd;
        const ifaceName = normalizeInterfaceName(fullCommand.slice('interface '.length).trim());
        // Ищем интерфейс в списке
        const iface = interfaces.find((i) => i.name === ifaceName);
        if (iface) {
          dispatch(setRouterCurrentInterface(iface)); // Устанавливаем текущий интерфейс
          dispatch(setRouterInterfaceConfigMode(true)); // Включаем режим конфигурации интерфейса
          response = `Entering configuration mode for ${iface.name}`;
        } else {
          response = `Interface ${ifaceName} not found`;
        }

        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
        return;
      } else if (cmd.startsWith('ping')) {
        const parts = cmd.split(' ');
        if (parts.length === 2) {
          const targetIp = parts[1];

          const isReachable = checkPingConditions(currentRouter, targetIp, routerState);

          if (isReachable) {
            dispatch(
              setRouterOutput({
                currentUser,
                currentLab,
                currentRouter,
                output: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 4/6/8 ms`,
              }),
            );
          } else {
            dispatch(
              setRouterOutput({
                currentUser,
                currentLab,
                currentRouter,
                output: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:\n.....\nSuccess rate is 0 percent (0/5)`,
              }),
            );
          }
        } else {
          response = `Invalid syntax. Usage: ping <target_ip>`;
          dispatch(
            setRouterOutput({
              currentUser,
              currentLab,
              currentRouter,
              output: response,
            }),
          );
        }
      } else if (cmd.startsWith('ip address')) {
        const parts = cmd.split(' ');
        if (parts.length === 4) {
          if (!currentInterface) {
            response = `Error: No interface selected. Use 'interface <name>' to enter interface configuration mode.`;
          } else {
            const ip = parts[2];
            const mask = parts[3];
            const cidr = convertMaskToCIDR(mask);
            const network = `${ip.split('.').slice(0, 3).join('.')}.0/${cidr}`;

            // Обновляем интерфейсы
            const updatedInterfaces = terminalState.interfaces.map((iface) =>
              iface.name === terminalState.currentInterface.name
                ? { ...iface, ip: `${ip} ${mask}` }
                : iface,
            );

            dispatch(setRouterInterfaces(updatedInterfaces));

            // Находим текущий интерфейс в обновленном списке
            const updatedCurrentInterface = updatedInterfaces.find(
              (iface) => iface.name === terminalState.currentInterface.name,
            );

            // Обновляем connectedRoutes, перемещаем объявление выше
            let updatedConnectedRoutes = terminalState.connectedRoutes.filter(
              (route) => route.iface !== terminalState.currentInterface.name,
            );

            if (updatedCurrentInterface?.status === 'no shutdown') {
              updatedConnectedRoutes.push({ network, iface: updatedCurrentInterface.name });
            }

            dispatch(setRouterConnectedRoutes(updatedConnectedRoutes));

            response = `\nIP address set to ${ip} ${mask} on ${currentInterface.name}`;
          }
        } else {
          response = `Invalid syntax. Usage: ip address <ip> <mask>`;
        }
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (cmd.startsWith('no ip address') && currentInterface) {
        const updatedInterfaces = terminalState.interfaces.map((iface) =>
          iface.name === terminalState.currentInterface.name ? { ...iface, ip: '' } : iface,
        );
        dispatch(setRouterInterfaces(updatedInterfaces));
        const updatedConnectedRoutes = terminalState.connectedRoutes.filter(
          (route) => route.iface !== terminalState.currentInterface.name,
        );
        dispatch(setRouterConnectedRoutes(updatedConnectedRoutes));
        response = `\nIP address removed from ${currentInterface.name}`;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (isInterfaceConfigMode && (cmd === 'no shutdown' || cmd === 'no shut')) {
        // Включение интерфейса
        const currentInterface = terminalState.currentInterface;

        if (!currentInterface) {
          response = `Error: No interface selected.`;
          dispatch(
            setRouterOutput({
              currentUser: currentUser,
              currentLab: currentLab,
              currentRouter: currentRouter,
              output: `${getPromptPrefix()} ${response}`,
            }),
          );
          setInput('');
          return;
        }

        // Обновляем интерфейсы с новым статусом
        const updatedInterfaces = terminalState.interfaces.map((iface) =>
          iface.name === currentInterface.name ? { ...iface, status: 'no shutdown' } : iface,
        );

        // Находим обновленный интерфейс
        const updatedCurrentInterface = updatedInterfaces.find(
          (iface) => iface.name === currentInterface.name,
        );

        // Обновляем интерфейсы в состоянии
        dispatch(setRouterInterfaces(updatedInterfaces));

        // Обновляем текущий интерфейс в состоянии
        dispatch(setRouterCurrentInterface(updatedCurrentInterface));
        // Добавляем маршрут в connectedRoutes, если IP установлен
        if (updatedCurrentInterface.ip) {
          const [ip, mask] = updatedCurrentInterface.ip.split(' ');
          const cidr = convertMaskToCIDR(mask);

          if (cidr) {
            const network = `${ip.split('.').slice(0, 3).join('.')}.0/${cidr}`;
            const updatedConnectedRoutes = [
              ...terminalState.connectedRoutes.filter(
                (route) => route.iface !== updatedCurrentInterface.name,
              ),
              { network, iface: updatedCurrentInterface.name },
            ];
            dispatch(setRouterConnectedRoutes(updatedConnectedRoutes)); // Обновляем connectedRoutes
          } else {
            console.error('Invalid subnet mask:', mask);
          }
        } else {
          console.warn('No IP address assigned to the interface.');
        }

        response = `Interface ${updatedCurrentInterface.name} is now active`;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (isInterfaceConfigMode && (cmd === 'shutdown' || cmd === 'shut')) {
        const currentInterface = terminalState.currentInterface;

        if (!currentInterface) {
          response = `Error: No interface selected.`;
          dispatch(
            setRouterOutput({
              currentUser: currentUser,
              currentLab: currentLab,
              currentRouter: currentRouter,
              output: `${getPromptPrefix()} ${response}`,
            }),
          );
          setInput('');
          return;
        }

        // Обновляем интерфейсы с новым статусом
        const updatedInterfaces = terminalState.interfaces.map((iface) =>
          iface.name === currentInterface.name ? { ...iface, status: 'shutdown' } : iface,
        );

        // Находим обновленный интерфейс
        const updatedCurrentInterface = updatedInterfaces.find(
          (iface) => iface.name === currentInterface.name,
        );

        // Обновляем интерфейсы в состоянии
        dispatch(setRouterInterfaces(updatedInterfaces));

        // Обновляем текущий интерфейс в состоянии
        dispatch(setRouterCurrentInterface(updatedCurrentInterface));

        // Удаляем маршрут из connectedRoutes, если IP установлен
        if (updatedCurrentInterface.ip) {
          const [ip, mask] = updatedCurrentInterface.ip.split(' ');
          const cidr = convertMaskToCIDR(mask);

          if (cidr) {
            const network = `${ip.split('.').slice(0, 3).join('.')}.0/${cidr}`;
            const updatedConnectedRoutes = terminalState.connectedRoutes.filter(
              (route) => route.iface !== updatedCurrentInterface.name,
            );
            dispatch(setRouterConnectedRoutes(updatedConnectedRoutes)); // Обновляем connectedRoutes
          } else {
            console.error('Invalid subnet mask:', mask);
          }
        } else {
          console.warn('No IP address assigned to the interface.');
        }

        response = `Interface ${updatedCurrentInterface.name} is now inactive`;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (isInterfaceConfigMode && cmd === 'exit') {
        dispatch(setRouterInterfaceConfigMode(false)); // Выход из интерфейсного режима
        response = 'Exiting to configuration mode';
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
        return;
      } else if (isGlobalConfigMode && cmd === 'exit') {
        dispatch(setRouterGlobalConfigMode(false)); // Выход из глобального режима
        response = 'Exiting to privileged exec mode';
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
        return;
      } else if (cmd === 'show ip interface brief') {
        // Отображение информации по интерфейсам

        response = terminalState.interfaces
          .map(
            (iface) =>
              `\nInterface: ${iface.name}\nIP Address: ${iface.ip || 'unassigned'}\nStatus: ${
                iface.status
              }`,
          )
          .join('\n');
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (
        cmd === 'show run' ||
        cmd === 'show running config' ||
        cmd === 'show running configuration'
      ) {
        // Отображение текущей конфигурации
        response = `Building configuration...\n\nCurrent configuration : 122 bytes\n\n!\n`;

        interfaces.forEach((iface) => {
          response += `interface ${iface.name}\n ip address ${iface.ip || 'unassigned'}\n ${
            iface.status
          }\n!\n`;
        });

        if (routes.length > 0) {
          routes.forEach((route) => {
            response += `ip route ${route}\n`;
          });
        } else {
          response += `! No static routes configured\n`;
        }

        response += `!\nEnd\n`;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (cmd === 'show ip route') {
        // Генерация и вывод таблицы маршрутизации
        response = generateRoutingTable();
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (cmd.startsWith('ip route') || cmd.startsWith('no ip route')) {
        // Обработка команды для добавления/удаления статического маршрута
        response = handleRouteCommand(cmd);
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else if (commands[cmd]) {
        // Выполнение команды из списка доступных команд
        const result = commands[cmd];
        response = typeof result === 'function' ? result() : result;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );
        setInput('');
      } else {
        response = `Invalid command: ${cmd}`;
        dispatch(
          setRouterOutput({
            currentUser: currentUser,
            currentLab: currentLab,
            currentRouter: currentRouter,
            output: `${getPromptPrefix()} ${response}`,
          }),
        );

        setInput('');
      }
      // Добавление результата выполнения команды в вывод
      if (cmd === 'clear') {
        commands[cmd]();
        return; // Завершаем выполнение, чтобы не добавлять вывод команды
      }
    }
    //dispatch(setRouterOutput(`${getPromptPrefix()} ${response}`));

    setInput(''); // Очищаем поле ввода
  };

  const getPromptPrefix = () => {
    if (isInterfaceConfigMode) return `${currentRouter}(config-if)#`;
    if (isGlobalConfigMode) return `${currentRouter}(config)#`;
    return `${currentRouter}>`;
  };

  // Функция для генерации таблицы маршрутизации
  const generateRoutingTable = () => {
    let routeTable = `Router# show ip route\n`;
    routeTable += `Codes: C - connected, S - static\n\n`;
    routeTable += `Gateway of last resort is not set\n\n`;

    // Получаем подключенные маршруты и статические маршруты из состояния
    const { connectedRoutes, routes } = terminalState;

    // Добавляем подключенные маршруты
    if (connectedRoutes.length > 0) {
      connectedRoutes.forEach((route) => {
        routeTable += `C       ${route.network} is directly connected, ${route.iface}\n`;
      });
    } else {
      routeTable += `! No connected routes\n`;
    }

    // Проверяем доступность `next hop` перед добавлением статического маршрута
    if (routes.length > 0) {
      routes.forEach((route) => {
        // Пример формата маршрута: "192.168.1.0/24 [1/0] via 10.2.2.2"
        const parts = route.split(' ');
        const nextHop = parts[parts.length - 1]; // Извлекаем `next hop` (например, 10.2.2.2)

        const isReachable = checkPingConditions(currentRouter, nextHop, routerState);
        if (isReachable) {
          routeTable += `S       ${route}\n`;
        } else {
          routeTable += `! Unreachable static route: ${route}\n`;
        }
      });
    } else {
      routeTable += `! No static routes configured\n`;
    }

    return routeTable;
  };

  // Вспомогательная функция для обработки команд маршрутизации
  const handleRouteCommand = (cmd) => {
    const parts = cmd.split(' ');

    if (cmd.startsWith('ip route') && parts.length === 5) {
      const destination = parts[2];
      const mask = parts[3];
      const nextHop = parts[4];
      const cidr = convertMaskToCIDR(mask);
      const routeString = `${destination}/${cidr} [1/0] via ${nextHop}`;
      const routes = terminalState.routes; // Получаем маршруты из Redux

      const routeExists = routes.some((route) => route.startsWith(`${destination}/${cidr}`));

      if (routeExists) {
        return `Route ${destination}/${cidr} already exists.`;
      } else {
        // Добавляем статический маршрут
        dispatch(addRoute(routeString));
        return `Static route added: ${routeString}`;
      }
    }

    if (cmd.startsWith('no ip route') && parts.length === 6) {
      const destination = parts[3];
      const mask = parts[4];
      const cidr = convertMaskToCIDR(mask);
      const routeString = `${destination}/${cidr}`;
      const routes = terminalState.routes; // Получаем маршруты из Redux

      const routeExists = routes.some((route) => route.startsWith(routeString));

      if (routeExists) {
        dispatch(removeRoute(routeString)); // Удаляем маршрут через Redux
        return `Static route removed: ${routeString}`;
      } else {
        return `Route ${destination}/${cidr} not found.`;
      }
    }

    return `Invalid command syntax. Use: ip route <destination> <mask> <next-hop> or no ip route <destination> <mask> <next-hop>`;
  };

  useEffect(() => {
    if (containerRef.current && terminalState?.output?.length) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [terminalState?.output]);

  return (
    <div className={styles.lab_terminal}>
      <div className={styles.tabs}>
        {routers
          .filter((routerId) => {
            // Для lab1 и lab2 показываем только R1
            if (currentLab === 'lab1' || currentLab === 'lab2') {
              return routerId === 'R1';
            }
            // Для остальных лаб возвращаем все маршрутизаторы
            return true;
          })
          .map((routerId) => (
            <button
              key={routerId}
              className={`${styles.tab} ${routerId === currentRouter ? styles.active_tab : ''}`}
              onClick={() => handleSwitchRouter(routerId)}>
              {routerId}
            </button>
          ))}
      </div>

      <div
        className={`${styles.terminal} ${isTaskCompleted ? styles.successBorder : ''}`}
        ref={containerRef}
        onClick={(e) => {
          if (inputRef.current) {
            // Сохраняем текущее положение прокрутки страницы и терминала
            const scrollTopBeforeFocus = window.scrollY;
            const terminalScrollTopBeforeFocus = containerRef.current.scrollTop;

            // Устанавливаем фокус на строку ввода
            inputRef.current.focus();

            // Восстанавливаем положение прокрутки страницы и терминала
            window.scrollTo(0, scrollTopBeforeFocus);
            containerRef.current.scrollTop = terminalScrollTopBeforeFocus;
          }
        }}>
        <TerminalOutput output={terminalState?.output || []} />
        <TerminalInput
          input={input}
          promptPrefix={getPromptPrefix()}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default TerminalConsole;
