import { useFormik, type FormikHelpers, type FormikValues } from 'formik';
import * as Yup from 'yup';

interface UseFormProps<T> {
  initialValues: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: Yup.ObjectSchema<any>; // Allow schema with any keys
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
}

export function useForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  return useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });
}
