import { CrudObject } from '@common/defs/types';
import { ROLE } from '@modules/permissions/defs/types';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
  rolesNames: ROLE[];
  permissionsNames: string[];
}
