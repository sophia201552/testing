import createBrowserHistory from 'history/createBrowserHistory';
import { PATH_HOST } from '../appConfig';

export default createBrowserHistory({
    basename: PATH_HOST
});