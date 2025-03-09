import { RHFSelect, RHFTextField } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import { User } from '@modules/users/defs/types';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';

interface UpdateUserFormProps {
  item: User;
}

const UpdateUserForm = (props: UpdateUserFormProps) => {
  const { item } = props;
  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Email format is incorrect')
      .required('This field is required'),
    password: Yup.string(),
    role: Yup.mixed<ROLE>()
      .oneOf(Object.values(ROLE), (_values) => {
        return `Role must be one of: ${ROLES_OPTIONS.map((option) => option.label).join(', ')}`;
      })
      .required('This field is required'),
  });
  const defaultValues: UpdateOneInput = {
    email: item.email,
    password: '',
    role: item.rolesNames[0],
  };
  return (
    <>
      <UpdateCrudItemForm<User, UpdateOneInput>
        item={item}
        routes={Routes.Users}
        useItems={useUsers}
        schema={schema}
        defaultValues={defaultValues}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="email" label="Email" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="password" label="Password" type="password" />
          </Grid>
          <Grid item xs={6}>
            <RHFSelect name="role" label="Role">
              {ROLES_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateUserForm;
