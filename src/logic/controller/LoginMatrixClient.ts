import type {AuthenticatedMatrixClient} from '@/logic/controller/AuthenticatedMatrixClient';
import {MatrixClient} from '@/logic/controller/MatrixClient';
import router from '@/router';

class LoginMatrixClient extends MatrixClient {}

export {LoginMatrixClient};
