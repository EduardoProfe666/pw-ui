import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function getRandomDate() {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const formattedDate = format(randomDate, 'MMMM d, yyyy', { locale: es });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}