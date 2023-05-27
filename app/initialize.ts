import { query } from 'app/utils/dom';

export function initializeGame() {
    query('.js-loading')!.style.display = 'none';
    query('.js-gameContent')!.style.display = '';
}
