import { TActionProps } from "./types";
import './styles.css';

export const ActionRow = ({ onAction, isPublished }: TActionProps) => {
    return (
        <div className='panel-table-action-row'>
            {
                isPublished
                ? <button 
                    className='panel-reject-button'
                    onClick={() => onAction('hide')} >Скрыть</button>
                : <button 
                    className='panel-approve-button'
                    onClick={() => onAction('publish')}>Опубликовать</button>
            }
            <button 
                className='panel-reject-button'
                onClick={() => onAction('delete')}>Удалить</button>
        </div>
    )
}