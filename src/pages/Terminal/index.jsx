import styles from "./Terminal.module.scss";
import ImageLab from '../../images/static_route.png';
import TaskDescription from '../../components/TaskDescription';
import CheckButton from '../../components/CheckButton';
import { Link } from 'react-router-dom';
import TerminalConsole from '../../components/TermialConsole';


export const Terminal = () => {
  return (
    <div className={styles.lab_block}>
      <div className={styles.lab_environment}>
        <TaskDescription />
        <TerminalConsole />
      </div>
      <div className={styles.lab_buttons}>
        <Link to='/interface-config/'><button className={styles.button_previous}> Вернуться к теме</button></Link>
        <CheckButton/>
      </div>
    </div>
  );
};
