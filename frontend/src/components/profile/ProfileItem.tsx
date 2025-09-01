import { DataList, Skeleton } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import { textContent } from '../../utils/reactChildren.ts';
import FormInput from '../shared/form/sub/FormInput.tsx';
import clsx from 'clsx/lite';

interface ProfileItemProps {
  isEdited: boolean;
  isLoading: boolean;
  title?: string;
}

const ProfileItem = ({
  isEdited,
  isLoading,
  title,
  children,
}: PropsWithChildren<ProfileItemProps>) => {
  const itemClasses = clsx(
    title && 'py-(--space-3)',
    'font-(--font-weight-bold) text-(length:--font-size-3)'
  );

  return (
    <DataList.Item>
      {title && <DataList.Label className="uppercase">{title}</DataList.Label>}
      {!isEdited && (
        <Skeleton loading={isLoading}>
          <DataList.Value className={itemClasses}>{children}</DataList.Value>
        </Skeleton>
      )}
      {isEdited && (
        <FormInput
          id={title}
          placeholder={title}
          defaultValue={textContent(children)}
        ></FormInput>
      )}
    </DataList.Item>
  );
};

export default ProfileItem;
